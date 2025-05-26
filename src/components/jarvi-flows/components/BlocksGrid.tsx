
import React from 'react';
import { BlockCard } from './BlockCard';
import { Block } from '../types/blockTypes';

interface BlocksGridProps {
  blocks: Block[];
  selectedCategory: string;
  getCategoryColor: (category: string) => string;
  onBlockClick: (block: Block) => void;
}

export function BlocksGrid({ 
  blocks, 
  selectedCategory, 
  getCategoryColor, 
  onBlockClick 
}: BlocksGridProps) {
  if (blocks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No blocks found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {blocks.map((block) => (
        <BlockCard
          key={block.name}
          block={block}
          selectedCategory={selectedCategory}
          getCategoryColor={getCategoryColor}
          onBlockClick={onBlockClick}
        />
      ))}
    </div>
  );
}
