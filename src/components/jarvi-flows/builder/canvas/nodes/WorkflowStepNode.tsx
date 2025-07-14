import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Settings, Trash2, Check, Plus, Bot, Unlink } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { blocksData } from '../../../data/blocksData';

interface WorkflowStepNodeData {
  step: FlowStep;
  block: FlowBlock | null;
  onStepUpdate: (updates: Partial<FlowStep>) => void;
  onBlockUpdate: (updates: Partial<FlowBlock>) => void;
  onDelete: () => void;
  onAttachBlock?: () => void;
  onDetachBlock?: () => void;
  onConfigureBlock?: () => void;
  onConvertToAgent?: () => void;
  availableBlockOptions?: Record<string, string[]>;
}

const WorkflowStepNode = memo(({ data }: NodeProps) => {
  const { step, block, onStepUpdate, onDelete, onAttachBlock, onDetachBlock, onConfigureBlock, onConvertToAgent } = data as unknown as WorkflowStepNodeData;

  const isUnselected = step.stepType === 'unselected' || (!step.isAgentStep && !block && !step.blockId);
  const isAgentStep = step.isAgentStep;

  // Find block logo from blocksData
  const getBlockLogo = (blockName?: string) => {
    if (!blockName) return null;
    
    // Search through all categories in blocksData
    for (const category of Object.values(blocksData)) {
      if (Array.isArray(category)) {
        const foundBlock = category.find(b => b.name === blockName || b.name === block?.option);
        if (foundBlock?.logo) {
          return foundBlock.logo;
        }
      }
    }
    return null;
  };

  const blockLogo = getBlockLogo(block?.name || block?.option);

  return (
    <div className="relative">
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3" 
        style={{ top: '70px' }} 
      />
      
      {/* Floating step name and description above the block */}
      <div className="absolute -top-16 left-0 w-72 space-y-1 mb-4">
        <Input
          placeholder="Step name..."
          value={step.title || ''}
          onChange={(e) => onStepUpdate({ title: e.target.value })}
          className="text-xs h-7 bg-transparent border-none shadow-none p-1 font-medium placeholder:text-gray-400"
        />
        <Input
          placeholder="Step description..."
          value={step.description || ''}
          onChange={(e) => onStepUpdate({ description: e.target.value })}
          className="text-xs h-6 bg-transparent border-none shadow-none p-1 placeholder:text-gray-400"
        />
      </div>
      
      <Card className="w-72 h-72 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm">
        <CardContent className="p-4 h-full flex flex-col justify-center">
          <div className="space-y-3">
            {/* Step Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isAgentStep && (
                  <Badge variant="secondary" className="text-xs w-fit">
                    <Bot className="w-3 h-3 mr-1" />
                    Agent
                  </Badge>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={onDelete}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>

            {/* Block Section */}
            <div className="pt-2">
              {isUnselected ? (
                <div className="text-center space-y-4">
                  <div className="text-sm text-gray-600">
                    Choose step type
                  </div>
                  <div className="flex flex-col gap-3 px-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        onStepUpdate({ 
                          isAgentStep: true, 
                          stepType: 'agent'
                        });
                      }}
                      className="w-full h-12 flex items-center justify-center gap-2 text-sm"
                    >
                      <Bot className="h-4 w-4" />
                      Agent
                    </Button>
                    <Button
                      variant="outline"
                      onClick={onAttachBlock}
                      className="w-full h-12 flex items-center justify-center gap-2 text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      Block
                    </Button>
                  </div>
                </div>
              ) : block ? (
                <div className="space-y-2">
                  <div className="text-center">
                    {blockLogo && (
                      <div className="w-12 h-12 mx-auto mb-2 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                        <img 
                          src={blockLogo} 
                          alt={block.option || block.name}
                          className="w-8 h-8 object-contain"
                        />
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-900 block">
                      {block.option || block.name}
                    </span>
                    <span className="text-xs font-medium text-gray-600">
                      Action
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onConfigureBlock}
                      className="flex-1 h-7 text-xs"
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Config
                    </Button>
                    {onDetachBlock && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          console.log('Detach button clicked');
                          onDetachBlock();
                        }}
                        className="h-7 px-2 text-xs"
                        title="Detach block"
                      >
                        <Unlink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : isAgentStep ? (
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-2">
                    AI Agent will handle this step
                  </div>
                  <Badge variant="outline" className="text-xs">
                    No configuration needed
                  </Badge>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-xs text-gray-600 mb-2">
                    No action attached
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onAttachBlock}
                    className="h-7 px-3 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Attach Action
                  </Button>
                </div>
              )}
            </div>

            {/* Step completion indicator */}
            {step.completed && (
              <div className="flex items-center gap-2 text-xs text-green-600 pt-2 border-t border-gray-100">
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
        style={{ top: '70px' }} 
      />
    </div>
  );
});

WorkflowStepNode.displayName = 'WorkflowStepNode';

export { WorkflowStepNode };