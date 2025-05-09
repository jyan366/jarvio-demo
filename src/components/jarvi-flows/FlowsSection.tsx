
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { FlowsGrid, Flow } from './FlowsGrid';

interface FlowsSectionProps {
  flows: Flow[];
  onEditFlow: (flowId: string) => void;
  onRunFlow: (flowId: string) => void;
  onDeleteFlow: (flowId: string) => void;
  onCreateNewFlow: () => void;
  isCreating: boolean;
  isRunningFlow?: boolean;
}

export function FlowsSection({ 
  flows, 
  onEditFlow, 
  onRunFlow, 
  onDeleteFlow,
  onCreateNewFlow,
  isCreating,
  isRunningFlow = false
}: FlowsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Your Flows</h2>
        <Button 
          onClick={onCreateNewFlow} 
          variant="outline" 
          size="sm"
          className="border-[#4457ff] text-[#4457ff]"
          disabled={isCreating}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Flow
        </Button>
      </div>

      <FlowsGrid 
        flows={flows} 
        onEditFlow={onEditFlow} 
        onRunFlow={onRunFlow} 
        onDeleteFlow={onDeleteFlow}
        isRunningFlow={isRunningFlow}
      />
    </div>
  );
}
