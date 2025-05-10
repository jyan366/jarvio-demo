
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
  taskData
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
  
  // Detect if this is a flow-driven task
  const [isFlowTask, setIsFlowTask] = useState(false);
  
  useEffect(() => {
    const checkIfFlowTask = () => {
      // If taskData has flowId, or if task title starts with "Flow:"
      if ((taskData && taskData.flowId) || (taskTitle && taskTitle.startsWith("Flow:"))) {
        setIsFlowTask(true);
      } else {
        setIsFlowTask(false);
      }
    };
    
    checkIfFlowTask();
  }, [taskData, taskTitle]);

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
              isTransitioning={false}
              onSendMessage={handleSendMessage}
              onGenerateSteps={onGenerateSteps}
              taskId={taskId}
              taskData={taskData}
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
