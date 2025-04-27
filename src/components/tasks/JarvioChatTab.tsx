
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { JarvioChatMessages } from "./JarvioChatMessages";
import { Subtask } from "@/pages/TaskWorkContainer";

interface JarvioChatTabProps {
  messages: any[];
  subtasks: Subtask[];
  activeSubtaskIdx: number;
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  isTransitioning: boolean;
  onSendMessage: (e?: React.FormEvent, autoMessage?: string) => void;
  onGenerateSteps?: () => void;
}

export const JarvioChatTab: React.FC<JarvioChatTabProps> = ({
  messages,
  subtasks,
  activeSubtaskIdx,
  inputValue,
  setInputValue,
  isLoading,
  isTransitioning,
  onSendMessage,
  onGenerateSteps,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus the input field when loading completes
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-1">
          <div className="px-4 pt-4 pb-20">
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
      
      <div className="absolute bottom-0 right-0 left-0 p-4 bg-white border-t shadow-sm" 
           style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
        <form onSubmit={(e) => onSendMessage(e)} className="flex gap-2 items-end">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isLoading ? "Jarvio is thinking..." : "Type a message..."}
            className="flex-1 min-h-[36px] max-h-24 resize-none"
            disabled={isLoading || isTransitioning}
            ref={inputRef}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (inputValue.trim() && !isLoading) {
                  onSendMessage(e);
                }
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading || isTransitioning}
            className="self-end rounded-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
};
