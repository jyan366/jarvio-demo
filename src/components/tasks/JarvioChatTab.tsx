import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ThumbsUp, ThumbsDown, ChevronRight, Send } from "lucide-react";
import { JarvioChatMessages } from "./JarvioChatMessages";
import { Subtask } from "@/pages/TaskWorkContainer";

interface JarvioChatTabProps {
  messages: any[]; // now always all messages across all subtasks
  subtasks: Subtask[];
  activeSubtaskIdx: number;
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  pendingApproval: boolean;
  autoRunMode: boolean;
  autoRunPaused: boolean;
  isTransitioning: boolean;
  onSendMessage: (e?: React.FormEvent) => void;
  onApproval: (approved: boolean) => void;
}

export const JarvioChatTab: React.FC<JarvioChatTabProps> = ({
  messages,
  subtasks,
  activeSubtaskIdx,
  inputValue,
  setInputValue,
  isLoading,
  pendingApproval,
  autoRunMode,
  autoRunPaused,
  isTransitioning,
  onSendMessage,
  onApproval,
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const currentSubtask = subtasks[activeSubtaskIdx];

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  React.useEffect(() => {
    if (!isLoading && !pendingApproval && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, pendingApproval]);

  return (
    <div className="flex flex-col h-full relative">
      <ScrollArea className="flex-1 p-4 overflow-y-auto">
        {/* Show ALL chat history as a flowing workflow */}
        <JarvioChatMessages 
          messages={messages} 
          subtasks={subtasks}
          activeSubtaskIdx={activeSubtaskIdx} 
        />
        <div ref={messagesEndRef} />
      </ScrollArea>

      <div className="p-4 border-t bg-white">
        {pendingApproval ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
            <h4 className="font-medium text-sm mb-2">Approval Required</h4>
            <p className="text-sm text-gray-600 mb-3">
              The assistant is requesting your approval before proceeding.
            </p>
            <div className="flex gap-2">
              <Button 
                onClick={() => onApproval(true)} 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
              >
                <ThumbsUp className="w-4 h-4 mr-1" /> Approve
              </Button>
              <Button 
                onClick={() => onApproval(false)} 
                variant="outline" 
                size="sm"
              >
                <ThumbsDown className="w-4 h-4 mr-1" /> Reject
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSendMessage} className="flex gap-2">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={isLoading ? "Jarvio is thinking..." : "Type a message..."}
              className="flex-1 min-h-[36px] max-h-24"
              disabled={isLoading || isTransitioning}
              ref={inputRef}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (inputValue.trim() && !isLoading) {
                    onSendMessage();
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
        )}
      </div>
    </div>
  );
};
