
import React, { useRef, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { JarvioChatMessages } from "./JarvioChatMessages";
import { JarvioFormatMenu } from "./JarvioFormatMenu";
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

  const handleFormatSelect = (formatText: string) => {
    // Insert format at cursor position or append to end
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;
      
      const newValue = 
        inputValue.substring(0, start) + 
        formatText + 
        inputValue.substring(end);
      
      setInputValue(newValue);
      
      // Focus back on the textarea after inserting format
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.selectionStart = start + formatText.length;
          inputRef.current.selectionEnd = start + formatText.length;
        }
      }, 0);
    } else {
      setInputValue(inputValue + formatText);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col relative overflow-hidden">
      {/* Messages container with scroll */}
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

      {/* Fixed input at bottom with border only, no absolute positioning */}
      <div className="border-t bg-white shadow-md">
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
          <div className="flex items-center">
            <JarvioFormatMenu onFormatSelect={handleFormatSelect} />
          </div>
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
}
