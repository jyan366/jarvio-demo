
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { CategoryFilters } from './components/CategoryFilters';
import { BlocksGrid } from './components/BlocksGrid';
import { BlockDetailModal } from './components/BlockDetailModal';
import { blocksData } from './data/blocksData';
import { Block, Category } from './types/blockTypes';

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

  // Get filtered blocks based on category and search
  const getFilteredBlocks = () => {
    const categoryBlocks = blocksData[selectedCategory as keyof typeof blocksData] || [];
    return categoryBlocks.filter(block =>
      block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      block.summary.toLowerCase().includes(searchTerm.toLowerCase())
    );
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">My Blocks</h2>
          <p className="text-muted-foreground mt-1">
            Most used tools and integrations for your flows
          </p>
        </div>
      </div>

      {/* Categories and Search */}
      <div className="space-y-4">
        <CategoryFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          getCategoryColor={getCategoryColor}
        />

        {/* Search bar */}
        <div className="max-w-md">
          <Input 
            placeholder="Search blocks..." 
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
