
import React from 'react';
import { Button } from '@/components/ui/button';
import { Database, Brain, Zap, User } from 'lucide-react';
import { FlowBlock } from '@/components/jarvi-flows/FlowsGrid';
import { FlowBlockComponent } from './FlowBlockComponent';
import { v4 as uuidv4 } from 'uuid';

interface FlowBlocksListProps {
  blocks: FlowBlock[];
  setBlocks: (blocks: FlowBlock[]) => void;
  handleAgentSelection: (blockId: string, agentId: string) => void;
}

export function FlowBlocksList({ blocks, setBlocks, handleAgentSelection }: FlowBlocksListProps) {
  // Add a new block of the specified type
  const addBlock = (type: 'collect' | 'think' | 'act' | 'agent') => {
    const option = type === 'agent' ? 'Agent' : (
      type === 'collect' ? 'User Text' : 
      type === 'think' ? 'Basic AI Analysis' : 'AI Summary'
    );
    
    const newBlock: FlowBlock = {
      id: uuidv4(),
      type: type,
      option: option,
      name: getDescriptiveBlockName(type, option)
    };
    
    setBlocks([...blocks, newBlock]);
  };

  // Helper functions to generate specific, contextual names based on block type and option
  const getDescriptiveBlockName = (type: string, option: string): string => {
    const contextualNaming: Record<string, Record<string, string>> = {
      collect: {
        'User Text': 'Collect Product Details from User',
        'Upload Sheet': 'Import Product Data Spreadsheet',
        'All Listing Info': 'Fetch Complete Amazon Listing Data',
        'Get Keywords': 'Research High-Converting Keywords',
        'Estimate Sales': 'Generate Product Sales Forecast',
        'Review Information': 'Gather Customer Product Reviews',
        'Scrape Sheet': 'Extract Data from Inventory Sheet',
        'Seller Account Feedback': 'Collect Seller Performance Metrics',
        'Email Parsing': 'Extract Data from Supplier Emails'
      },
      think: {
        'Basic AI Analysis': 'Analyze Market Positioning Data',
        'Listing Analysis': 'Identify Listing Optimization Opportunities',
        'Insights Generation': 'Generate Strategic Marketing Insights',
        'Review Analysis': 'Process Customer Feedback Trends'
      },
      act: {
        'AI Summary': 'Create Comprehensive Action Report',
        'Push to Amazon': 'Update Amazon Product Listings',
        'Send Email': 'Distribute Weekly Performance Report',
        'Human in the Loop': 'Request Manager Approval for Changes',
        'Agent': 'Assign Specialized Agent for Task'
      },
      agent: {
        'Agent': 'Use AI Agent for Specialized Task'
      }
    };

    return contextualNaming[type]?.[option] || `${type.charAt(0).toUpperCase() + type.slice(1)} ${option}`;
  };

  // Remove a block
  const removeBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
  };

  // Move block up in the list
  const moveBlockUp = (index: number) => {
    if (index <= 0) return; // Can't move up if it's the first item
    
    const newBlocks = [...blocks];
    // Swap with previous element
    [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
    setBlocks(newBlocks);
  };
  
  // Move block down in the list
  const moveBlockDown = (index: number) => {
    if (index >= blocks.length - 1) return; // Can't move down if it's the last item
    
    const newBlocks = [...blocks];
    // Swap with next element
    [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    setBlocks(newBlocks);
  };

  // Update block option
  const updateBlockOption = (blockId: string, option: string) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        // Update both option and generate a descriptive name if one doesn't already exist
        const updatedBlock = { ...block, option };
        
        // Only auto-update the name if it wasn't customized or is empty
        const currentName = block.name || '';
        const defaultName = getDescriptiveBlockName(block.type, block.option);
        
        // If current name matches the old default or is empty, generate a new one
        if (!currentName || currentName === defaultName) {
          updatedBlock.name = getDescriptiveBlockName(block.type, option);
        }
        
        return updatedBlock;
      }
      return block;
    }));
  };

  // Update block name
  const updateBlockName = (blockId: string, name: string) => {
    setBlocks(blocks.map(block => 
      block.id === blockId ? { ...block, name } : block
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Flow Blocks</h2>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => addBlock('collect')}
            className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
          >
            <Database className="h-4 w-4 mr-1" />
            Collect
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => addBlock('think')}
            className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
          >
            <Brain className="h-4 w-4 mr-1" />
            Think
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => addBlock('act')}
            className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
          >
            <Zap className="h-4 w-4 mr-1" />
            Act
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => addBlock('agent')}
            className="border-[#9b87f5] text-[#7356f1] hover:bg-[#9b87f5]/10 hover:text-[#6243e0]"
          >
            <User className="h-4 w-4 mr-1" />
            Agent
          </Button>
        </div>
      </div>

      {/* Flow Block List */}
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
          />
        ))}
        
        {blocks.length === 0 && (
          <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-muted-foreground text-center">
              <p>No blocks added yet</p>
              <p className="text-sm mt-1">Click one of the buttons above to add your first block</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
