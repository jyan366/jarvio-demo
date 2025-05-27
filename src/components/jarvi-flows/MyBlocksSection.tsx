
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CategoryFilters } from './components/CategoryFilters';
import { BlocksGrid } from './components/BlocksGrid';
import { BlockDetailModal } from './components/BlockDetailModal';
import { blocksData } from './data/blocksData';
import { Block, Category } from './types/blockTypes';
import { Badge } from '@/components/ui/badge';

export function MyBlocksSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('collect');
  const [activeBlocks, setActiveBlocks] = useState<Record<string, boolean>>({
    'Upload Sheet': true,
    'AI Analysis': true,
    'Send Email': true,
    'Create PDF': true
  });
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [connectedServices, setConnectedServices] = useState<Record<string, boolean>>({
    'Google Sheets': false,
    'ClickUp': false,
    'Slack': false,
    'Gmail': false
  });

  const categories: Category[] = [
    { id: 'collect', name: 'Collect', description: 'Retrieves data from Amazon, scraped sites, or files' },
    { id: 'think', name: 'Think', description: 'Interprets data using AI or logic' },
    { id: 'act', name: 'Act', description: 'Performs an action like messaging, updating listings, or creating tasks' }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'collect': return 'bg-blue-500';
      case 'think': return 'bg-purple-500';
      case 'act': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Get block counts for each category
  const getBlockCounts = () => {
    return {
      collect: blocksData.collect.length,
      think: blocksData.think.length,
      act: blocksData.act.length
    };
  };

  // Get filtered blocks based on category and search
  const getFilteredBlocks = () => {
    const categoryBlocks = blocksData[selectedCategory as keyof typeof blocksData] || [];
    if (!searchTerm) return categoryBlocks;
    
    return categoryBlocks.filter(block =>
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Get total active blocks count
  const getActiveBlocksCount = () => {
    return Object.values(activeBlocks).filter(Boolean).length;
  };

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsModalOpen(true);
  };

  const handleServiceConnection = (service: string) => {
    setConnectedServices(prev => ({
      ...prev,
      [service]: true
    }));
  };

  const handleActivateBlock = (blockName: string) => {
    setActiveBlocks(prev => ({
      ...prev,
      [blockName]: true
    }));
    setIsModalOpen(false);
  };

  const filteredBlocks = getFilteredBlocks();
  const blockCounts = getBlockCounts();
  const totalBlocks = blockCounts.collect + blockCounts.think + blockCounts.act;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">My Blocks</h2>
            <Badge variant="secondary" className="text-sm">
              {totalBlocks} total blocks
            </Badge>
            <Badge variant="outline" className="text-sm text-green-600 border-green-300">
              {getActiveBlocksCount()} active
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Most used tools and integrations for your flows
          </p>
        </div>
      </div>

      {/* Categories and Search */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <CategoryFilters
            categories={categories.map(cat => ({
              ...cat,
              name: `${cat.name} (${blockCounts[cat.id as keyof typeof blockCounts]})`
            }))}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            getCategoryColor={getCategoryColor}
          />
          
          {/* Search and filter stats */}
          <div className="flex items-center gap-2">
            {searchTerm && (
              <Badge variant="outline" className="text-xs">
                {filteredBlocks.length} of {blocksData[selectedCategory as keyof typeof blocksData].length} blocks
              </Badge>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="max-w-md">
          <Input 
            placeholder={`Search ${selectedCategory} blocks...`}
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category description and stats */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 capitalize flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getCategoryColor(selectedCategory)}`} />
                {selectedCategory} Blocks
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {categories.find(cat => cat.id === selectedCategory)?.description}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {filteredBlocks.length}
              </div>
              <div className="text-xs text-gray-500">
                {searchTerm ? 'filtered' : 'blocks'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blocks grid */}
      <BlocksGrid
        blocks={filteredBlocks}
        selectedCategory={selectedCategory}
        getCategoryColor={getCategoryColor}
        onBlockClick={handleBlockClick}
      />

      {/* Block Detail Modal */}
      <BlockDetailModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedBlock={selectedBlock}
        connectedServices={connectedServices}
        onServiceConnection={handleServiceConnection}
        onActivateBlock={handleActivateBlock}
      />
    </div>
  );
}
