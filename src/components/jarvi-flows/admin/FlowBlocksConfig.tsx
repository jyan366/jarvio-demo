
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Database, Brain, Zap, User, Check, Loader2, Plus, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AddFlowBlockDialog } from './AddFlowBlockDialog';

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

  // Fetch block configs function
  const fetchBlockConfigs = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('flow_block_configs')
        .select('*')
        .order('block_type')
        .order('block_name');
        
      if (error) throw error;
      
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
      }
    } catch (error) {
      console.error('Error fetching block configs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load block configurations',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh the block configs
  const handleRefresh = async () => {
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
  
  // Open block config editor
  const openBlockEditor = (block: BlockConfig) => {
    setEditingConfig(block);
    setCredentialJson(JSON.stringify(block.credentials || {}, null, 2));
    setConfigJson(JSON.stringify(block.config_data || {}, null, 2));
  };
  
  // Save block config changes
  const saveBlockChanges = async () => {
    if (!editingConfig) return;
    
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
              <AddFlowBlockDialog onBlockAdded={fetchBlockConfigs} />
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
