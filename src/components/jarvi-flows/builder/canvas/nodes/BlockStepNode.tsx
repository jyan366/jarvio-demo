import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Brain, Zap, Settings, Trash2, Check } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';

interface BlockStepNodeData {
  step: FlowStep;
  block: FlowBlock | null;
  onStepUpdate: (updates: Partial<FlowStep>) => void;
  onBlockUpdate: (updates: Partial<FlowBlock>) => void;
  onDelete: () => void;
  availableBlockOptions?: Record<string, string[]>;
}

const BlockStepNode = memo(({ data }: NodeProps) => {
  const { step, block, onDelete } = data as unknown as BlockStepNodeData;

  const getBlockIcon = (type?: string) => {
    switch (type) {
      case 'collect':
        return <Database className="w-4 h-4 text-blue-600" />;
      case 'think':
        return <Brain className="w-4 h-4 text-purple-600" />;
      case 'act':
        return <Zap className="w-4 h-4 text-green-600" />;
      default:
        return <Database className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBlockColor = (type?: string) => {
    switch (type) {
      case 'collect':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'think':
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      case 'act':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      default:
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
    }
  };

  const getBadgeColor = (type?: string) => {
    switch (type) {
      case 'collect':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'think':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'act':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <>
      <Handle type="target" position={Position.Left} className="w-3 h-3" />
      
      <Card className={`w-72 transition-all duration-200 ${getBlockColor(block?.type)} border-2`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {getBlockIcon(block?.type)}
                <Badge 
                  variant="outline" 
                  className={`text-xs ${getBadgeColor(block?.type)}`}
                >
                  {block?.type || 'collect'}
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

            {/* Title and Block Name */}
            <div>
              <h3 className="font-medium text-sm line-clamp-2 text-gray-900">
                {step.title}
              </h3>
              {block && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                  {block.name}
                </p>
              )}
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

BlockStepNode.displayName = 'BlockStepNode';

export { BlockStepNode };