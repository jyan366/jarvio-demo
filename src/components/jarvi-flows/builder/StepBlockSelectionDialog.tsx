import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Database, Brain, Zap, User, Settings } from 'lucide-react';
import { FlowBlock } from '@/types/flowTypes';
import { supabase } from '@/integrations/supabase/client';
import { agentsData } from '@/data/agentsData';

interface StepBlockSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBlockSelected: (block: FlowBlock) => void;
  onAgentSelected: () => void;
}

interface BlockOption {
  name: string;
  description: string;
  type: string;
  parameters: string[];
}

export function StepBlockSelectionDialog({
  open,
  onOpenChange,
  onBlockSelected,
  onAgentSelected
}: StepBlockSelectionDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<BlockOption[]>([]);
  const [loading, setLoading] = useState(false);

  // Load blocks from database
  useEffect(() => {
    const loadBlocks = async () => {
      if (!open) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('flow_block_configs')
          .select('block_name, block_type, config_data, credentials')
          .eq('is_functional', true)
          .order('block_name');

        if (error) {
          console.error('Error fetching blocks:', error);
          return;
        }

        if (data) {
          const formattedBlocks = data.map(block => ({
            name: block.block_name,
            type: block.block_type,
            description: (block.credentials as any)?.description || '',
            parameters: (block.config_data as any)?.parameters || []
          }));
          setBlocks(formattedBlocks);
        }
      } catch (error) {
        console.error('Error loading blocks:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlocks();
  }, [open]);

  // Filter blocks based on search term and category
  const filteredBlocks = blocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || block.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get available categories from blocks
  const categories = [...new Set(blocks.map(block => block.type))];

  const handleBlockSelect = (block: BlockOption) => {
    const flowBlock: FlowBlock = {
      id: `block-${Date.now()}`,
      name: block.name,
      type: block.type as any,
      option: block.name
    };
    onBlockSelected(flowBlock);
    onOpenChange(false);
    resetState();
  };

  const handleAgentSelect = () => {
    onAgentSelected();
    onOpenChange(false);
    resetState();
  };

  const resetState = () => {
    setSearchTerm('');
    setSelectedCategory(null);
  };

  // Helper function to get icon for block type
  const getIconForType = (type: string) => {
    switch (type) {
      case 'collect': return Database;
      case 'think': return Brain;
      case 'act': return Zap;
      case 'agent': return User;
      default: return Database;
    }
  };

  // Helper function to get color for block type
  const getColorForType = (type: string) => {
    switch (type) {
      case 'collect': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'think': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'act': return 'bg-green-100 text-green-600 border-green-200';
      case 'agent': return 'bg-orange-100 text-orange-600 border-orange-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'collect': return 'Collect Data';
      case 'think': return 'Process & Analyze';
      case 'act': return 'Take Action';
      case 'agent': return 'AI Agents';
      default: return category;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Connect Block or Use Agent</DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-6">
          {/* Quick Options */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Quick Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Agent Option */}
              <div 
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors border-orange-200 bg-orange-50"
                onClick={handleAgentSelect}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <User className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">AI Agent Step</h4>
                    <p className="text-xs text-gray-600">Use an AI agent with custom prompts and tools</p>
                    <p className="text-xs text-orange-600 font-medium mt-1">
                      Configure: System prompt, tools, parameters
                    </p>
                  </div>
                </div>
              </div>

              {/* Manual Block Option */}
              <div className="border rounded-lg p-4 border-dashed border-gray-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Settings className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">Manual Block</h4>
                    <p className="text-xs text-gray-600">Choose from available pre-built blocks</p>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      Search below to see all available blocks
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Manual Blocks Section */}
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Available Blocks</h4>
              
              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search blocks by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 flex-wrap mb-4">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All Blocks
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {getCategoryDisplayName(category)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Blocks List */}
            <div className="max-h-64 overflow-y-auto space-y-2">
              {loading ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Loading blocks...
                </div>
              ) : filteredBlocks.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No blocks found matching your search.
                </div>
              ) : (
                filteredBlocks.map((block, index) => {
                  const IconComponent = getIconForType(block.type);
                  const colorClass = getColorForType(block.type);
                  
                  return (
                    <div
                      key={index}
                      className={`border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors ${colorClass.includes('border') ? colorClass : `border-gray-200 ${colorClass}`}`}
                      onClick={() => handleBlockSelect(block)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-sm truncate">{block.name}</h4>
                            <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
                              {getCategoryDisplayName(block.type)}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-1">{block.description}</p>
                          {block.parameters && block.parameters.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs text-gray-500">Parameters:</span>
                              {block.parameters.slice(0, 3).map((param, i) => (
                                <span key={i} className="text-xs bg-gray-100 px-1 rounded">
                                  {param}
                                </span>
                              ))}
                              {block.parameters.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{block.parameters.length - 3} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}