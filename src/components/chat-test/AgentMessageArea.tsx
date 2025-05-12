
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle } from "lucide-react";
import type { Message, Subtask } from "./AgentChatInterface";

interface AgentMessageAreaProps {
  messages: Message[];
  subtasks: Subtask[];
  activeSubtaskIndex: number;
  onStepClick?: (stepIndex: number) => void;
}

export function AgentMessageArea({ 
  messages, 
  subtasks,
  activeSubtaskIndex,
  onStepClick
}: AgentMessageAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full pb-4">
        <div className="p-4">
          {messages.map((message, index) => (
            <div key={message.id}>
              {/* Agent avatar and message */}
              {!message.isUser && (
                <div className="flex mb-4 gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#9b87f5] flex items-center justify-center mr-2 self-start mt-1 flex-shrink-0">
                    <span className="text-sm font-semibold text-white">J</span>
                  </div>
                  
                  <div className="max-w-[85%]">
                    {/* Regular message or step completion */}
                    {!message.isLoading && (
                      <div className={`prose prose-sm dark:prose-invert break-words whitespace-pre-wrap ${
                        message.isStepCompletion ? "text-[#9b87f5] font-medium" : ""
                      }`}>
                        {message.text}
                        <div className="text-xs text-gray-400 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    )}
                    
                    {/* Loading execution message */}
                    {message.isLoading && (
                      <div className="bg-[#EAE6FF] border border-[#9b87f5]/30 rounded-lg p-3 mb-1 cursor-pointer"
                          onClick={() => message.stepNumber && onStepClick && onStepClick(message.stepNumber - 1)}>
                        <div className="flex items-center gap-2 text-[#9b87f5]">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>{message.text || `Step ${message.stepNumber} being executed...`}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Step completion box */}
                    {message.isStepCompletion && message.stepNumber && (
                      <div className="bg-[#EAE6FF] border border-[#9b87f5]/30 rounded-lg p-3 mt-2 cursor-pointer"
                          onClick={() => message.stepNumber && onStepClick && onStepClick(message.stepNumber - 1)}>
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          <span>Step {message.stepNumber} completed successfully</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* User message */}
              {message.isUser && (
                <div className="flex justify-end mb-4">
                  <div className="max-w-[85%] text-right">
                    <div className="prose prose-sm dark:prose-invert break-words whitespace-pre-wrap">
                      {message.text}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ml-2 self-start mt-1">
                    <span className="text-sm font-semibold text-gray-700">U</span>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
