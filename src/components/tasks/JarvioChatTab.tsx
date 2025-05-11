
import { useState, useEffect } from 'react';
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
  isFlowTask?: boolean;
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
  taskData,
  isFlowTask = false
}: JarvioChatTabProps) {
  const [showFlowExecution, setShowFlowExecution] = useState(false);
  const [flowExecutionResults, setFlowExecutionResults] = useState<any>(null);
  
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
  
  // Handle flow execution results update
  const handleFlowMessageUpdate = (message: any) => {
    console.log("Flow message:", message);
    
    if (message && typeof message === 'object') {
      setFlowExecutionResults(message);
      
      // If we receive results for a completed flow step, we may want to send a message from Jarvio
      if (message.blockComplete && message.blockType && message.blockName) {
        const assistantMessage = `✅ Completed flow step "${message.blockName || message.blockType}" successfully.`;
        onSendMessage(`[FLOW_UPDATE] ${assistantMessage}`);
      }
      
      // If we need user input for a flow step
      if (message.needsUserInput && message.userPrompt) {
        const assistantMessage = `🔸 ${message.userPrompt}\n\nPlease provide the necessary information or confirm that you've completed this step manually.`;
        onSendMessage(`[FLOW_ACTION_REQUIRED] ${assistantMessage}`);
      }
    }
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
        isFlowTask={!!isFlowTask}
      />
      
      {isFlowTask && showFlowExecution ? (
        <div className="border-t p-4">
          <TaskFlowExecution 
            taskId={taskId}
            taskData={taskData}
            subtasks={subtasks}
            isFlowTask={!!isFlowTask}
            onAddMessage={handleFlowMessageUpdate}
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
