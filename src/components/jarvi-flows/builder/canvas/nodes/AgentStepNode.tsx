import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Settings, Trash2, Check, Link, ChevronDown, ChevronUp } from 'lucide-react';
import { FlowStep } from '@/types/flowTypes';
import { blocksData } from '../../../data/blocksData';
import { flowBlockOptions } from '@/data/flowBlockOptions';

interface AgentStepNodeData {
  step: FlowStep;
  isAgent: boolean;
  onStepUpdate: (updates: Partial<FlowStep>) => void;
  onDelete: () => void;
  onAttachBlock?: () => void;
}

const AgentStepNode = memo(({ data }: NodeProps) => {
  const { step, onStepUpdate, onDelete, onAttachBlock } = data as unknown as AgentStepNodeData;
  const [showAllBlocks, setShowAllBlocks] = React.useState(false);

  // Get all available blocks from blocksData
  const allBlocks = React.useMemo(() => {
    const blocks: string[] = [];
    Object.values(blocksData).forEach((category: any) => {
      if (Array.isArray(category)) {
        category.forEach((block: any) => {
          blocks.push(block.name);
        });
      }
    });
    return blocks;
  }, []);

  const totalBlockCount = allBlocks.length;

  const handlePromptChange = (prompt: string) => {
    onStepUpdate({ agentPrompt: prompt });
  };

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3" 
        style={{ top: '50px' }} 
      />
      
      <Card className="w-72 transition-all duration-200 bg-purple-50 border-purple-200 hover:bg-purple-100 border-2">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-purple-600" />
                <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs">
                  Agent
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-6 w-6 p-0"
                >
                  <Settings className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onDelete}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Title */}
            <div>
              <h3 className="font-semibold text-sm text-gray-900">
                Agent Step
              </h3>
            </div>

            {/* Step name and description */}
            <div className="space-y-1">
              <Input
                placeholder="Step name..."
                value={step.title || ''}
                onChange={(e) => onStepUpdate({ title: e.target.value })}
                className="text-xs h-7 border-purple-200 focus:border-purple-300 font-medium"
              />
              <Input
                placeholder="Step description..."
                value={step.description || ''}
                onChange={(e) => onStepUpdate({ description: e.target.value })}
                className="text-xs h-7 border-purple-200 focus:border-purple-300"
              />
            </div>

            {/* Tools section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-700">Tools:</label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAllBlocks(!showAllBlocks)}
                  className="h-6 px-2 text-xs text-purple-600 hover:text-purple-700"
                >
                  {showAllBlocks ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Hide
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Show
                    </>
                  )}
                </Button>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-md p-2">
                <div className="flex items-center gap-2 text-xs text-green-700">
                  <Check className="h-3 w-3" />
                  <span className="font-medium">{totalBlockCount}/{totalBlockCount} selected</span>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  All blocks available by default
                </div>
              </div>

              {showAllBlocks && (
                <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2 bg-gray-50">
                  <div className="space-y-1">
                    {allBlocks.map((blockName, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs">
                        <Check className="h-3 w-3 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{blockName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* System prompt */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">System prompt:</label>
              <Textarea
                placeholder="Explain what the agent should do..."
                value={step.agentPrompt || ''}
                onChange={(e) => handlePromptChange(e.target.value)}
                className="text-xs min-h-[60px] resize-none border-purple-200 focus:border-purple-300"
              />
            </div>

            {/* Attach Block Option */}
            <div className="pt-2 border-t border-purple-200">
              <Button
                size="sm"
                variant="outline"
                onClick={onAttachBlock}
                className="w-full h-8 text-xs border-purple-200 hover:border-purple-300"
              >
                <Link className="h-3 w-3 mr-1" />
                Attach Block Instead
              </Button>
            </div>

            {/* Step completion indicator */}
            {step.completed && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <Check className="w-3 h-3" />
                Completed
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3" 
        style={{ top: '50px' }} 
      />
    </>
  );
});

AgentStepNode.displayName = 'AgentStepNode';

export { AgentStepNode };