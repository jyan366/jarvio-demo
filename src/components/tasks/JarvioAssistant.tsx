
import { useState, useEffect } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { JarvioHeader } from './JarvioHeader';
import { JarvioChatTab } from './JarvioChatTab';
import { JarvioDataLogTab } from './JarvioDataLogTab';
import { useJarvioAssistantLogic } from './hooks/useJarvioAssistantLogic';
import { useJarvioAssistantTabs, JarvioTab } from './hooks/useJarvioAssistantTabs';
import { Subtask } from "@/pages/TaskWorkContainer";

interface JarvioAssistantProps {
  taskId: string;
  taskTitle?: string;
  taskDescription?: string;
  subtasks?: Subtask[];
  currentSubtaskIndex?: number;
  onSubtaskComplete?: (idx: number) => Promise<void>;
  onSubtaskSelect?: (idx: number) => void;
  onGenerateSteps?: () => void;
  taskData?: {
    flowId?: string;
    flowTrigger?: string;
  };
  isFlowTask?: boolean;
}

export function JarvioAssistant({ 
  taskId,
  taskTitle = "Task",
  taskDescription = "",
  subtasks = [],
  currentSubtaskIndex = 0,
  onSubtaskComplete = async () => {},
  onSubtaskSelect = () => {},
  onGenerateSteps,
  taskData,
  isFlowTask = false
}: JarvioAssistantProps) {
  const {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isLoading,
    subtaskData,
    handleSendMessage,
    readyForNextSubtask,
    setReadyForNextSubtask,
    historySubtaskIdx,
    setHistorySubtaskIdx,
    setIsTransitioning,
    isTransitioning
  } = useJarvioAssistantLogic(
    taskId,
    taskTitle,
    taskDescription,
    subtasks,
    currentSubtaskIndex,
    onSubtaskComplete,
    onSubtaskSelect
  );

  const { tab, setTab } = useJarvioAssistantTabs();

  // Adapter for message sending
  const handleSendMessageAdapter = async (message: string): Promise<void> => {
    await handleSendMessage(undefined, message);
  };

  return (
    <div className="h-full flex flex-col">
      <JarvioHeader
        tab={tab}
        setTab={setTab}
        currentStep={currentSubtaskIndex + 1}
        totalSteps={subtasks.length}
        currentStepTitle={subtasks[currentSubtaskIndex]?.title}
        isFlowTask={isFlowTask}
      />
      
      <Tabs value={tab} className="flex-1 overflow-hidden" onValueChange={(value) => setTab(value as JarvioTab)}>
        <TabsContent value="chat" className="flex-1 overflow-hidden relative">
          <div className="flex flex-col h-full">
            <JarvioChatTab
              messages={messages}
              subtasks={subtasks}
              activeSubtaskIdx={currentSubtaskIndex}
              inputValue={inputValue}
              setInputValue={setInputValue}
              isLoading={isLoading}
              isTransitioning={isTransitioning || false}
              onSendMessage={handleSendMessageAdapter}
              onGenerateSteps={onGenerateSteps}
              taskId={taskId}
              taskData={taskData}
              isFlowTask={isFlowTask}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="datalog" className="flex-1 overflow-auto">
          <JarvioDataLogTab 
            subtasks={subtasks} 
            subtaskData={subtaskData}
            activeSubtaskIdx={currentSubtaskIndex}
            isFlowTask={isFlowTask}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
