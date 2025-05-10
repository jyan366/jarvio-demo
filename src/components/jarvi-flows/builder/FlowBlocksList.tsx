import React from 'react';
import { Button } from '@/components/ui/button';
import { Database, Brain, Zap, User, Plus } from 'lucide-react';
import { FlowBlock } from '@/components/jarvi-flows/FlowsGrid';
import { FlowBlockComponent } from './FlowBlockComponent';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
interface FlowBlocksListProps {
  blocks: FlowBlock[];
  setBlocks: (blocks: FlowBlock[]) => void;
  handleAgentSelection: (blockId: string, agentId: string) => void;
}
export function FlowBlocksList({
  blocks,
  setBlocks,
  handleAgentSelection
}: FlowBlocksListProps) {
  // Add a new block of the specified type
  const addBlock = (type: 'collect' | 'think' | 'act' | 'agent') => {
    const option = type === 'agent' ? 'Agent' : type === 'collect' ? 'User Text' : type === 'think' ? 'Basic AI Analysis' : 'AI Summary';
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
        const updatedBlock = {
          ...block,
          option
        };

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
    setBlocks(blocks.map(block => block.id === blockId ? {
      ...block,
      name
    } : block));
  };

  // Determine counts by type
  const blockCounts = {
    collect: blocks.filter(b => b.type === 'collect').length,
    think: blocks.filter(b => b.type === 'think').length,
    act: blocks.filter(b => b.type === 'act').length,
    agent: blocks.filter(b => b.type === 'agent').length
  };
  return <Card className="border shadow-sm">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="flex justify-between items-center">
          <div className="flex items-center">
            Flow Blocks
            <span className="ml-3 flex gap-2">
              {blockCounts.collect > 0}
              {blockCounts.think > 0}
              {blockCounts.act > 0}
              {blockCounts.agent > 0 && <Badge variant="outline" className="bg-[#f5f2ff] text-[#7356f1] border-[#d1c7fa]">
                  {blockCounts.agent} Agent
                </Badge>}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => addBlock('collect')} className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 min-w-[100px]">
              <Database className="h-4 w-4 mr-2" />
              Collect
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock('think')} className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800 min-w-[100px]">
              <Brain className="h-4 w-4 mr-2" />
              Think
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock('act')} className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 min-w-[100px]">
              <Zap className="h-4 w-4 mr-2" />
              Act
            </Button>
            <Button variant="outline" size="sm" onClick={() => addBlock('agent')} className="border-[#d1c7fa] text-[#7356f1] hover:bg-[#f5f2ff] hover:text-[#6243e0] min-w-[100px]">
              <User className="h-4 w-4 mr-2" />
              Agent
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 space-y-2">
        {blocks.length > 0 ? <div className="space-y-1">
            {blocks.map((block, index) => <FlowBlockComponent key={block.id} block={block} index={index} isLast={index === blocks.length - 1} updateBlockName={updateBlockName} updateBlockOption={updateBlockOption} moveBlockUp={moveBlockUp} moveBlockDown={moveBlockDown} removeBlock={removeBlock} handleAgentSelection={handleAgentSelection} />)}
          </div> : <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50">
            <div className="text-muted-foreground text-center">
              <p>No blocks added yet</p>
              <p className="text-sm mt-1">Click one of the buttons above to add your first block</p>
            </div>
          </div>}
      </CardContent>
    </Card>;
}