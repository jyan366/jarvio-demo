
import React from "react";
import { UnifiedJarvioChat } from "./UnifiedJarvioChat";

interface JarvioAssistantProps {
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  subtasks: { id: string; title: string; done: boolean; description: string; status: string; priority: string; category: string }[];
  currentSubtaskIndex: number;
  onSubtaskComplete: (index: number) => Promise<void>;
  onSubtaskSelect: (index: number) => void;
  taskData?: {
    flowId?: string;
    flowTrigger?: string;
    flowBlocks?: any[];
    flowSteps?: any[];
  };
  isFlowTask: boolean;
  currentBlock?: {
    id: string;
    type: 'collect' | 'think' | 'act' | 'agent';
    option: string;
    name: string;
    agentId?: string;
    agentName?: string;
  };
}

export function JarvioAssistant({
  taskId,
  taskTitle,
  taskDescription,
  subtasks,
  currentSubtaskIndex,
  onSubtaskComplete,
  onSubtaskSelect,
  taskData,
  isFlowTask,
  currentBlock
}: JarvioAssistantProps) {
  return (
    <UnifiedJarvioChat
      taskId={taskId}
      taskTitle={taskTitle}
      taskDescription={taskDescription}
      subtasks={subtasks}
      currentSubtaskIndex={currentSubtaskIndex}
      onSubtaskComplete={onSubtaskComplete}
      onSubtaskSelect={onSubtaskSelect}
      taskData={taskData}
      isFlowTask={isFlowTask}
      currentBlock={currentBlock}
    />
  );
}
