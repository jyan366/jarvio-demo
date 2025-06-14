
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ChevronUp, ChevronDown, Trash2, Database, Brain, Zap, User, ChevronRight, ChevronDown as ChevronDownIcon } from 'lucide-react';
import { FlowBlock, FlowStep } from '@/types/flowTypes';
import { agentsData } from '@/data/agentsData';
import { FlowBlockStepsEditor } from './FlowBlockStepsEditor';

interface Props {
  block: FlowBlock;
  index: number;
  isLast: boolean;
  updateBlockName: (blockId: string, name: string) => void;
  updateBlockOption: (blockId: string, option: string) => void;
  updateBlockSteps: (blockId: string, steps: FlowStep[]) => void;
  moveBlockUp: (index: number) => void;
  moveBlockDown: (index: number) => void;
  removeBlock: (id: string) => void;
  handleAgentSelection: (blockId: string, agentId: string) => void;
  availableBlockOptions?: Record<string, string[]>;
}

export function FlowBlockComponent({ 
  block, 
  index, 
  isLast, 
  updateBlockName, 
  updateBlockOption,
  updateBlockSteps,
  moveBlockUp, 
  moveBlockDown, 
  removeBlock, 
  handleAgentSelection,
  availableBlockOptions 
}: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'collect':
        return <Database className="w-4 h-4" />;
      case 'think':
        return <Brain className="w-4 h-4" />;
      case 'act':
        return <Zap className="w-4 h-4" />;
      case 'agent':
        return <User className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'collect':
        return 'border-l-blue-400 bg-blue-50';
      case 'think':
        return 'border-l-purple-400 bg-purple-50';
      case 'act':
        return 'border-l-green-400 bg-green-50';
      case 'agent':
        return 'border-l-orange-400 bg-orange-50';
      default:
        return 'border-l-gray-400 bg-gray-50';
    }
  };

  const blockOptions = availableBlockOptions?.[block.type] || [];
  const stepCount = block.steps?.length || 0;

  return (
    <Card className={`border-l-4 ${getBlockColor(block.type)} transition-all duration-200`}>
      <CardContent className="p-4">
        {/* Block Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200">
              <span className="text-sm font-medium">{index + 1}</span>
            </div>
            <div className="flex items-center gap-2">
              {getBlockIcon(block.type)}
              <Badge variant="outline" className="capitalize">
                {block.type}
              </Badge>
              {stepCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {stepCount} step{stepCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Block Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? <ChevronDownIcon className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveBlockUp(index)}
              disabled={index === 0}
              className="h-8 w-8 p-0"
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveBlockDown(index)}
              disabled={isLast}
              className="h-8 w-8 p-0"
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeBlock(block.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Block Configuration */}
        <div className="space-y-4">
          {/* Block Option Selection */}
          <div>
            <label className="text-sm font-medium mb-2 block">Block Type</label>
            <Select value={block.option} onValueChange={(value) => updateBlockOption(block.id, value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select block option" />
              </SelectTrigger>
              <SelectContent>
                {blockOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Block Name */}
          <div>
            <label className="text-sm font-medium mb-2 block">Block Name</label>
            <Textarea
              value={block.name}
              onChange={(e) => updateBlockName(block.id, e.target.value)}
              placeholder="Enter block name"
              className="resize-none flow-block-name-input"
              rows={2}
            />
          </div>

          {/* Agent Selection for Agent Blocks */}
          {block.type === 'agent' && (
            <div>
              <label className="text-sm font-medium mb-2 block">Select Agent</label>
              <Select value={block.agentId || ''} onValueChange={(value) => handleAgentSelection(block.id, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an agent" />
                </SelectTrigger>
                <SelectContent>
                  {agentsData.map((agent) => (
                    <SelectItem key={agent.id} value={agent.id}>
                      <div className="flex items-center gap-2">
                        <span>{agent.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {agent.domain}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Expandable Steps Section */}
        {isExpanded && (
          <FlowBlockStepsEditor
            blockId={block.id}
            blockName={block.name}
            steps={block.steps || []}
            onStepsChange={updateBlockSteps}
          />
        )}
      </CardContent>
    </Card>
  );
}
