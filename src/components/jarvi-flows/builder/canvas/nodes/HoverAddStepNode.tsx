import React, { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { StepBlockSelectionDialog } from '../../StepBlockSelectionDialog';
import { FlowBlock } from '@/types/flowTypes';

interface HoverAddStepNodeProps {
  data: {
    onAddStep: (type: 'block' | 'agent', blockData?: any) => void;
  };
}

export function HoverAddStepNode({ data }: HoverAddStepNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSelectionDialog, setShowSelectionDialog] = useState(false);

  console.log('HoverAddStepNode rendered', { isHovered, showSelectionDialog });

  const handleAddStep = useCallback((type: 'block' | 'agent', blockData?: any) => {
    console.log('handleAddStep called', { type, blockData });
    data.onAddStep(type, blockData);
    setShowSelectionDialog(false);
  }, [data.onAddStep]);

  const handleBlockSelected = useCallback((block: FlowBlock) => {
    console.log('handleBlockSelected called', { block });
    handleAddStep('block', {
      name: block.name,
      type: block.type,
      description: '',
      category: block.type
    });
  }, [handleAddStep]);

  const handleAgentSelected = useCallback(() => {
    console.log('handleAgentSelected called');
    handleAddStep('agent');
  }, [handleAddStep]);

  const handleMouseEnter = () => {
    console.log('Mouse enter triggered');
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    console.log('Mouse leave triggered');
    setIsHovered(false);
  };

  const handleClick = () => {
    console.log('Click triggered');
    setShowSelectionDialog(true);
  };

  return (
    <>
      {/* Add Step Box - matching the size of other step nodes */}
      <div
        className={`
          w-80 h-48 border-2 border-dashed border-gray-300 rounded-lg
          flex items-center justify-center cursor-pointer
          transition-all duration-200 bg-white/30
          ${isHovered ? 'opacity-100 border-gray-400 bg-white/60' : 'opacity-40'}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <Plus className="h-8 w-8" />
          <span className="text-base font-medium">Add Step</span>
        </div>
      </div>

      {/* Selection Dialog */}
      <StepBlockSelectionDialog
        open={showSelectionDialog}
        onOpenChange={setShowSelectionDialog}
        onBlockSelected={handleBlockSelected}
        onAgentSelected={handleAgentSelected}
      />
    </>
  );
}