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
  awaitingContinue: boolean;
  isTransitioning: boolean;
  onSendMessage: (e?: React.FormEvent) => void;
  onApproval: (approved: boolean) => void;
  onContinue: () => void;
  feedback: string;
  setFeedback: (value: string) => void;
  onFeedbackAndContinue: (e: React.FormEvent) => void;
}

export const JarvioChatTab: React.FC<JarvioChatTabProps> = ({
  messages, // now always all messages across all subtasks
  subtasks,
  activeSubtaskIdx,
  inputValue,
  setInputValue,
  isLoading,
  pendingApproval,
  autoRunMode,
  autoRunPaused,
  awaitingContinue,
  isTransitioning,
  onSendMessage,
  onApproval,
  onContinue,
  feedback,
  setFeedback,
  onFeedbackAndContinue,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const currentSubtask = subtasks[activeSubtaskIdx];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!isLoading && !pendingApproval && !awaitingContinue && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, pendingApproval, awaitingContinue]);

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
        ) : awaitingContinue ? (
          <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
            <h4 className="font-medium text-sm mb-2 flex items-center">
              <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs mr-2">
                Completed
              </span> 
              {currentSubtask?.title}
            </h4>
            
            <form onSubmit={onFeedbackAndContinue} className="space-y-3">
              <div>
                <label htmlFor="feedback" className="block text-xs font-medium text-gray-700 mb-1">
                  Add feedback (optional)
                </label>
                <Textarea
                  id="feedback"
                  placeholder="Add any feedback before continuing..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="min-h-[60px] text-sm"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isTransitioning}
              >
                {isTransitioning ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1" />
                )}
                {feedback.trim() ? 'Submit & Continue' : 'Mark Complete & Continue'}
              </Button>
            </form>
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
