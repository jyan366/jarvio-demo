import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

            {/* Tools dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Tools:</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-8 text-xs border-purple-200 focus:border-purple-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All selected by default</SelectItem>
                  <SelectItem value="custom">Custom selection</SelectItem>
                </SelectContent>
              </Select>
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