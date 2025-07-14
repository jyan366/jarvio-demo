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

  const handleAddStep = useCallback((type: 'block' | 'agent', blockData?: any) => {
    data.onAddStep(type, blockData);
    setShowSelectionDialog(false);
  }, [data.onAddStep]);

  const handleBlockSelected = useCallback((block: FlowBlock) => {
    handleAddStep('block', {
      name: block.name,
      type: block.type,
      description: '',
      category: block.type
    });
  }, [handleAddStep]);

  const handleAgentSelected = useCallback(() => {
    handleAddStep('agent');
  }, [handleAddStep]);

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
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowSelectionDialog(true)}
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