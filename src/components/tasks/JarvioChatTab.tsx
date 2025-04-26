
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { JarvioChatMessages } from "./JarvioChatMessages";
import { AutoRunControls } from "./AutoRunControls";
import { Subtask } from "@/pages/TaskWorkContainer";

interface JarvioChatTabProps {
  messages: any[];
  subtasks: Subtask[];
  activeSubtaskIdx: number;
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  autoRunMode: boolean;
  autoRunPaused: boolean;
  isTransitioning: boolean;
  onSendMessage: (message: string) => void;
  onGenerateSteps?: () => void;
  onToggleAutoRun?: () => void;
  onTogglePause?: () => void;
}

export const JarvioChatTab: React.FC<JarvioChatTabProps> = ({
  messages,
  subtasks,
  activeSubtaskIdx,
  inputValue,
  setInputValue,
  isLoading,
  autoRunMode,
  autoRunPaused,
  isTransitioning,
  onSendMessage,
  onGenerateSteps,
  onToggleAutoRun = () => {},
  onTogglePause = () => {},
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center p-4 border-b">
        <AutoRunControls
          autoRunMode={autoRunMode}
          autoRunPaused={autoRunPaused}
          onToggleAutoRun={onToggleAutoRun}
          onTogglePause={onTogglePause}
        />
      </div>

      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        <JarvioChatMessages 
          messages={messages} 
          subtasks={subtasks}
          activeSubtaskIdx={activeSubtaskIdx} 
          onGenerateSteps={onGenerateSteps}
        />
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
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
                  handleSubmit(e);
                }
              }
            }}
          />
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading || isTransitioning}
            className="self-end"
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
