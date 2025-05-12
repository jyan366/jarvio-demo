
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import type { Message, Subtask } from "./AgentChatInterface";

interface AgentMessageAreaProps {
  messages: Message[];
  subtasks: Subtask[];
  activeSubtaskIndex: number;
}

export function AgentMessageArea({ 
  messages, 
  subtasks,
  activeSubtaskIndex 
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
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}
            >
              {!message.isUser && (
                <div className="w-8 h-8 rounded-full bg-[#9b87f5] flex items-center justify-center mr-2 self-start mt-1">
                  <span className="text-sm font-semibold text-white">J</span>
                </div>
              )}
              
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.isUser
                    ? "bg-white border border-gray-200"
                    : message.isStepCompletion
                      ? "bg-[#EAE6FF] border border-[#9b87f5]/30 w-full"
                      : message.isLoading
                        ? "bg-[#EAE6FF] border border-[#9b87f5]/30"
                        : "bg-[#F1F0FB] border border-[#9b87f5]/10"
                }`}
              >
                {message.isLoading ? (
                  <div className="flex items-center gap-2 text-[#9b87f5]">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Step {message.stepNumber} being executed...</span>
                  </div>
                ) : (
                  <>
                    <div className="prose prose-sm dark:prose-invert break-words whitespace-pre-wrap">
                      {message.text}
                    </div>
                    <div className="text-right text-xs text-gray-400 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </>
                )}
              </div>
              
              {message.isUser && (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ml-2 self-start mt-1">
                  <span className="text-sm font-semibold text-gray-700">U</span>
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
