import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X, Database, Brain, Zap, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface AddStepPanelProps {
  onAddStep: (type: 'block' | 'agent', blockData?: any) => void;
  isOpen: boolean;
  onClose: () => void;
  availableBlockOptions?: Record<string, string[]>;
}

export function AddStepPanel({ onAddStep, isOpen, onClose, availableBlockOptions }: AddStepPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [blocks, setBlocks] = useState<Array<{ name: string; description: string; type: string }>>([]);

  // Load blocks from database
  useEffect(() => {
    const loadBlocks = async () => {
      try {
        const { data, error } = await supabase
          .from('flow_block_configs')
          .select('block_name, block_type, config_data')
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
            description: (block.config_data as any)?.description || '',
            parameters: (block.config_data as any)?.parameters || []
          }));
          setBlocks(formattedBlocks);
        }
      } catch (error) {
        console.error('Error loading blocks:', error);
      }
    };

    if (isOpen) {
      loadBlocks();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter blocks based on search term and category
  const filteredBlocks = blocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Map database categories to simplified categories
    let blockCategory = 'collect'; // default
    if (['think', 'amazon_analysis', 'image_analysis'].includes(block.type)) {
      blockCategory = 'think';
    } else if (['act', 'communication', 'integration'].includes(block.type)) {
      blockCategory = 'act';
    } else if (['collect', 'amazon_api', 'amazon_scraping', 'scraping', 'junglescout', 'keyword_research', 'jarvio', 'amazon_support'].includes(block.type)) {
      blockCategory = 'collect';
    }
    
    const matchesCategory = !selectedCategory || blockCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Simplified categories
  const categories = ['collect', 'think', 'act'];

  const handleBlockSelect = (block: any) => {
    onAddStep('block', {
      name: block.name,
      type: block.type,
      description: block.description,
      parameters: block.parameters
    });
    onClose();
    setSearchTerm('');
    setSelectedCategory(null);
  };

  const handleAgentSelect = () => {
    onAddStep('agent');
    onClose();
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
      case 'collect': return 'bg-blue-100 text-blue-600';
      case 'think': return 'bg-green-100 text-green-600';
      case 'act': return 'bg-orange-100 text-orange-600';
      case 'agent': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="absolute top-16 left-4 bottom-4 w-80 bg-white border rounded-lg shadow-lg z-20 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Add a New Step</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-col gap-4 p-4 flex-1 overflow-hidden">
        {/* Quick Step Options */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Quick Add</h4>
          
          {/* Simple Step */}
          <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors" onClick={handleAgentSelect}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Agent Step</h4>
                <p className="text-xs text-gray-600">Add an AI agent step with custom tools and prompts</p>
              </div>
              <Badge variant="outline" className="text-xs">Agent</Badge>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Or add step with block</h4>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search blocks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap mt-3">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Blocks List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredBlocks.map((block, index) => {
            // Map database type to simplified category for display
            let displayCategory = 'collect';
            if (['think', 'amazon_analysis', 'image_analysis'].includes(block.type)) {
              displayCategory = 'think';
            } else if (['act', 'communication', 'integration'].includes(block.type)) {
              displayCategory = 'act';
            }
            
            const IconComponent = getIconForType(displayCategory);
            const colorClass = getColorForType(displayCategory);
            
            return (
              <div
                key={index}
                className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleBlockSelect(block)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{block.name}</h4>
                    <p className="text-xs text-gray-600 line-clamp-2">{block.description}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Badge variant="outline" className="text-xs capitalize">
                      {displayCategory}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBlocks.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No blocks found matching your search.
          </div>
        )}
      </div>
    </div>
  );
}