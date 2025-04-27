
import { useState } from 'react';
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
}

export function JarvioAssistant({ 
  taskId,
  taskTitle = "Task",
  taskDescription = "",
  subtasks = [],
  currentSubtaskIndex = 0,
  onSubtaskComplete = async () => {},
  onSubtaskSelect = () => {},
  onGenerateSteps
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

  // Filter messages for current subtask
  const currentSubtaskMessages = messages.filter(
    msg => msg.subtaskIdx === currentSubtaskIndex
  );

  return (
    <div className="h-full flex flex-col">
      <JarvioHeader
        tab={tab}
        setTab={setTab}
        currentStep={currentSubtaskIndex + 1}
        totalSteps={subtasks.length}
        currentStepTitle={subtasks[currentSubtaskIndex]?.title}
      />
      
      <Tabs value={tab} className="flex-1 overflow-hidden" onValueChange={(value) => setTab(value as JarvioTab)}>
        <TabsContent value="chat" className="flex-1 overflow-hidden relative">
          <div className="flex flex-col h-full">
            <JarvioChatTab
              messages={currentSubtaskMessages}
              subtasks={subtasks}
              activeSubtaskIdx={currentSubtaskIndex}
              inputValue={inputValue}
              setInputValue={setInputValue}
              isLoading={isLoading}
              isTransitioning={false}
              onSendMessage={handleSendMessage}
              onGenerateSteps={onGenerateSteps}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="datalog" className="flex-1 overflow-auto">
          <JarvioDataLogTab 
            subtasks={subtasks} 
            subtaskData={subtaskData}
            activeSubtaskIdx={currentSubtaskIndex}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
