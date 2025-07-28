
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
  runningFlowId?: string;
}

export function FlowsSection({ 
  flows, 
  onEditFlow, 
  onRunFlow, 
  onDeleteFlow,
  onCreateNewFlow,
  isCreating,
  isRunningFlow = false,
  runningFlowId
}: FlowsSectionProps) {
  
  const handleRunAllFlows = async () => {
    const manualFlows = flows.filter(flow => flow.trigger === 'manual');
    // Demo: Just simulate running each flow
    for (const flow of manualFlows) {
      onRunFlow(flow.id);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between flows
    }
  };

  const handleViewOutput = (flowId: string) => {
    // Placeholder for viewing output - not functional yet as requested
    console.log('View output for flow:', flowId);
  };
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
        onRunAllFlows={handleRunAllFlows}
        onViewOutput={handleViewOutput}
        isRunningFlow={isRunningFlow}
        runningFlowId={runningFlowId}
      />
    </div>
  );
}
