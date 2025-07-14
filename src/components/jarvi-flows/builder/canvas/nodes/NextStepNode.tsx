import React, { useState, useCallback } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Plus } from 'lucide-react';
import { StepBlockSelectionDialog } from '../../StepBlockSelectionDialog';
import { FlowBlock } from '@/types/flowTypes';

interface NextStepNodeProps {
  data: {
    onAddStep: (type: 'block' | 'agent', blockData?: any) => void;
  };
}

export function NextStepNode({ data }: NextStepNodeProps) {
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

  const handleClick = () => {
    console.log('NextStepNode clicked!');
    alert('NextStepNode clicked!');
    setShowSelectionDialog(true);
  };

  const handleTestClick = () => {
    console.log('Test button clicked!');
    alert('Test button works!');
  };

  return (
    <>
      <Handle type="target" position={Position.Left} />
      
      <div
        className="w-80 h-48 border-2 border-dashed border-primary/30 rounded-lg
                   flex items-center justify-center cursor-pointer select-none
                   transition-all duration-200 bg-background/50 hover:bg-background/80
                   hover:border-primary/50 hover:shadow-md active:scale-95
                   hover:scale-105 group"
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground group-hover:text-foreground transition-colors pointer-events-none">
          <Plus className="h-8 w-8 group-hover:scale-110 transition-transform" />
          <span className="text-base font-medium">Add Next Step</span>
          <button 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              handleTestClick();
            }}
          >
            Test Button
          </button>
        </div>
      </div>

      <StepBlockSelectionDialog
        open={showSelectionDialog}
        onOpenChange={setShowSelectionDialog}
        onBlockSelected={handleBlockSelected}
        onAgentSelected={handleAgentSelected}
      />
    </>
  );
}