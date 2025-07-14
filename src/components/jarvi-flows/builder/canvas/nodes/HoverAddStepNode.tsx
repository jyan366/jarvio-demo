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
      {/* Add Step Box */}
      <div
        className={`
          w-32 h-20 border-2 border-dashed border-gray-300 rounded-lg
          flex items-center justify-center cursor-pointer
          transition-opacity duration-200 bg-white/50
          ${isHovered ? 'opacity-80 border-gray-400' : 'opacity-30'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowSelectionDialog(true)}
      >
        <div className="flex flex-col items-center gap-1 text-gray-600">
          <Plus className="h-5 w-5" />
          <span className="text-xs font-medium">Add Step</span>
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