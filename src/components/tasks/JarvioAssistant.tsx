
import { useState, useRef } from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { JarvioHeader } from './JarvioHeader';
import { JarvioChatTab } from './JarvioChatTab';
import { JarvioDataLogTab } from './JarvioDataLogTab';
import { JarvioDocumentsTab } from './JarvioDocumentsTab';
import { useJarvioAssistantLogic } from './hooks/useJarvioAssistantLogic';
import { useJarvioAssistantTabs, JarvioTab } from './hooks/useJarvioAssistantTabs';
import { useJarvioAutoRun } from './hooks/useJarvioAutoRun';
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
  const jarvioLogic = useJarvioAssistantLogic(
    taskId,
    taskTitle,
    taskDescription,
    subtasks,
    currentSubtaskIndex,
    onSubtaskComplete,
    onSubtaskSelect
  );
  
  const {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isLoading,
    autoRunMode,
    setAutoRunMode,
    autoRunPaused,
    setAutoRunPaused,
    subtaskData,
    isTransitioning,
    handleSendMessage,
    readyForNextSubtask,
    setReadyForNextSubtask,
    historySubtaskIdx,
    setIsTransitioning,
    autoRunTimerRef,
    autoRunStepInProgressRef
  } = jarvioLogic;

  // Tab management
  const { tab, setTab } = useJarvioAssistantTabs();

  // Auto-run functionality
  useJarvioAutoRun({
    ...jarvioLogic,
    messages,
    onSubtaskComplete,
    onSubtaskSelect
  });

  // Handle toggle functions for auto-run controls
  const handleToggleAutoRun = () => {
    setAutoRunMode(prev => !prev);
    setAutoRunPaused(false);
  };

  const handleTogglePause = () => {
    setAutoRunPaused(prev => !prev);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with tabs and auto-run controls */}
      <JarvioHeader
        tab={tab}
        setTab={setTab}
        autoRunMode={autoRunMode}
        autoRunPaused={autoRunPaused}
        onToggleAutoRun={handleToggleAutoRun}
        onTogglePause={handleTogglePause}
      />
      
      {/* Tab contents */}
      <div className="flex-1 overflow-hidden">
        <TabsContent value="chat" className="flex-1 overflow-hidden">
          <div className="flex flex-col h-full">
            <JarvioChatTab
              messages={messages}
              subtasks={subtasks}
              activeSubtaskIdx={currentSubtaskIndex}
              inputValue={inputValue}
              setInputValue={setInputValue}
              isLoading={isLoading}
              autoRunMode={autoRunMode}
              autoRunPaused={autoRunPaused}
              isTransitioning={isTransitioning}
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
      </div>
    </div>
  );
}
