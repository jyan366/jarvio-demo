
import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AlertOctagon, Loader2 } from 'lucide-react';
import { Subtask } from "@/pages/TaskWorkContainer";
import { Message } from './hooks/useJarvioAssistantLogic';
import { MarkdownRenderer } from '@/components/shared/MarkdownRenderer';
import { formatSystemMessage } from './services/jarvioMessageService';
import { TaskFlowExecution } from '../jarvi-flows/TaskFlowExecution';

interface JarvioChatTabProps {
  messages: Message[];
  subtasks: Subtask[];
  activeSubtaskIdx: number;
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  isTransitioning: boolean;
  onSendMessage: (e: React.FormEvent) => void;
  onGenerateSteps?: () => void;
  taskId?: string;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showFlowUI, setShowFlowUI] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputValue]);
  
  // Check if this is a flow task
  const isFlowTask = React.useMemo(() => {
    if (!taskId || !taskData) return false;
    return !!taskData.flowId;
  }, [taskId, taskData]);
  
  // Handle "Run flow" command
  const handleRunFlow = () => {
    setShowFlowUI(true);
  };
  
  // Add flow execution messages
  const addFlowExecutionMessage = (message: Message) => {
    // In a real implementation, this would update the messages state
    console.log("Flow execution message:", message);
  };

  const checkForFlowCommand = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      
      // Check if the user is asking to run the flow
      if (isFlowTask && inputValue.toLowerCase().includes("run flow")) {
        handleRunFlow();
        setInputValue("");
        return true;
      }
      
      // Not a flow command, proceed with normal send
      return false;
    }
    return false;
  };

  const renderMessages = () => {
    // Only render messages relevant to the current subtask
    return messages.filter(message => {
      return message.subtaskIdx === undefined || 
             message.subtaskIdx === activeSubtaskIdx;
    }).map((message) => (
      <div 
        key={message.id} 
        className={`py-3 px-4 rounded-lg mb-3 ${
          message.isUser 
            ? 'bg-blue-50 ml-8' 
            : message.systemLog 
              ? 'bg-amber-50 border border-amber-100' 
              : 'bg-neutral-50 mr-8'
        }`}
      >
        <div className="flex items-center mb-1">
          <div className="text-xs font-medium text-gray-700">
            {message.isUser ? 'You' : message.systemLog ? 'System' : 'Jarvio'} 
          </div>
          <div className="text-[10px] text-gray-400 ml-2">
            {message.timestamp.toLocaleTimeString()}
          </div>
        </div>
        <div className="text-sm space-y-2 break-words">
          {message.systemLog ? (
            <div className="flex items-start">
              <AlertOctagon className="w-4 h-4 text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
              <span>{message.text}</span>
            </div>
          ) : (
            <MarkdownRenderer content={message.text} />
          )}
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-3 overflow-auto">
        <div className="space-y-3 pb-4">
          {renderMessages()}
          {isLoading && (
            <div className="flex justify-center items-center py-6">
              <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Task flow execution UI */}
        {showFlowUI && taskId && taskData && (
          <div className="mt-4 mb-4">
            <TaskFlowExecution 
              taskId={taskId} 
              taskData={taskData} 
              subtasks={subtasks}
              isFlowTask={isFlowTask}
              onAddMessage={addFlowExecutionMessage}
            />
          </div>
        )}
      </ScrollArea>
      
      <div className="border-t p-3">
        <form onSubmit={onSendMessage} className="flex flex-col">
          <Textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (checkForFlowCommand(e)) {
                return;
              }
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!isLoading && inputValue.trim()) {
                  onSendMessage(e);
                }
              }
            }}
            placeholder={`Message Jarvio about ${subtasks[activeSubtaskIdx]?.title || 'this task'}`}
            className="min-h-[80px] max-h-[180px] resize-none"
          />
          <div className="flex justify-between mt-2">
            {onGenerateSteps && !subtasks.length && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onGenerateSteps}
                className="text-xs"
              >
                Generate steps
              </Button>
            )}
            <Button
              type="submit"
              disabled={isLoading || isTransitioning || !inputValue.trim()}
              className="ml-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Thinking...
                </>
              ) : (
                'Send'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
