import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Database, Brain, Zap } from 'lucide-react';
import { blocksData } from '../../data/blocksData';

interface AttachBlockDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAttachBlock: (blockData: any) => void;
  stepId: string;
}

export function AttachBlockDialog({ isOpen, onClose, onAttachBlock, stepId }: AttachBlockDialogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['collect', 'think', 'act'];

  const getIconForCategory = (category: string) => {
    switch (category) {
      case 'collect': return <Database className="w-4 h-4" />;
      case 'think': return <Brain className="w-4 h-4" />;
      case 'act': return <Zap className="w-4 h-4" />;
      default: return <Database className="w-4 h-4" />;
    }
  };

  const getColorForCategory = (category: string) => {
    switch (category) {
      case 'collect': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'think': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'act': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Convert blocksData object to flat array for filtering
  const allBlocks = [
    ...blocksData.collect.map(block => ({ ...block, category: 'collect', id: `collect-${block.name}` })),
    ...blocksData.think.map(block => ({ ...block, category: 'think', id: `think-${block.name}` })),
    ...blocksData.act.map(block => ({ ...block, category: 'act', id: `act-${block.name}` }))
  ];

  const filteredBlocks = allBlocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAttachBlock = (blockData: any) => {
    onAttachBlock(blockData);
    onClose();
    setSearchTerm('');
    setSelectedCategory(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Attach Action to Step</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search actions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
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
                  className="flex items-center gap-1"
                >
                  {getIconForCategory(category)}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Blocks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[50vh] overflow-y-auto">
            {filteredBlocks.map((block) => (
              <div
                key={block.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 cursor-pointer transition-all"
                onClick={() => handleAttachBlock(block)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIconForCategory(block.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium text-sm text-gray-900 truncate">
                        {block.name}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getColorForCategory(block.category)}`}
                      >
                        {block.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {block.summary}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBlocks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No actions found matching your criteria
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}