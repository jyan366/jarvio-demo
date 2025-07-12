import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { User, Settings, Trash2, Check } from 'lucide-react';
import { FlowStep } from '@/types/flowTypes';

interface AgentStepNodeData {
  step: FlowStep;
  isAgent: boolean;
  onStepUpdate: (updates: Partial<FlowStep>) => void;
  onDelete: () => void;
}

const AgentStepNode = memo(({ data }: NodeProps) => {
  const { step, onStepUpdate, onDelete } = data as unknown as AgentStepNodeData;

  const handlePromptChange = (prompt: string) => {
    onStepUpdate({ agentPrompt: prompt });
  };

  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <Card className="w-72 transition-all duration-200 bg-orange-50 border-orange-200 hover:bg-orange-100 border-2">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-orange-600" />
                <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
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
              <h3 className="font-medium text-sm line-clamp-2 text-gray-900">
                {step.title}
              </h3>
            </div>

            {/* Agent-specific content */}
            <div className="space-y-2">
              <div className="text-xs text-gray-600">
                24/24 blocks selected
              </div>
              <Textarea
                placeholder="Enter agent prompt..."
                value={step.agentPrompt || ''}
                onChange={(e) => handlePromptChange(e.target.value)}
                className="text-xs min-h-[60px] resize-none border-orange-200 focus:border-orange-300"
              />
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

      <Handle type="source" position={Position.Right} className="w-3 h-3" />
    </>
  );
});

AgentStepNode.displayName = 'AgentStepNode';

export { AgentStepNode };