
import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { FlowBlock } from '@/components/jarvi-flows/FlowsGrid';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowDown, ChevronDown, ChevronUp, Info, MoveDown, MoveUp, Trash2 } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { agentsData } from '@/data/agentsData';
import { flowBlockOptions } from '@/data/flowBlockOptions';

// Block type to icon/color mapping
const blockTypeInfo = {
  collect: { icon: 'Database', color: 'bg-blue-500' },
  think: { icon: 'Brain', color: 'bg-purple-500' },
  act: { icon: 'Zap', color: 'bg-green-500' },
  agent: { icon: 'User', color: 'bg-[#9b87f5]' }
};

// Block option descriptions
const blockOptionDescriptions = {
  collect: {
    'User Text': 'Allows users to provide specific instructions or data via direct text input',
    'Upload Sheet': 'Handles importing product data from spreadsheets like Excel or CSV',
    'All Listing Info': 'Gathers comprehensive data from all active Amazon listings',
    'Get Keywords': 'Retrieves relevant keywords for product listings based on category and competition',
    'Estimate Sales': 'Collects sales projection data based on historical performance',
    'Review Information': 'Gathers customer reviews and feedback for specified products',
    'Scrape Sheet': 'Extracts and processes data from structured spreadsheets',
    'Seller Account Feedback': 'Collects seller performance metrics and customer feedback',
    'Email Parsing': 'Extracts relevant data from business emails and notifications'
  },
  think: {
    'Basic AI Analysis': 'Processes collected data to identify patterns and insights',
    'Listing Analysis': 'Evaluates product listings for optimization opportunities',
    'Insights Generation': 'Creates actionable business intelligence from analyzed data',
    'Review Analysis': 'Analyzes customer feedback to identify trends and sentiment'
  },
  act: {
    'AI Summary': 'Generates a comprehensive report from analysis results',
    'Push to Amazon': 'Updates Amazon listings with optimized content and settings',
    'Send Email': 'Distributes reports or notifications to specified recipients',
    'Human in the Loop': 'Pauses for manual review and approval before proceeding',
    'Agent': 'Assigns a specialized AI agent to perform this step'
  },
  agent: {
    'Agent': 'Assigns a specialized AI agent to perform a specific task'
  }
};

// Import required icons from lucide-react
import { Database, Brain, Zap, User } from 'lucide-react';

interface FlowBlockProps {
  block: FlowBlock;
  index: number;
  isLast: boolean;
  updateBlockName: (blockId: string, name: string) => void;
  updateBlockOption: (blockId: string, option: string) => void;
  moveBlockUp: (index: number) => void;
  moveBlockDown: (index: number) => void;
  removeBlock: (blockId: string) => void;
  handleAgentSelection: (blockId: string, agentId: string) => void;
}

export function FlowBlockComponent({
  block,
  index,
  isLast,
  updateBlockName,
  updateBlockOption,
  moveBlockUp,
  moveBlockDown,
  removeBlock,
  handleAgentSelection
}: FlowBlockProps) {
  // Get the icon component based on block type
  let BlockIcon;
  switch (block.type) {
    case 'collect':
      BlockIcon = Database;
      break;
    case 'think':
      BlockIcon = Brain;
      break;
    case 'act':
      BlockIcon = Zap;
      break;
    case 'agent':
    default:
      BlockIcon = User;
  }
  
  const blockColor = blockTypeInfo[block.type].color;
  const blockDescription = blockOptionDescriptions[block.type]?.[block.option];
  
  return (
    <>
      <div 
        className="group border border-gray-200 rounded-lg bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="p-4 relative">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              {/* Left side - Block name and icon */}
              <div className="flex items-start gap-3">
                <div className={`${blockColor} p-2.5 rounded-full flex-shrink-0`}>
                  <BlockIcon className="h-5 w-5 text-white" />
                </div>
                
                <div className="flex-1">
                  <label className="text-sm text-gray-500 mb-1">Block Name</label>
                  <Textarea
                    id={`block-name-${block.id}`}
                    className="text-lg font-medium border-0 focus:ring-0 focus:border-0 resize-none overflow-hidden p-0 bg-transparent flow-block-name-input"
                    value={block.name || ""}
                    onChange={(e) => updateBlockName(block.id, e.target.value)}
                    rows={1}
                    placeholder="Give this block a descriptive name"
                  />
                  {blockDescription && (
                    <p className="text-gray-500 text-sm mt-1.5">{blockDescription}</p>
                  )}
                  <div className="text-sm text-gray-400 mt-2">
                    Type: {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                  </div>
                </div>
              </div>

              {/* Right side - Block action and controls */}
              <div className="flex flex-col items-end gap-4">
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={index === 0}
                          onClick={() => moveBlockUp(index)}
                          className="h-8 w-8"
                        >
                          <MoveUp className="h-4 w-4 text-gray-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Move up</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isLast}
                          onClick={() => moveBlockDown(index)}
                          className="h-8 w-8"
                        >
                          <MoveDown className="h-4 w-4 text-gray-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Move down</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeBlock(block.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Remove</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div>
                  <label className="text-sm text-gray-500 mb-1 flex items-center justify-end">
                    Block Action
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3.5 w-3.5 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>Select the specific action for this block</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  
                  <Select 
                    value={block.option} 
                    onValueChange={(value) => updateBlockOption(block.id, value)}
                  >
                    <SelectTrigger id={`block-option-${block.id}`} className="w-[200px] border bg-white">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {flowBlockOptions[block.type].map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {/* Agent selection for specific block types */}
                  {(block.type === 'act' && block.option === 'Agent') || block.type === 'agent' ? (
                    <div className="mt-2">
                      <Select
                        value={block.agentId || ''}
                        onValueChange={(value) => handleAgentSelection(block.id, value)}
                      >
                        <SelectTrigger className="w-[200px] border bg-white">
                          <SelectValue placeholder="Select agent" />
                        </SelectTrigger>
                        <SelectContent>
                          {agentsData.map((agent) => (
                            <SelectItem key={agent.id} value={agent.id}>
                              {agent.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Down arrow connecting blocks */}
      {!isLast && (
        <div className="flex justify-center my-1">
          <ArrowDown className="h-4 w-4 text-gray-300" />
        </div>
      )}
    </>
  );
}
