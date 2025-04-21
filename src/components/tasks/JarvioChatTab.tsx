
import React, { useRef, useEffect } from "react";
import { Loader2, Zap, User, MessageSquare, ThumbsUp, Pause, Play, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { JarvioChatMessages } from "./JarvioChatMessages";
import { Subtask } from "@/pages/TaskWorkContainer";

interface Message {
  id: string;
  isUser: boolean;
  text: string;
  timestamp: Date;
  subtaskIdx?: number;
  systemLog?: boolean;
}

interface JarvioChatTabProps {
  messages: Message[];
  subtasks: Subtask[];
  activeSubtaskIdx: number;
  inputValue: string;
  setInputValue: (val: string) => void;
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
  setFeedback: (val: string) => void;
  onFeedbackAndContinue: (e: React.FormEvent) => void;
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const lastScrollPosition = useRef(0);
  const userHasScrolled = useRef(false);
  
  // Track scroll position to detect user scrolling
  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    
    // Calculate distance from bottom
    const scrollElement = scrollAreaRef.current;
    const { scrollTop, scrollHeight, clientHeight } = scrollElement;
    const scrolledToBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    // Track last position
    lastScrollPosition.current = scrollTop;
    
    // If user has scrolled up manually, don't auto-scroll until they scroll to bottom again
    if (!scrolledToBottom) {
      userHasScrolled.current = true;
    } else {
      userHasScrolled.current = false;
    }
  };
  
  // Only scroll to bottom on new content or state changes that would add content
  useEffect(() => {
    // Don't scroll if user has scrolled up and is reading previous messages
    if (userHasScrolled.current) return;
    
    // Using setTimeout to ensure DOM has updated before scrolling
    const timeoutId = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    
    // Cleanup timeout on unmount or before next effect run
    return () => clearTimeout(timeoutId);
  }, [
    // Only depend on things that should trigger a scroll
    messages.length, // When messages change
    isLoading, // When loading state changes
    pendingApproval, // When approval state changes
    awaitingContinue, // When continue state changes
    isTransitioning, // When transitioning state changes
  ]);

  return (
    <div className="flex flex-col h-full">
      <div 
        className="flex-1 p-4 pb-0 overflow-y-auto" 
        ref={scrollAreaRef}
        onScroll={handleScroll}
      >
        <div className="space-y-4 pr-2 pb-4">
          {isTransitioning && (
            <div className="flex items-center justify-center p-4">
              <div className="text-center">
                <Loader2 size={24} className="animate-spin mx-auto mb-2 text-purple-600" />
                <p className="text-sm text-purple-800">Transitioning to next subtask...</p>
              </div>
            </div>
          )}
          {!isTransitioning && (
            <JarvioChatMessages messages={messages} subtasks={subtasks} activeSubtaskIdx={activeSubtaskIdx} />
          )}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                <Zap size={18} />
              </div>
              <div className="rounded-lg px-4 py-3 bg-purple-50">
                <div className="flex items-center gap-3">
                  <Loader2 size={16} className="animate-spin" />
                  <div className="space-y-2">
                    <p className="text-sm text-purple-900">Working on it...</p>
                    <div className="space-y-1">
                      <Skeleton className="h-2 w-[190px]" />
                      <Skeleton className="h-2 w-[160px]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {pendingApproval && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-2">
              <p className="text-sm font-medium mb-2">Approval required</p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => onApproval(true)}
                >
                  <ThumbsUp size={16} className="mr-1" /> Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => onApproval(false)}
                >
                  Reject
                </Button>
              </div>
            </div>
          )}
          {awaitingContinue && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-green-800">
                <Check size={18} className="text-green-600" />
                <p className="font-medium">Subtask complete!</p>
              </div>
              <p className="text-sm text-green-700">
                Review the results above and the collected data (see Data Log tab).
              </p>
              {activeSubtaskIdx < subtasks.length - 1 && (
                <div className="bg-white border border-green-100 rounded p-2 mb-1">
                  <p className="text-xs font-medium text-green-700">Next subtask:</p>
                  <p className="text-sm flex items-center gap-1">
                    <ChevronRight size={14} className="text-green-500" />
                    {subtasks[activeSubtaskIdx + 1]?.title || "No more subtasks"}
                  </p>
                </div>
              )}
              <form className="flex flex-col gap-2" onSubmit={onFeedbackAndContinue}>
                <Textarea
                  className="min-h-14 text-xs"
                  placeholder="Optional: Write feedback for Jarvio about this step..."
                  value={feedback}
                  onChange={e => setFeedback(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={onContinue}
                    type="button"
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                    disabled={isTransitioning}
                  >
                    {activeSubtaskIdx < subtasks.length - 1 ? (
                      <>Continue to next step <ChevronRight size={14} /></>
                    ) : (
                      "Complete task"
                    )}
                  </Button>
                  {feedback.trim() && (
                    <Button
                      size="sm"
                      variant="outline"
                      type="submit"
                      disabled={isTransitioning}
                    >
                      Send Feedback & Continue
                    </Button>
                  )}
                </div>
              </form>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Form stays at the bottom */}
      <form
        onSubmit={onSendMessage}
        className="sticky bottom-0 left-0 right-0 p-4 pt-2 border-t bg-white z-20"
        style={{
          boxShadow: "0 -6px 20px 0 rgba(0,0,0,0.10)",
        }}
      >
        <div className="flex items-end gap-2">
          <Textarea
            className="min-h-24 text-sm resize-none"
            placeholder="Ask Jarvio for help..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={
              isLoading ||
              pendingApproval ||
              (autoRunMode && !autoRunPaused) ||
              awaitingContinue ||
              isTransitioning
            }
          />
          <Button 
            type="submit" 
            disabled={
              isLoading ||
              !inputValue.trim() ||
              pendingApproval ||
              (autoRunMode && !autoRunPaused) ||
              awaitingContinue ||
              isTransitioning
            }
            className="h-10"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
