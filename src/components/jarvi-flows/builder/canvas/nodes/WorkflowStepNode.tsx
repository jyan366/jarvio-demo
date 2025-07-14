import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Settings, Trash2, Check, Plus, Bot, Unlink } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';

interface WorkflowStepNodeData {
  step: FlowStep;
  block: FlowBlock | null;
  onStepUpdate: (updates: Partial<FlowStep>) => void;
  onBlockUpdate: (updates: Partial<FlowBlock>) => void;
  onDelete: () => void;
  onAttachBlock?: () => void;
  onDetachBlock?: () => void;
  onConfigureBlock?: () => void;
  availableBlockOptions?: Record<string, string[]>;
}

const WorkflowStepNode = memo(({ data }: NodeProps) => {
  const { step, block, onStepUpdate, onDelete, onAttachBlock, onDetachBlock, onConfigureBlock } = data as unknown as WorkflowStepNodeData;

  const isAgentStep = step.isAgentStep || !block;

  return (
    <>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3" 
        style={{ top: '50%' }} 
      />
      
      <Card className="w-80 border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Step Header */}
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Step name..."
                  value={step.title || ''}
                  onChange={(e) => onStepUpdate({ title: e.target.value })}
                  className="text-sm font-semibold border-gray-200 focus:border-gray-300"
                />
                <Input
                  placeholder="Step description..."
                  value={step.description || ''}
                  onChange={(e) => onStepUpdate({ description: e.target.value })}
                  className="text-sm border-gray-200 focus:border-gray-300"
                />
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
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 ml-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Block Section */}
            <div className="border-t border-gray-100 pt-4">
              {block ? (
                <div className="space-y-3">
                  <div className="text-center">
                    <span className="text-lg font-semibold text-gray-900 block">
                      {block.option || block.name}
                    </span>
                    <span className="text-sm font-medium text-gray-600">
                      Action
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onConfigureBlock}
                      className="flex-1 h-9"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Configure
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={onDetachBlock}
                      className="h-9 px-3"
                      title="Detach block"
                    >
                      <Unlink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : isAgentStep ? (
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">
                    AI Agent will handle this step
                  </div>
                  <Badge variant="outline" className="text-xs">
                    No configuration needed
                  </Badge>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-2">
                    No action attached
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onAttachBlock}
                    className="h-8 px-3 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Attach Action
                  </Button>
                </div>
              )}
            </div>

            {/* Step completion indicator */}
            {step.completed && (
              <div className="flex items-center gap-2 text-sm text-green-600 pt-2 border-t border-gray-100">
                <Check className="w-4 h-4" />
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
        style={{ top: '50%' }} 
      />
    </>
  );
});

WorkflowStepNode.displayName = 'WorkflowStepNode';

export { WorkflowStepNode };