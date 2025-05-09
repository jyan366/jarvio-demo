
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { JarvioChatMessages } from "../JarvioChatMessages";
import { Subtask } from "@/pages/TaskWorkContainer";

interface JarvioMessageAreaProps {
  messages: any[];
  subtasks: Subtask[];
  activeSubtaskIdx: number;
  onGenerateSteps?: () => void;
}

export const JarvioMessageArea: React.FC<JarvioMessageAreaProps> = ({
  messages,
  subtasks,
  activeSubtaskIdx,
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
