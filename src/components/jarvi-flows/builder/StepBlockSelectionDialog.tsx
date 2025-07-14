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
  const [showManualBlocks, setShowManualBlocks] = useState(false);

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
    setShowManualBlocks(false);
  };

  const handleManualBlockSelect = () => {
    setShowManualBlocks(true);
  };

  const handleBackToChoice = () => {
    setShowManualBlocks(false);
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
          <DialogTitle>
            {showManualBlocks ? (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleBackToChoice}>
                  ← Back
                </Button>
                Choose a Block
              </div>
            ) : (
              "Connect Block or Use Agent"
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 pb-6">
          {!showManualBlocks ? (
            // Initial choice between AI Agent or Manual Block
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Agent Option */}
                <div 
                  className="border rounded-lg p-6 hover:bg-orange-50 cursor-pointer transition-colors border-orange-200 bg-orange-50/50"
                  onClick={handleAgentSelect}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <User className="h-6 w-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-1">AI Agent</h3>
                      <p className="text-sm text-gray-600 mb-2">Use an AI agent with custom prompts and tools</p>
                      <p className="text-xs text-orange-600 font-medium">
                        Configure: System prompt, tools, parameters
                      </p>
                    </div>
                  </div>
                </div>

                {/* Manual Block Option */}
                <div 
                  className="border rounded-lg p-6 hover:bg-gray-50 cursor-pointer transition-colors border-gray-300"
                  onClick={handleManualBlockSelect}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Settings className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-1">Manual Block</h3>
                      <p className="text-sm text-gray-600 mb-2">Choose from available pre-built blocks</p>
                      <p className="text-xs text-gray-500 font-medium">
                        Browse {blocks.length} available blocks
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Manual blocks selection interface
            <div className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search blocks by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Categories */}
              <div className="flex gap-2 flex-wrap">
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

              {/* Blocks List */}
              <div className="max-h-96 overflow-y-auto space-y-2">
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
                        className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleBlockSelect(block)}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-base truncate">{block.name}</h4>
                              <Badge variant="outline" className="text-xs capitalize flex-shrink-0">
                                {getCategoryDisplayName(block.type)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{block.description}</p>
                            {block.parameters && block.parameters.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                <span className="text-xs text-gray-500">Parameters:</span>
                                {block.parameters.slice(0, 4).map((param, i) => (
                                  <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {param}
                                  </span>
                                ))}
                                {block.parameters.length > 4 && (
                                  <span className="text-xs text-gray-500">
                                    +{block.parameters.length - 4} more
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}