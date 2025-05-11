import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Database, Brain, Zap, User, Check, Loader2, RefreshCw, AlertTriangle, RefreshCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AddFlowBlockDialog } from './AddFlowBlockDialog';
import { v4 as uuidv4 } from 'uuid';
import { flowBlockOptions } from '@/data/flowBlockOptions';

interface BlockConfig {
  id: string;
  block_type: string;
  block_name: string;
  is_functional: boolean;
  config_data: Record<string, any>;
  credentials?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export function FlowBlocksConfig() {
  const [blockConfigs, setBlockConfigs] = useState<BlockConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('collect');
  const [editingConfig, setEditingConfig] = useState<BlockConfig | null>(null);
  const [credentialJson, setCredentialJson] = useState<string>('{}');
  const [configJson, setConfigJson] = useState<string>('{}');
  const [initializingBlocks, setInitializingBlocks] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [missingBlocks, setMissingBlocks] = useState<{type: string, name: string}[]>([]);

  // Enhanced function to check for missing blocks
  const checkForMissingBlocks = useCallback((dbBlocks: any[]) => {
    const missing: {type: string, name: string}[] = [];
    const dbBlockMap = new Map();
    
    // Create a map of existing blocks for quick lookup
    dbBlocks.forEach(block => {
      dbBlockMap.set(`${block.block_type}:${block.block_name}`, true);
    });
    
    // Check each block in flowBlockOptions
    Object.entries(flowBlockOptions).forEach(([blockType, options]) => {
      options.forEach((option) => {
        if (!dbBlockMap.has(`${blockType}:${option}`)) {
          missing.push({type: blockType, name: option});
        }
      });
    });
    
    setMissingBlocks(missing);
    return missing;
  }, []);

  // Enhanced function to initialize flow blocks from flowBlockOptions
  const initializeExistingBlocks = async () => {
    try {
      setInitializingBlocks(true);
      setErrorMessage(null);
      console.log('Initializing all flow blocks from existing options...');
      
      // Check existing blocks first to avoid duplicates
      const { data: existingBlocks, error: fetchError } = await supabase
        .from('flow_block_configs')
        .select('block_type, block_name');
        
      if (fetchError) {
        console.error('Error fetching existing blocks:', fetchError);
      }
      
      // Create a map of existing blocks for quick lookup
      const existingBlockMap = new Map();
      if (existingBlocks) {
        existingBlocks.forEach(block => {
          existingBlockMap.set(`${block.block_type}:${block.block_name}`, true);
        });
      }
      
      // Collect all blocks from flowBlockOptions that don't exist yet
      const blocksToCreate: BlockConfig[] = [];
      
      // Process all flow block options from the data
      Object.entries(flowBlockOptions).forEach(([blockType, options]) => {
        options.forEach((option) => {
          // Skip if block already exists
          if (existingBlockMap.has(`${blockType}:${option}`)) {
            console.log(`Block ${blockType}:${option} already exists, skipping`);
            return;
          }
          
          // Create descriptions based on block type and name
          let description = '';
          switch (option) {
            case 'User Text':
              description = 'Allows users to provide specific instructions or data via direct text input';
              break;
            case 'Upload Sheet':
              description = 'Enables users to upload spreadsheets with product or inventory data';
              break;
            case 'All Listing Info':
              description = 'Retrieves complete information about Amazon product listings';
              break;
            case 'Get Keywords':
              description = 'Performs keyword research for product listings';
              break;
            case 'Estimate Sales':
              description = 'Calculates sales projections based on historical data and trends';
              break;
            case 'Review Information':
              description = 'Collects and analyzes customer reviews for products';
              break;
            case 'Scrape Sheet':
              description = 'Extracts data from Google Sheets or other online spreadsheets';
              break;
            case 'Seller Account Feedback':
              description = 'Gathers seller performance metrics and customer feedback';
              break;
            case 'Email Parsing':
              description = 'Processes and extracts structured data from emails';
              break;
            case 'Basic AI Analysis':
              description = 'Performs standard AI analysis on collected data';
              break;
            case 'Listing Analysis':
              description = 'Analyzes product listings for optimization opportunities';
              break;
            case 'Insights Generation':
              description = 'Creates strategic insights from analyzed data';
              break;
            case 'Review Analysis':
              description = 'Analyzes sentiment and patterns in customer reviews';
              break;
            case 'AI Summary':
              description = 'Generates concise AI summaries of complex data';
              break;
            case 'Push to Amazon':
              description = 'Uploads optimized content directly to Amazon listings';
              break;
            case 'Send Email':
              description = 'Sends automated emails with report results';
              break;
            case 'Human in the Loop':
              description = 'Pauses workflow for human review and approval';
              break;
            case 'Agent':
              description = 'Delegates tasks to specialized AI agents';
              break;
            default:
              description = `${option} block for ${blockType} operations`;
          }
          
          // Set up basic schema based on block type
          let schema = {};
          
          if (blockType === 'collect') {
            if (option === 'User Text') {
              schema = {
                type: 'object',
                properties: {
                  prompt: {
                    type: 'string',
                    description: 'Instructions for the user'
                  },
                  required: {
                    type: 'boolean',
                    description: 'Whether input is required'
                  }
                }
              };
            } else if (option === 'Upload Sheet') {
              schema = {
                type: 'object',
                properties: {
                  fileTypes: {
                    type: 'array',
                    description: 'Allowed file extensions',
                    default: ['.xlsx', '.csv']
                  },
                  maxSizeInMb: {
                    type: 'number',
                    description: 'Maximum file size in MB',
                    default: 10
                  }
                }
              };
            }
          }
          
          // Add to blocks to create
          blocksToCreate.push({
            id: uuidv4(),
            block_type: blockType,
            block_name: option,
            is_functional: false,
            config_data: {
              description: description,
              schema: schema
            },
            credentials: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        });
      });
      
      console.log(`Creating ${blocksToCreate.length} flow blocks`);
      
      if (blocksToCreate.length === 0) {
        toast({
          title: 'All blocks already exist',
          description: 'No new blocks needed to be created.',
        });
        setInitializingBlocks(false);
        return;
      }
      
      // Insert blocks into database in batches to avoid payload size limits
      const batchSize = 20;
      for (let i = 0; i < blocksToCreate.length; i += batchSize) {
        const batch = blocksToCreate.slice(i, i + batchSize);
        const { error } = await supabase
          .from('flow_block_configs')
          .insert(batch);
          
        if (error) {
          console.error(`Error creating batch ${i/batchSize + 1}:`, error);
          throw error;
        }
        
        console.log(`Batch ${i/batchSize + 1} created successfully`);
      }
      
      console.log('All flow blocks created successfully');
      
      // Fetch the newly created blocks
      await fetchBlockConfigs();
      
      toast({
        title: 'Flow blocks initialized',
        description: `${blocksToCreate.length} flow blocks have been added to the configuration.`,
      });
    } catch (error) {
      console.error('Error initializing flow blocks:', error);
      setErrorMessage('Failed to initialize flow blocks. Please check your permissions or try again.');
      toast({
        title: 'Error',
        description: 'Failed to initialize flow blocks',
        variant: 'destructive'
      });
    } finally {
      setInitializingBlocks(false);
    }
  };

  // Sync missing blocks
  const syncMissingBlocks = async () => {
    try {
      setInitializingBlocks(true);
      setErrorMessage(null);
      console.log('Syncing missing flow blocks...');
      
      // Prepare blocks to create
      const blocksToCreate = missingBlocks.map(block => {
        // Generate description and schema based on block type and name
        let description = '';
        let schema = {};
        
        // Set description based on block name (simplified for brevity)
        description = `${block.name} block for ${block.type} operations`;
        
        // Set schema based on block type and name if needed
        if (block.type === 'collect' && block.name === 'User Text') {
          schema = {
            type: 'object',
            properties: {
              prompt: {
                type: 'string',
                description: 'Instructions for the user'
              }
            }
          };
        }
        
        return {
          id: uuidv4(),
          block_type: block.type,
          block_name: block.name,
          is_functional: false,
          config_data: {
            description: description,
            schema: schema
          },
          credentials: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
      });
      
      // Insert blocks into database
      if (blocksToCreate.length === 0) {
        toast({
          title: 'No blocks to sync',
          description: 'All blocks are already in the database.',
        });
        setInitializingBlocks(false);
        return;
      }
      
      // Insert in batches to avoid payload size limits
      const batchSize = 20;
      for (let i = 0; i < blocksToCreate.length; i += batchSize) {
        const batch = blocksToCreate.slice(i, i + batchSize);
        const { error } = await supabase
          .from('flow_block_configs')
          .insert(batch);
          
        if (error) {
          console.error(`Error creating batch ${i/batchSize + 1}:`, error);
          throw error;
        }
      }
      
      toast({
        title: 'Blocks synchronized',
        description: `${blocksToCreate.length} flow blocks have been added to the database.`,
      });
      
      // Clear missing blocks and fetch updated list
      setMissingBlocks([]);
      await fetchBlockConfigs();
      
    } catch (error) {
      console.error('Error syncing blocks:', error);
      toast({
        title: 'Error',
        description: 'Failed to sync missing blocks',
        variant: 'destructive'
      });
    } finally {
      setInitializingBlocks(false);
    }
  };

  // Fetch block configs function
  const fetchBlockConfigs = useCallback(async () => {
    console.log('Fetching flow block configurations...');
    setLoading(true);
    setErrorMessage(null);
    try {
      const { data, error } = await supabase
        .from('flow_block_configs')
        .select('*')
        .order('block_type')
        .order('block_name');
        
      if (error) {
        console.error('Error fetching block configs:', error);
        throw error;
      }
      
      console.log('Fetched block configurations:', data);
      
      // Transform Supabase data to match BlockConfig type
      if (data) {
        const transformedData: BlockConfig[] = data.map(item => ({
          ...item,
          config_data: typeof item.config_data === 'string' 
            ? JSON.parse(item.config_data) 
            : item.config_data,
          credentials: typeof item.credentials === 'string' 
            ? JSON.parse(item.credentials) 
            : item.credentials
        }));
        
        setBlockConfigs(transformedData);
        
        // Check for missing blocks
        const missing = checkForMissingBlocks(data);
        
        // If we found missing blocks, show a toast
        if (missing.length > 0) {
          toast({
            title: `${missing.length} blocks missing from database`,
            description: 'Some flow blocks defined in code are not in the database. Would you like to sync them?',
            action: (
              <Button 
                variant="default" 
                size="sm" 
                onClick={syncMissingBlocks} 
                disabled={initializingBlocks}
              >
                {initializingBlocks ? 'Syncing...' : 'Sync Blocks'}
              </Button>
            ),
            duration: 10000,
          });
        }
        
        // If no blocks, suggest initializing default blocks
        if (data.length === 0) {
          toast({
            title: 'No flow blocks found',
            description: 'Would you like to initialize the default flow blocks?',
            action: (
              <Button 
                variant="default" 
                size="sm" 
                onClick={initializeExistingBlocks} 
                disabled={initializingBlocks}
              >
                {initializingBlocks ? 'Initializing...' : 'Initialize Blocks'}
              </Button>
            ),
            duration: 10000,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching block configs:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to load block configurations';
      setErrorMessage(errorMsg);
      
      // Show "Initialize Default Blocks" button in case of permission issues
      toast({
        title: 'Error fetching blocks',
        description: 'Unable to fetch flow blocks. Please check your database permissions.',
        variant: 'destructive',
        action: (
          <Button 
            variant="default" 
            size="sm" 
            onClick={initializeExistingBlocks} 
            disabled={initializingBlocks}
          >
            {initializingBlocks ? 'Initializing...' : 'Initialize All Blocks'}
          </Button>
        ),
      });
    } finally {
      setLoading(false);
    }
  }, [checkForMissingBlocks, initializingBlocks]);

  // Refresh the block configs
  const handleRefresh = async () => {
    console.log('Manual refresh triggered');
    setRefreshing(true);
    await fetchBlockConfigs();
    setRefreshing(false);
    
    toast({
      title: 'Refreshed',
      description: 'Block configurations have been refreshed',
    });
  };

  // Fetch block configs on component mount
  useEffect(() => {
    console.log('Component mounted, fetching block configs');
    fetchBlockConfigs();
  }, [fetchBlockConfigs]);
  
  // Filter blocks by current tab
  const filteredBlocks = blockConfigs.filter(block => block.block_type === currentTab);
  
  // Group block types for counting
  const blockTypeCounts = blockConfigs.reduce((acc: Record<string, number>, block) => {
    acc[block.block_type] = (acc[block.block_type] || 0) + 1;
    return acc;
  }, {});
  
  // Handle toggling block functional status
  const toggleBlockFunctional = async (blockId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('flow_block_configs')
        .update({ is_functional: !currentStatus })
        .eq('id', blockId);
        
      if (error) throw error;
      
      // Update local state
      setBlockConfigs(prev => prev.map(block => {
        if (block.id === blockId) {
          return {
            ...block,
            is_functional: !currentStatus
          };
        }
        return block;
      }));
      
      toast({
        title: 'Block updated',
        description: `Block is now ${!currentStatus ? 'functional' : 'in demo mode'}`,
      });
    } catch (error) {
      console.error('Error updating block:', error);
      toast({
        title: 'Update failed',
        description: 'Could not update block status',
        variant: 'destructive'
      });
    }
  };
  
  // Open block config editor - Make sure this works correctly
  const openBlockEditor = (block: BlockConfig) => {
    console.log("Opening block editor for:", block.block_name);
    setEditingConfig(block);
    setCredentialJson(JSON.stringify(block.credentials || {}, null, 2));
    setConfigJson(JSON.stringify(block.config_data || {}, null, 2));
  };
  
  // Save block config changes
  const saveBlockChanges = async () => {
    if (!editingConfig) return;
    
    try {
      console.log("Saving changes for block:", editingConfig.block_name);
      // Parse JSON values
      let parsedCredentials = {};
      let parsedConfig = {};
      
      try {
        parsedCredentials = JSON.parse(credentialJson);
      } catch (e) {
        console.error("JSON parsing error for credentials:", e);
        throw new Error('Invalid credentials JSON');
      }
      
      try {
        parsedConfig = JSON.parse(configJson);
      } catch (e) {
        console.error("JSON parsing error for config:", e);
        throw new Error('Invalid config JSON');
      }
      
      const { error } = await supabase
        .from('flow_block_configs')
        .update({
          credentials: parsedCredentials,
          config_data: parsedConfig,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingConfig.id);
        
      if (error) {
        console.error("Database update error:", error);
        throw error;
      }
      
      console.log("Successfully updated block config in database");
      
      // Update local state
      setBlockConfigs(prev => prev.map(block => {
        if (block.id === editingConfig.id) {
          return {
            ...block,
            credentials: parsedCredentials,
            config_data: parsedConfig,
            updated_at: new Date().toISOString()
          };
        }
        return block;
      }));
      
      // Close editor
      setEditingConfig(null);
      
      toast({
        title: 'Block updated',
        description: 'Block configuration saved successfully',
      });
    } catch (error) {
      console.error('Error saving block config:', error);
      toast({
        title: 'Save failed',
        description: (error as Error).message || 'Could not save block configuration',
        variant: 'destructive'
      });
    }
  };
  
  // Get icon for block type
  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'collect':
        return <Database className="w-4 h-4" />;
      case 'think':
        return <Brain className="w-4 h-4" />;
      case 'act':
        return <Zap className="w-4 h-4" />;
      case 'agent':
        return <User className="w-4 h-4" />;
      default:
        return null;
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Flow Blocks Configuration</CardTitle>
              <CardDescription>
                Configure which blocks are functional and which run in demo mode
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              {missingBlocks.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={syncMissingBlocks} 
                  disabled={initializingBlocks}
                  className="bg-yellow-50 border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                >
                  <RefreshCcw className={`w-4 h-4 mr-2 ${initializingBlocks ? 'animate-spin' : ''}`} />
                  Sync {missingBlocks.length} Missing Blocks
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                onClick={initializeExistingBlocks} 
                disabled={initializingBlocks}
              >
                {initializingBlocks ? 'Initializing...' : 'Initialize All Blocks'}
              </Button>
              <AddFlowBlockDialog onBlockAdded={fetchBlockConfigs} />
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {errorMessage && (
            <div className="mb-4 p-4 border border-yellow-200 bg-yellow-50 rounded-lg flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-800">Database Access Issue</p>
                <p className="text-sm text-yellow-700 mt-1">{errorMessage}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 border-yellow-300 text-yellow-700 hover:text-yellow-800 hover:bg-yellow-100" 
                  onClick={initializeExistingBlocks} 
                  disabled={initializingBlocks}
                >
                  {initializingBlocks ? 'Initializing...' : 'Initialize All Blocks'}
                </Button>
              </div>
            </div>
          )}
        
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="collect" className="flex items-center space-x-2">
                <Database className="w-4 h-4" />
                <span>Collect ({blockTypeCounts['collect'] || 0})</span>
              </TabsTrigger>
              <TabsTrigger value="think" className="flex items-center space-x-2">
                <Brain className="w-4 h-4" />
                <span>Think ({blockTypeCounts['think'] || 0})</span>
              </TabsTrigger>
              <TabsTrigger value="act" className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Act ({blockTypeCounts['act'] || 0})</span>
              </TabsTrigger>
              <TabsTrigger value="agent" className="flex items-center space-x-2">
                <User className="w-4 h-4" />
                <span>Agent ({blockTypeCounts['agent'] || 0})</span>
              </TabsTrigger>
            </TabsList>
            
            {['collect', 'think', 'act', 'agent'].map(tabName => (
              <TabsContent key={tabName} value={tabName} className="mt-4">
                {filteredBlocks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No {tabName} blocks configured
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredBlocks.map(block => (
                      <Card key={block.id}>
                        <CardHeader className="py-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base flex items-center">
                              {getBlockIcon(block.block_type)}
                              <span className="ml-2">{block.block_name}</span>
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                              <Switch
                                id={`switch-${block.id}`}
                                checked={block.is_functional}
                                onCheckedChange={() => toggleBlockFunctional(block.id, block.is_functional)}
                              />
                              <Label htmlFor={`switch-${block.id}`}>
                                {block.is_functional ? 'Functional' : 'Demo'}
                              </Label>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="text-sm">
                            {block.config_data?.description || 'No description available'}
                          </div>
                          {block.is_functional && (
                            <div className="mt-2 flex">
                              <div className="mt-1 text-xs text-green-600 flex items-center">
                                <Check className="w-3 h-3 mr-1" />
                                This block is fully implemented
                              </div>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="py-2 flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openBlockEditor(block)}
                          >
                            Configure
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Block Configuration Dialog */}
      {editingConfig && (
        <Card>
          <CardHeader>
            <CardTitle>Configure Block: {editingConfig.block_name}</CardTitle>
            <CardDescription>
              Edit the configuration and credentials for this block
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Block Type</Label>
              <Input value={editingConfig.block_type} readOnly className="bg-muted" />
            </div>
            <div>
              <Label>Block Name</Label>
              <Input value={editingConfig.block_name} readOnly className="bg-muted" />
            </div>
            <div>
              <Label>Configuration Data (JSON)</Label>
              <Textarea 
                value={configJson}
                onChange={(e) => setConfigJson(e.target.value)}
                className="font-mono h-40"
              />
            </div>
            <div>
              <Label>Credentials (JSON, stored encrypted)</Label>
              <Textarea 
                value={credentialJson}
                onChange={(e) => setCredentialJson(e.target.value)}
                className="font-mono h-40"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingConfig(null)}>
              Cancel
            </Button>
            <Button onClick={saveBlockChanges}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
