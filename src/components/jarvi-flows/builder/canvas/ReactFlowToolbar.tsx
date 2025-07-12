import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';
import { AddStepDialog } from './AddStepDialog';

interface ReactFlowToolbarProps {
  onAddStep: (type: 'block' | 'agent', blockData?: any) => void;
  onAutoArrange: () => void;
}

export function ReactFlowToolbar({
  onAddStep,
  onAutoArrange,
}: ReactFlowToolbarProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-white rounded-lg shadow-md border p-2">
      {/* Add Step Dialog */}
      <AddStepDialog onAddStep={onAddStep} />

      {/* Auto Arrange */}
      <Button
        size="sm"
        variant="outline"
        onClick={onAutoArrange}
        className="flex items-center gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        Auto Arrange
      </Button>
    </div>
  );
}