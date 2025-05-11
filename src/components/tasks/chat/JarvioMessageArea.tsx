
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JarvioChatMessages } from "../JarvioChatMessages";
import { Subtask } from "@/pages/TaskWorkContainer";
import { Message } from "../hooks/useJarvioAssistantLogic";

interface JarvioMessageAreaProps {
  messages: Message[];
  subtasks: Subtask[];
  activeSubtaskIdx: number;
  isLoading?: boolean;
  isTransitioning?: boolean;
  onGenerateSteps?: () => void;
}

export const JarvioMessageArea: React.FC<JarvioMessageAreaProps> = ({
  messages,
  subtasks,
  activeSubtaskIdx,
  isLoading = false,
  isTransitioning = false,
  onGenerateSteps
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full pb-[76px]">
        <div className="p-4">
          {isLoading && (
            <div className="flex justify-center my-4">
              <div className="animate-pulse text-primary">Loading...</div>
            </div>
          )}
          <JarvioChatMessages 
            messages={messages}
            subtasks={subtasks}
            activeSubtaskIdx={activeSubtaskIdx}
            onGenerateSteps={onGenerateSteps}
          />
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
};
