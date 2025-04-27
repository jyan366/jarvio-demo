
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentUploader } from './DocumentUploader';
import { DocumentList } from './DocumentList';
import { JarvioChatTab } from './JarvioChatTab';
import { JarvioDataLogTab } from './JarvioDataLogTab';
import { useJarvioAssistantLogic } from './hooks/useJarvioAssistantLogic';
import { useJarvioAssistantTabs } from './hooks/useJarvioAssistantTabs';
import { Subtask } from "@/pages/TaskWorkContainer";
import { AutoRunControls } from './AutoRunControls';

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
    inputValue,
    setInputValue,
    isLoading,
    autoRunMode,
    setAutoRunMode,
    autoRunPaused,
    setAutoRunPaused,
    subtaskData,
    isTransitioning,
    handleSendMessage
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

  const handleToggleAutoRun = () => {
    setAutoRunMode(prev => !prev);
    setAutoRunPaused(false);
  };

  const handleTogglePause = () => {
    setAutoRunPaused(prev => !prev);
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="chat" className="flex-1" value={tab} onValueChange={(value) => setTab(value as "chat" | "datalog")}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="datalog">Data Log</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-3 border-b">
              <AutoRunControls
                autoRunMode={autoRunMode}
                autoRunPaused={autoRunPaused}
                onToggleAutoRun={handleToggleAutoRun}
                onTogglePause={handleTogglePause}
                className="w-full"
              />
            </div>
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
          <div className="space-y-6 p-4">
            <DocumentUploader />
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Uploaded Documents</h3>
              <DocumentList />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
