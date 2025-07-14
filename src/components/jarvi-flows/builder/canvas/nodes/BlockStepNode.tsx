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
  onBlockClick?: () => void;
  availableBlockOptions?: Record<string, string[]>;
}

const BlockStepNode = memo(({ data }: NodeProps) => {
  const { step, block, onDelete, onBlockClick } = data as unknown as BlockStepNodeData;

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
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3" 
        style={{ top: '50%' }} 
      />
      
      <div className="w-96 space-y-4">
        {/* Step Information - Floating above the block */}
        <div className="text-center space-y-2 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-lg text-gray-900">
            {step.title}
          </h3>
        </div>

        {/* Connected Block Container - Larger and Clickable */}
        <Card 
          className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer"
          onClick={onBlockClick}
        >
          <CardContent className="p-8">
            <div className="space-y-4">
              {/* Block Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-base font-medium text-gray-700">
                    Connected block:
                  </span>
                  <span className="text-base font-semibold text-gray-900">
                    {block?.option || block?.name || 'No block attached'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {block && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        onBlockClick?.();
                      }}
                      className="h-9 px-4 text-sm"
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Config
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete();
                    }}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Step completion indicator */}
              {step.completed && (
                <div className="flex items-center gap-2 text-sm text-green-600 pt-3 border-t border-gray-100">
                  <Check className="w-4 h-4" />
                  Completed
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3" 
        style={{ top: '50%' }} 
      />
    </>
  );
});

BlockStepNode.displayName = 'BlockStepNode';

export { BlockStepNode };