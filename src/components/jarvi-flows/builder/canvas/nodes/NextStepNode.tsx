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
    setShowSelectionDialog(true);
  };

  return (
    <>
      <Handle type="target" position={Position.Left} />
      
      <div
        className="w-80 h-48 border-2 border-dashed border-primary/30 rounded-lg
                   flex items-center justify-center cursor-pointer
                   transition-all duration-200 bg-background/50 hover:bg-background/80
                   hover:border-primary/50 hover:shadow-md"
        onClick={handleClick}
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
          <Plus className="h-8 w-8" />
          <span className="text-base font-medium">Add Next Step</span>
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