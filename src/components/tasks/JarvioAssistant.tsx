
import { useState } from 'react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { JarvioHeader } from './JarvioHeader';
import { JarvioChatTab } from './JarvioChatTab';
import { JarvioDataLogTab } from './JarvioDataLogTab';
import { JarvioDocumentsTab } from './JarvioDocumentsTab';
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
  // Get core assistant logic and state
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

  // Tab management
  const { tab, setTab } = useJarvioAssistantTabs();

  return (
    <div className="h-full flex flex-col">
      {/* Header with tabs */}
      <JarvioHeader
        tab={tab}
        setTab={setTab}
        currentStep={currentSubtaskIndex + 1}
        totalSteps={subtasks.length}
        currentStepTitle={subtasks[currentSubtaskIndex]?.title}
      />
      
      {/* Tab contents */}
      <Tabs value={tab} className="flex-1 overflow-hidden" onValueChange={(value) => setTab(value as JarvioTab)}>
        <TabsContent value="chat" className="flex-1 overflow-hidden">
          <div className="flex flex-col h-full">
            <JarvioChatTab
              messages={messages}
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

        <TabsContent value="documents" className="flex-1 overflow-auto">
          <JarvioDocumentsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
