
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Database, Brain, Zap, User, Check, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AddFlowBlockDialog } from './AddFlowBlockDialog';
import { v4 as uuidv4 } from 'uuid';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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

const DEMO_BLOCKS: BlockConfig[] = [
  {
    id: "demo-1",
    block_type: 'collect',
    block_name: 'Get Account Health',
    is_functional: false,
    config_data: {
      description: 'Collects account health metrics from marketplace',
      schema: {
        type: 'object',
        properties: {
          marketplace: { type: 'string', enum: ['amazon', 'walmart', 'ebay'] }
        }
      }
    },
    credentials: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-2",
    block_type: 'collect',
    block_name: 'Fetch Reviews',
    is_functional: false,
    config_data: {
      description: 'Collects product reviews from marketplace',
      schema: {
        type: 'object',
        properties: {
          marketplace: { type: 'string', enum: ['amazon', 'walmart', 'ebay'] },
          asin: { type: 'string' }
        }
      }
    },
    credentials: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-3",
    block_type: 'think',
    block_name: 'Analyze Reviews',
    is_functional: false,
    config_data: {
      description: 'Analyzes product reviews to extract insights',
      model: 'gpt-4'
    },
    credentials: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-4",
    block_type: 'act',
    block_name: 'Send Email Alert',
    is_functional: false,
    config_data: {
      description: 'Sends an email alert based on configured triggers',
      templates: {
        default: 'Alert: {{alertType}} for product {{productId}}'
      }
    },
    credentials: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: "demo-5",
    block_type: 'agent',
    block_name: 'Customer Support Agent',
    is_functional: false,
    config_data: {
      description: 'AI agent that handles customer support inquiries',
      model: 'gpt-4',
      capabilities: ['email', 'chat']
    },
    credentials: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

export function FlowBlocksConfig() {
  const [blockConfigs, setBlockConfigs] = useState<BlockConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>('collect');
  const [editingConfig, setEditingConfig] = useState<BlockConfig | null>(null);
  const [credentialJson, setCredentialJson] = useState<string>('{}');
  const [configJson, setConfigJson] = useState<string>('{}');
  const [initializingBlocks, setInitializingBlocks] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Fetch block configs function
  const fetchBlockConfigs = useCallback(async () => {
    console.log('Fetching block configurations...');
    setLoading(true);
    setAuthError(null);
    
    try {
      const { data, error } = await supabase
        .from('flow_block_configs')
        .select('*')
        .order('block_type')
        .order('block_name');
        
      if (error) {
        console.error('Error fetching block configs:', error);
        if (error.code === '42501') { // Permission denied error
          setAuthError('Permission denied: You need to be authenticated with the right permissions to access flow block configurations.');
          setDemoMode(true);
          setBlockConfigs(DEMO_BLOCKS);
        } else {
          throw error;
        }
      } else {
        console.log('Fetched block configurations:', data);
        
        // Transform Supabase data to match BlockConfig type
        if (data && data.length > 0) {
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
          setDemoMode(false);
        } else {
          // If no data, switch to demo mode
          setBlockConfigs(DEMO_BLOCKS);
          setDemoMode(true);
          
          toast({
            title: 'Demo Mode Active',
            description: 'No flow blocks found in database. Displaying demo blocks.',
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching block configs:', error);
      setDemoMode(true);
      setBlockConfigs(DEMO_BLOCKS);
      
      toast({
        title: 'Error',
        description: 'Failed to load block configurations. Showing demo blocks instead.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize sample blocks if none exist
  const initializeSampleBlocks = async () => {
    try {
      setInitializingBlocks(true);
      console.log('Initializing sample flow blocks...');
      
      const sampleBlocks = DEMO_BLOCKS.map(block => ({
        ...block,
        id: uuidv4() // Generate new UUIDs
      }));
      
      // Insert sample blocks
      const { error } = await supabase
        .from('flow_block_configs')
        .insert(sampleBlocks);
        
      if (error) {
        console.error('Error creating sample blocks:', error);
        
        if (error.code === '42501') { // Permission denied
          setAuthError('Permission denied: You need to authenticate to create flow blocks.');
          toast({
            title: 'Authentication Required',
            description: 'You need to sign in with appropriate permissions to create flow blocks.',
            variant: 'destructive'
          });
        } else {
          throw error;
        }
      } else {
        console.log('Sample blocks created successfully');
        
        // Fetch the newly created blocks
        await fetchBlockConfigs();
        setDemoMode(false);
        
        toast({
          title: 'Sample blocks created',
          description: 'Sample flow blocks have been added to help you get started.',
        });
      }
    } catch (error) {
      console.error('Error initializing sample blocks:', error);
      toast({
        title: 'Error',
        description: 'Failed to initialize sample blocks. You may need proper permissions.',
        variant: 'destructive'
      });
    } finally {
      setInitializingBlocks(false);
    }
  };

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
    if (demoMode) {
      toast({
        title: 'Demo Mode',
        description: 'In demo mode, block status changes are not saved to the database.',
        variant: 'default'
      });
      
      // Update local state only in demo mode
      setBlockConfigs(prev => prev.map(block => {
        if (block.id === blockId) {
          return {
            ...block,
            is_functional: !currentStatus
          };
        }
        return block;
      }));
      return;
    }
    
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
  
  // Open block config editor
  const openBlockEditor = (block: BlockConfig) => {
    setEditingConfig(block);
    setCredentialJson(JSON.stringify(block.credentials || {}, null, 2));
    setConfigJson(JSON.stringify(block.config_data || {}, null, 2));
  };
  
  // Save block config changes
  const saveBlockChanges = async () => {
    if (!editingConfig) return;
    
    if (demoMode) {
      toast({
        title: 'Demo Mode',
        description: 'In demo mode, configuration changes are not saved to the database.',
        variant: 'default'
      });
      
      // Update local state only in demo mode
      try {
        const parsedCredentials = JSON.parse(credentialJson);
        const parsedConfig = JSON.parse(configJson);
        
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
      } catch (error) {
        console.error('Error parsing JSON:', error);
        toast({
          title: 'Invalid JSON',
          description: (error as Error).message || 'Please check your JSON syntax',
          variant: 'destructive'
        });
      }
      return;
    }
    
    try {
      // Parse JSON values
      let parsedCredentials = {};
      let parsedConfig = {};
      
      try {
        parsedCredentials = JSON.parse(credentialJson);
      } catch (e) {
        throw new Error('Invalid credentials JSON');
      }
      
      try {
        parsedConfig = JSON.parse(configJson);
      } catch (e) {
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
        
      if (error) throw error;
      
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
      {authError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            {authError}
          </AlertDescription>
        </Alert>
      )}
      
      {demoMode && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Demo Mode Active</AlertTitle>
          <AlertDescription>
            You're viewing demo blocks. Changes will not be saved to the database.
            {!authError && (
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={initializeSampleBlocks} 
                  disabled={initializingBlocks}
                >
                  {initializingBlocks ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  {initializingBlocks ? 'Creating...' : 'Create Real Sample Blocks'}
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    
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
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              {!demoMode && <AddFlowBlockDialog onBlockAdded={fetchBlockConfigs} />}
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
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
              {demoMode && <span className="text-amber-500 ml-2">(Changes won't be saved in demo mode)</span>}
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
