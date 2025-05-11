
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FlowBlock } from '@/components/jarvi-flows/FlowsGrid';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowDown, ChevronDown, Info, MoveUp, MoveDown, Trash2, Database, Brain, Zap, User, Settings } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { agentsData } from '@/data/agentsData';
import { BlockCategory } from '@/data/flowBlockOptions';
import { SendEmailConfig } from '@/components/agents/tools/SendEmailConfig';
import { AiSummaryConfig } from '@/components/agents/tools/AiSummaryConfig';
import { UploadSheetConfig } from '@/components/agents/tools/UploadSheetConfig';
import { ScrapeSheetConfig } from '@/components/agents/tools/ScrapeSheetConfig';
import { EmailParsingConfig } from '@/components/agents/tools/EmailParsingConfig';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Block type to icon/color mapping
const blockTypeInfo = {
  collect: {
    icon: Database,
    color: 'bg-blue-500',
    lightColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  },
  think: {
    icon: Brain,
    color: 'bg-purple-500',
    lightColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700'
  },
  act: {
    icon: Zap,
    color: 'bg-green-500',
    lightColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700'
  },
  agent: {
    icon: User,
    color: 'bg-[#9b87f5]',
    lightColor: 'bg-[#f5f2ff]',
    borderColor: 'border-[#d1c7fa]',
    textColor: 'text-[#7356f1]'
  }
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

// Configuration components map
const configComponentMap = {
  'Upload Sheet': UploadSheetConfig,
  'Scrape Sheet': ScrapeSheetConfig,
  'Email Parsing': EmailParsingConfig,
  'AI Summary': AiSummaryConfig,
  'Send Email': SendEmailConfig
};

export interface FlowBlockProps {
  block: FlowBlock;
  index: number;
  isLast?: boolean;
  onUpdateBlock?: (updatedBlock: Partial<FlowBlock>) => void;
  onRemoveBlock?: () => void;
  onAgentSelection?: (agentId: string) => void;
  updateBlockName?: (blockId: string, name: string) => void;
  updateBlockOption?: (blockId: string, option: string) => void;
  moveBlockUp?: (index: number) => void;
  moveBlockDown?: (index: number) => void;
  removeBlock?: (blockId: string) => void;
  handleAgentSelection?: (blockId: string, agentId: string) => void;
}

export function FlowBlockComponent({
  block,
  index,
  isLast = false,
  onUpdateBlock,
  onRemoveBlock,
  onAgentSelection,
  updateBlockName,
  updateBlockOption,
  moveBlockUp,
  moveBlockDown,
  removeBlock,
  handleAgentSelection
}: FlowBlockProps) {
  const [configDialogOpen, setConfigDialogOpen] = useState(false);

  // Get the block type info
  const typeInfo = blockTypeInfo[block.type];
  const BlockIcon = typeInfo.icon;
  const blockColor = typeInfo.color;
  const blockLightColor = typeInfo.lightColor;
  const blockBorderColor = typeInfo.borderColor;
  const blockTextColor = typeInfo.textColor;

  // Get description for the current block option
  const blockDescription = blockOptionDescriptions[block.type]?.[block.option];

  // Check if this block has configurable options
  const hasConfig = Object.keys(configComponentMap).includes(block.option);
  const ConfigComponent = configComponentMap[block.option as keyof typeof configComponentMap];

  // Determine if this block uses an agent
  const hasAgentSelection = block.type === 'act' && block.option === 'Agent' || block.type === 'agent';
  const selectedAgent = block.agentId ? agentsData.find(agent => agent.id === block.agentId) : null;

  // Define handlers that work with either prop style
  const handleUpdateName = (name: string) => {
    if (updateBlockName) {
      updateBlockName(block.id, name);
    } else if (onUpdateBlock) {
      onUpdateBlock({ name });
    }
  };

  const handleUpdateOption = (option: string) => {
    if (updateBlockOption) {
      updateBlockOption(block.id, option);
    } else if (onUpdateBlock) {
      onUpdateBlock({ option });
    }
  };

  const handleRemoveBlock = () => {
    if (removeBlock) {
      removeBlock(block.id);
    } else if (onRemoveBlock) {
      onRemoveBlock();
    }
  };

  const handleMoveUp = () => {
    if (moveBlockUp) {
      moveBlockUp(index);
    }
  };

  const handleMoveDown = () => {
    if (moveBlockDown) {
      moveBlockDown(index);
    }
  };

  const handleAgentSelect = (agentId: string) => {
    if (handleAgentSelection) {
      handleAgentSelection(block.id, agentId);
    } else if (onAgentSelection) {
      onAgentSelection(agentId);
    }
  };

  // Toggle configuration dialog
  const toggleConfigDialog = () => {
    console.log("Toggling config dialog. Current state:", configDialogOpen, "Setting to:", !configDialogOpen);
    setConfigDialogOpen(!configDialogOpen);
  };

  return (
    <div className="group border rounded-xl bg-white overflow-hidden shadow-sm hover:shadow transition-shadow">
      <div className="p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between">
            {/* Left side - Block type identifier and name */}
            <div className="flex items-start gap-4 flex-1">
              <div className={`${blockColor} p-3 rounded-full flex-shrink-0`}>
                <BlockIcon className="h-5 w-5 text-white" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`${blockTextColor} font-medium text-sm`}>
                    {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                  </span>
                  
                  {hasConfig && (
                    <Badge variant="outline" className="bg-gray-50 text-gray-600 text-xs ml-2">
                      Configurable
                    </Badge>
                  )}
                  
                  {selectedAgent && (
                    <Badge className="bg-[#f5f2ff] text-[#7356f1] border-0 text-xs ml-2">
                      Agent: {selectedAgent.name}
                    </Badge>
                  )}
                </div>
                
                <label className="text-xs text-gray-500 mb-1">Block Name</label>
                <Textarea 
                  id={`block-name-${block.id}`} 
                  className="text-sm font-normal border-2 focus:border-gray-300 resize-none p-3 bg-transparent rounded-lg my-1 min-h-[38px] flow-block-name-input" 
                  value={block.name || ""} 
                  onChange={e => handleUpdateName(e.target.value)} 
                  rows={1} 
                  placeholder="Give this block a descriptive name" 
                />
                
                {blockDescription && <p className="text-xs text-gray-500 mt-2">{blockDescription}</p>}
              </div>
            </div>

            {/* Right side - Actions and configuration */}
            <div className="flex flex-col items-end gap-3 ml-4">
              <div className="flex items-center gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={index === 0} onClick={handleMoveUp} className="h-7 w-7">
                        <MoveUp className="h-4 w-4 text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Move up</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isLast} onClick={handleMoveDown} className="h-7 w-7">
                        <MoveDown className="h-4 w-4 text-gray-500" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Move down</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={handleRemoveBlock}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="flex flex-col gap-2 items-end mt-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 flex items-center justify-end">
                    Block Action
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-3 w-3 ml-1 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>Select the specific action for this block</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </label>
                  
                  <Select value={block.option} onValueChange={value => handleUpdateOption(value)}>
                    <SelectTrigger id={`block-option-${block.id}`} className="w-[200px] border bg-white text-sm">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* We'll handle this dynamically later */}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Agent selection dropdown */}
                {hasAgentSelection && (
                  <div className="w-full">
                    <label className="text-xs text-gray-500 mb-1 flex items-center justify-end">
                      Select Agent
                    </label>
                    <Select value={block.agentId || ''} onValueChange={value => handleAgentSelect(value)}>
                      <SelectTrigger className="w-[200px] border bg-white text-sm">
                        <SelectValue placeholder="Select agent" />
                      </SelectTrigger>
                      <SelectContent>
                        {agentsData.map(agent => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {/* Configuration button for blocks with config options */}
                {hasConfig && ConfigComponent && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={`mt-2 ${blockLightColor} ${blockTextColor} border-0 text-xs`} 
                    onClick={toggleConfigDialog}
                  >
                    <Settings className="h-3 w-3 mr-1.5" />
                    Configure
                    <ChevronDown className="h-3 w-3 ml-1.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuration Dialog */}
      {hasConfig && ConfigComponent && (
        <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configure {block.option}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {ConfigComponent && (
                <ConfigComponent toolId={`${block.type}-${block.option.toLowerCase().replace(/\s+/g, '-')}`} />
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setConfigDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
