
import { useState, useRef, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentUploader } from './DocumentUploader';
import { DocumentList } from './DocumentList';
import { JarvioChatTab } from './JarvioChatTab';
import { JarvioDataLogTab } from './JarvioDataLogTab';
import { useJarvioAssistantLogic } from './hooks/useJarvioAssistantLogic';
import { useJarvioAssistantTabs } from './hooks/useJarvioAssistantTabs';
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
    autoRunMode,
    autoRunPaused,
    subtaskData,
    isTransitioning,
    subtasks: assistantSubtasks,
    currentSubtaskIndex: assistantCurrentSubtaskIndex,
    getPreviousSubtasksContext
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage = {
      id: crypto.randomUUID(),
      isUser: true,
      text: inputValue,
      timestamp: new Date(),
      subtaskIdx: currentSubtaskIndex,
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response for now (in a real implementation, this would call an API)
    setTimeout(() => {
      const aiResponse = {
        id: crypto.randomUUID(),
        isUser: false,
        text: `I'll help you with that request about "${inputValue}"`,
        timestamp: new Date(),
        subtaskIdx: currentSubtaskIndex,
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="chat" className="flex-1" value={tab} onValueChange={(value) => setTab(value as "chat" | "datalog")}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="datalog">Data Log</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 overflow-hidden">
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
