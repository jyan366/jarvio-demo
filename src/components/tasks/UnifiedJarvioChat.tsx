
import React from "react";
import { JarvioChatTab } from "./JarvioChatTab";

interface UnifiedJarvioChatProps {
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

export function UnifiedJarvioChat({
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
}: UnifiedJarvioChatProps) {
  // Convert subtasks to the format expected by JarvioChatTab
  const convertedSubtasks = subtasks.map((subtask, index) => ({
    id: subtask.id,
    title: subtask.title,
    description: subtask.description,
    done: subtask.done,
    status: subtask.status as 'Not Started' | 'In Progress' | 'Done',
    priority: subtask.priority as 'LOW' | 'MEDIUM' | 'HIGH',
    category: subtask.category
  }));

  return (
    <JarvioChatTab
      messages={[]}
      subtasks={convertedSubtasks}
      activeSubtaskIdx={currentSubtaskIndex}
      inputValue=""
      setInputValue={() => {}}
      isLoading={false}
      isTransitioning={false}
      onSendMessage={async () => {}}
      taskId={taskId}
      taskData={taskData}
      isFlowTask={isFlowTask}
    />
  );
}
