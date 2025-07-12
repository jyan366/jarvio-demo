import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Plus } from 'lucide-react';

interface ReactFlowToolbarProps {
  onAddStep: (type: 'block' | 'agent', blockData?: any) => void;
  onAutoArrange: () => void;
  onToggleAddPanel: () => void;
}

export function ReactFlowToolbar({
  onAddStep,
  onAutoArrange,
  onToggleAddPanel,
}: ReactFlowToolbarProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-white rounded-lg shadow-md border p-2">
      {/* Add Step Button */}
      <Button
        size="sm"
        onClick={onToggleAddPanel}
        className="flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add Step
      </Button>

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