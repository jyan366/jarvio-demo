
// Update FlowBlocksList.tsx to accept and use availableBlockOptions prop
import React, { useState } from 'react';
import { CheckIcon, PlusIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FlowBlock } from '@/components/jarvi-flows/FlowsGrid';
import { FlowBlockComponent } from '@/components/jarvi-flows/builder/FlowBlockComponent';
import { v4 as uuidv4 } from 'uuid';
import { BlockCategory, flowBlockOptions } from '@/data/flowBlockOptions';

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
  const [blockType, setBlockType] = useState<BlockCategory>('collect');

  // Use availableBlockOptions if provided, otherwise fall back to flowBlockOptions
  const getBlockOptions = (type: BlockCategory): string[] => {
    if (availableBlockOptions && availableBlockOptions[type] && availableBlockOptions[type].length > 0) {
      return availableBlockOptions[type];
    }
    return flowBlockOptions[type] || [];
  };

  const addBlock = (type: BlockCategory, option: string) => {
    // Create a descriptive name based on the block type and option
    const name = getDescriptiveBlockName(type, option);
    
    setBlocks([
      ...blocks, 
      { id: uuidv4(), type, option, name }
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
  
  // Helper function for descriptive block names
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Flow Blocks</h2>
        
        {/* Add Block Section */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <Select 
                value={blockType}
                onValueChange={(value) => setBlockType(value as BlockCategory)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collect">Collect</SelectItem>
                  <SelectItem value="think">Think</SelectItem>
                  <SelectItem value="act">Act</SelectItem>
                  <SelectItem value="agent">Agent</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex-1 overflow-x-auto whitespace-nowrap pb-2">
                <div className="inline-flex gap-2">
                  {getBlockOptions(blockType).map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      size="sm"
                      onClick={() => addBlock(blockType, option)}
                      className="min-w-fit"
                    >
                      <PlusIcon className="mr-1 h-4 w-4" /> 
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
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
                onUpdateBlock={(updatedBlock) => updateBlock(block.id, updatedBlock)}
                onRemoveBlock={() => removeBlock(block.id)}
                onAgentSelection={(agentId) => handleAgentSelection(block.id, agentId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
