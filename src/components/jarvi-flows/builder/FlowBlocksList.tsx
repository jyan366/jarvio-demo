
import React, { useState } from 'react';
import { CheckIcon, PlusIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FlowBlock } from '@/components/jarvi-flows/FlowsGrid';
import { FlowBlockComponent } from '@/components/jarvi-flows/builder/FlowBlockComponent';
import { v4 as uuidv4 } from 'uuid';
import { BlockCategory } from '@/data/flowBlockOptions';

interface Props {
  blocks: FlowBlock[];
  setBlocks: (blocks: FlowBlock[]) => void;
  handleAgentSelection: (blockId: string, agentId: string) => void;
  availableBlockOptions?: Record<string, string[]>;
}

export function FlowBlocksList({ 
  blocks, 
  setBlocks, 
  handleAgentSelection,
  availableBlockOptions 
}: Props) {
  // Create a simplified function to add a block directly from category
  const addBlockFromCategory = (type: BlockCategory) => {
    // Create a descriptive name based on the block type
    const name = `New ${type.charAt(0).toUpperCase() + type.slice(1)} Block`;
    
    // Get default option for this block type
    const defaultOption = availableBlockOptions?.[type]?.[0] || 
                         (type === 'collect' ? 'User Text' : 
                          type === 'think' ? 'Basic AI Analysis' : 
                          type === 'act' ? 'AI Summary' : 'Agent');
    
    setBlocks([
      ...blocks, 
      { id: uuidv4(), type, option: defaultOption, name }
    ]);
  };
  
  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };
  
  const updateBlock = (id: string, updatedBlock: Partial<FlowBlock>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, ...updatedBlock } : block
    ));
  };

  // Move a block up in the list
  const moveBlockUp = (index: number) => {
    if (index === 0) return; // Already at the top
    const newBlocks = [...blocks];
    [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    setBlocks(newBlocks);
  };

  // Move a block down in the list
  const moveBlockDown = (index: number) => {
    if (index >= blocks.length - 1) return; // Already at the bottom
    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    setBlocks(newBlocks);
  };

  // Update block name
  const updateBlockName = (blockId: string, name: string) => {
    updateBlock(blockId, { name });
  };

  // Update block option
  const updateBlockOption = (blockId: string, option: string) => {
    updateBlock(blockId, { option });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Flow Blocks</h2>
        
        {/* Simplified Block Category Selection */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-3 justify-between">
              {(['collect', 'think', 'act', 'agent'] as BlockCategory[]).map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="lg"
                  onClick={() => addBlockFromCategory(category)}
                  className="flex-1 py-6 text-lg capitalize"
                >
                  <PlusIcon className="mr-2 h-5 w-5" /> 
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Flow Blocks List */}
        {blocks.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Add blocks to build your flow</p>
          </div>
        ) : (
          <div className="space-y-4">
            {blocks.map((block, index) => (
              <FlowBlockComponent
                key={block.id}
                block={block}
                index={index}
                isLast={index === blocks.length - 1}
                updateBlockName={updateBlockName}
                updateBlockOption={updateBlockOption}
                moveBlockUp={moveBlockUp}
                moveBlockDown={moveBlockDown}
                removeBlock={removeBlock}
                handleAgentSelection={handleAgentSelection}
                availableBlockOptions={availableBlockOptions}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
