import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search } from 'lucide-react';
import { blocksData } from '../../data/blocksData';

interface AddStepDialogProps {
  onAddStep: (type: 'block' | 'agent', blockData?: any) => void;
}

export function AddStepDialog({ onAddStep }: AddStepDialogProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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
    setOpen(false);
    setSearchTerm('');
    setSelectedCategory(null);
  };

  const handleAgentSelect = () => {
    onAddStep('agent');
    setOpen(false);
    setSearchTerm('');
    setSelectedCategory(null);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="sm" className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Step
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[500px] sm:w-[600px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Add a New Step</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-4 flex-1 overflow-hidden mt-4">
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
          <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors" onClick={handleAgentSelect}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">Agent Step</h3>
                <p className="text-sm text-gray-600">Add a custom AI agent to your flow</p>
              </div>
              <Badge variant="outline">Agent</Badge>
            </div>
          </div>

          {/* Blocks List */}
          <div className="flex-1 overflow-y-auto space-y-2">
            {filteredBlocks.map((block, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleBlockSelect(block)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {block.logo ? (
                      <img src={block.logo} alt={block.name} className="w-6 h-6" />
                    ) : (
                      <block.icon className="h-5 w-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{block.name}</h3>
                    <p className="text-sm text-gray-600">{block.summary}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {block.category}
                    </Badge>
                    {block.needsConnection && (
                      <Badge variant="secondary">
                        Requires Connection
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredBlocks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No blocks found matching your search.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}