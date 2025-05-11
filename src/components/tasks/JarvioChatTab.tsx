
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
  
  return (
    <>
      <JarvioMessageArea 
        messages={messages}
        isLoading={isLoading} 
        isTransitioning={isTransitioning} 
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
          onChange={(e) => setInputValue(e.target.value)} 
          onSubmit={() => onSendMessage(inputValue)}
          isFlowTask={!!isFlowTask}
          onRunFlow={() => setShowFlowExecution(true)}
          disabled={isLoading || isTransitioning}
        />
      )}
    </>
  );
}
