import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { blocksData } from '../../data/blocksData';

interface AddStepPanelProps {
  onAddStep: (type: 'block' | 'agent', blockData?: any) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function AddStepPanel({ onAddStep, isOpen, onClose }: AddStepPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  // Flatten all blocks from all categories
  const allBlocks = Object.entries(blocksData).flatMap(([category, blocks]) =>
    blocks.map(block => ({ ...block, category }))
  );

  // Filter blocks based on search term and category
  const filteredBlocks = allBlocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || block.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Object.keys(blocksData);

  const handleBlockSelect = (block: any) => {
    onAddStep('block', block);
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

  return (
    <div className="absolute top-4 right-4 w-96 bg-white border rounded-lg shadow-lg z-20 flex flex-col max-h-[calc(100vh-200px)]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">Add a New Step</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-col gap-4 p-4 flex-1 overflow-hidden">
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
        <div className="flex gap-2 flex-wrap">
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

        {/* Agent Option */}
        <div className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors" onClick={handleAgentSelect}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Search className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm">Agent Step</h4>
              <p className="text-xs text-gray-600">Add a custom AI agent</p>
            </div>
            <Badge variant="outline" className="text-xs">Agent</Badge>
          </div>
        </div>

        {/* Blocks List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filteredBlocks.map((block, index) => (
            <div
              key={index}
              className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => handleBlockSelect(block)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  {block.logo ? (
                    <img src={block.logo} alt={block.name} className="w-4 h-4" />
                  ) : (
                    <block.icon className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{block.name}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{block.summary}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge variant="outline" className="text-xs capitalize">
                    {block.category}
                  </Badge>
                  {block.needsConnection && (
                    <Badge variant="secondary" className="text-xs">
                      Connection
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
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