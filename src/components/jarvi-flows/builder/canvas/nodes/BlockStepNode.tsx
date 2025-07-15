import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Brain, Zap, Settings, Trash2, Check } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { blocksData } from '../../../data/blocksData';

interface BlockStepNodeData {
  step: FlowStep;
  block: FlowBlock | null;
  onStepUpdate: (updates: Partial<FlowStep>) => void;
  onBlockUpdate: (updates: Partial<FlowBlock>) => void;
  onDelete: () => void;
  onBlockClick?: () => void;
  onBlockDoubleClick?: () => void;
  availableBlockOptions?: Record<string, string[]>;
}

const BlockStepNode = memo(({ data }: NodeProps) => {
  const { step, block, onDelete, onBlockClick, onBlockDoubleClick } = data as unknown as BlockStepNodeData;

  // Find block logo from blocksData
  const getBlockLogo = (blockName?: string) => {
    if (!blockName) return '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png';
    
    // Search through all categories in blocksData
    for (const category of Object.values(blocksData)) {
      if (Array.isArray(category)) {
        const foundBlock = category.find(b => b.name === blockName || b.name === block?.option);
        if (foundBlock?.logo) {
          return foundBlock.logo;
        }
      }
    }
    return '/lovable-uploads/4f8a2e0e-6a95-4713-93f8-c4add0710fbb.png'; // Use Jarvio logo as fallback
  };

  const blockLogo = getBlockLogo(block?.name || block?.option);

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
    <div className="relative">
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3" 
        style={{ top: '70px' }} 
      />
      
      {/* Floating step name and description above the block */}
      <div className="absolute -top-12 left-0 w-72 space-y-1 mb-2">
        <div className="text-sm font-medium text-gray-900 text-center px-2">
          {step.title || 'Block Step'}
        </div>
        <div className="text-xs text-gray-600 text-center px-2">
          {step.description || 'Connected block action'}
        </div>
      </div>
      
      <Card 
        className={`w-72 min-h-[120px] transition-all duration-200 cursor-pointer border-2 ${getBlockColor(block?.type)} relative`}
        onDoubleClick={(e) => {
          e.stopPropagation();
          onBlockDoubleClick?.();
        }}
      >
        <CardContent className="p-4 h-full flex flex-col relative">
          <div className="flex-1 flex flex-col">
            {/* Block Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {getBlockIcon(block?.type)}
                <Badge className={`${getBadgeColor(block?.type)} text-xs`}>
                  {block?.type || 'Block'}
                </Badge>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>

            {/* Block Name and Logo - Centered */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-24 h-24 mx-auto mb-3 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                <img 
                  src={blockLogo} 
                  alt={block?.option || block?.name || 'Block'}
                  className="w-20 h-20 object-contain"
                />
              </div>
              <span className="text-sm font-semibold text-gray-900 text-center">
                {block?.option || block?.name || 'No block attached'}
              </span>
              <span className="text-xs text-gray-600 block text-center">
                Action
              </span>
            </div>
          </div>

          {/* Config Button - Fixed at bottom */}
          {block && (
            <div className="mt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onBlockClick?.();
                }}
                className="w-full h-8 text-xs"
              >
                <Settings className="h-3 w-3 mr-1" />
                Config
              </Button>
            </div>
          )}
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

BlockStepNode.displayName = 'BlockStepNode';

export { BlockStepNode };