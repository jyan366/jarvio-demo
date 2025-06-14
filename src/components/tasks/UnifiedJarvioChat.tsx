
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JarvioChatTab } from "./JarvioChatTab";
import { JarvioDataLogTab } from "./JarvioDataLogTab";
import { useJarvioAssistantLogic } from "./hooks/useJarvioAssistantLogic";

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
  const [activeTab, setActiveTab] = useState("chat");

  // Convert subtasks to the format expected by useJarvioAssistantLogic
  const convertedSubtasks = subtasks.map((subtask, index) => ({
    id: subtask.id,
    title: subtask.title,
    description: subtask.description,
    done: subtask.done,
    status: subtask.status as 'Not Started' | 'In Progress' | 'Done',
    priority: subtask.priority as 'LOW' | 'MEDIUM' | 'HIGH',
    category: subtask.category
  }));

  // Use the assistant logic hook
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    isTransitioning,
    handleSendMessage,
    subtaskData
  } = useJarvioAssistantLogic(
    taskId,
    taskTitle,
    taskDescription,
    convertedSubtasks,
    currentSubtaskIndex,
    onSubtaskComplete,
    onSubtaskSelect
  );

  return (
    <div className="flex flex-col h-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="datalog">Data Log</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 flex flex-col">
          <JarvioChatTab
            messages={messages}
            subtasks={convertedSubtasks}
            activeSubtaskIdx={currentSubtaskIndex}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isLoading={isLoading}
            isTransitioning={isTransitioning}
            onSendMessage={handleSendMessage}
            taskId={taskId}
            taskData={taskData}
            isFlowTask={isFlowTask}
          />
        </TabsContent>
        
        <TabsContent value="datalog" className="flex-1">
          <JarvioDataLogTab
            subtasks={convertedSubtasks}
            subtaskData={subtaskData}
            currentSubtaskIndex={currentSubtaskIndex}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
