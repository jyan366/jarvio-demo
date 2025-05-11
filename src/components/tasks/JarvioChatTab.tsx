
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { JarvioMessageArea } from "./chat/JarvioMessageArea";
import { JarvioMessageInput } from "./chat/JarvioMessageInput";
import { TaskFlowExecution } from '../jarvi-flows/TaskFlowExecution'; 
import MarkdownRenderer from '@/components/shared/MarkdownRenderer';
import { Message } from './hooks/useJarvioAssistantLogic';
import { Subtask } from "@/pages/TaskWorkContainer";

interface JarvioChatTabProps {
  messages: Message[];
  subtasks: Subtask[];
  activeSubtaskIdx: number;
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  isTransitioning: boolean;
  onSendMessage: (message: string) => Promise<void>;
  onGenerateSteps?: () => void;
  taskId: string;
  taskData?: {
    flowId?: string;
    flowTrigger?: string;
  };
}

export function JarvioChatTab({ 
  messages, 
  subtasks,
  activeSubtaskIdx,
  inputValue, 
  setInputValue, 
  isLoading,
  isTransitioning,
  onSendMessage,
  onGenerateSteps,
  taskId,
  taskData
}: JarvioChatTabProps) {
  const [showFlowExecution, setShowFlowExecution] = useState(false);
  
  const isFlowTask = taskData && taskData.flowId;
  
  // Handle message submission from the input
  const handleSubmitMessage = async () => {
    if (inputValue.trim() && !isLoading) {
      await onSendMessage(inputValue);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };
  
  return (
    <>
      <JarvioMessageArea 
        messages={messages}
        subtasks={subtasks}
        activeSubtaskIdx={activeSubtaskIdx}
        isLoading={isLoading} 
        isTransitioning={isTransitioning}
        onGenerateSteps={onGenerateSteps}
      />
      
      {isFlowTask && showFlowExecution ? (
        <div className="border-t p-4">
          <TaskFlowExecution 
            taskId={taskId}
            taskData={taskData}
            subtasks={subtasks}
            isFlowTask={!!isFlowTask}
            onAddMessage={(message) => {
              console.log("Flow message:", message);
            }}
          />
          <Button 
            variant="outline"
            size="sm" 
            className="mt-4 w-full" 
            onClick={() => setShowFlowExecution(false)}
          >
            Hide Flow Execution
          </Button>
        </div>
      ) : (
        <JarvioMessageInput
          value={inputValue}
          onChange={handleInputChange}
          onSubmit={handleSubmitMessage}
          disabled={isLoading || isTransitioning}
          isFlowTask={!!isFlowTask}
          onRunFlow={() => setShowFlowExecution(true)}
        />
      )}
    </>
  );
}
