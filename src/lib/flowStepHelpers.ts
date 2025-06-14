
import { UnifiedTask } from '@/types/unifiedTask';

export interface FlowStepWithBlock {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  order: number;
  blockId?: string;
  block?: {
    id: string;
    type: 'collect' | 'think' | 'act' | 'agent';
    option: string;
    name: string;
    agentId?: string;
    agentName?: string;
  };
}

// Extract flow steps with their associated block information
export function getFlowStepsWithBlocks(task: UnifiedTask): FlowStepWithBlock[] {
  if (task.task_type !== 'flow' || !task.data?.flowSteps) {
    return [];
  }

  const flowSteps = task.data.flowSteps || [];
  const flowBlocks = task.data.flowBlocks || [];

  return flowSteps.map((step: any) => {
    const block = flowBlocks.find((block: any) => block.id === step.blockId);
    
    return {
      id: step.id,
      title: step.title,
      description: step.description,
      completed: task.steps_completed?.includes(step.order) || false,
      order: step.order,
      blockId: step.blockId,
      block: block ? {
        id: block.id,
        type: block.type,
        option: block.option,
        name: block.name,
        agentId: block.agentId,
        agentName: block.agentName
      } : undefined
    };
  });
}

// Get block information for a specific step index
export function getBlockForStepIndex(task: UnifiedTask, stepIndex: number) {
  const stepsWithBlocks = getFlowStepsWithBlocks(task);
  return stepsWithBlocks[stepIndex]?.block;
}
