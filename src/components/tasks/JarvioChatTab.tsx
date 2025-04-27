
import React, { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { JarvioChatMessages } from "./JarvioChatMessages";
import { Subtask } from "@/pages/TaskWorkContainer";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  // Initial scroll to bottom
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when loading completes
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading && !isTransitioning) {
        onSendMessage();
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Main container with fixed height and overflow handling */}
      <div className="flex-1 relative h-full">
        {/* Scrollable messages area taking full height */}
        <ScrollArea className="absolute inset-0 pb-16">
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

      {/* Input area - fixed at bottom using absolute positioning */}
      <div className="absolute bottom-0 left-0 right-0 border-t bg-white z-10">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (inputValue.trim() && !isLoading && !isTransitioning) {
              onSendMessage(e);
            } else if (!inputValue.trim()) {
              toast({
                title: "Can't send empty message",
                description: "Please type a message first"
              });
            }
          }} 
          className="flex gap-2 items-end p-3"
        >
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isLoading ? "Jarvio is thinking..." : "Type a message..."}
            className="flex-1 min-h-[36px] max-h-24 resize-none"
            disabled={isLoading || isTransitioning}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            rows={1}
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
