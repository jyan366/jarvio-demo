import React, { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Zap, ThumbsUp, User, Check, MessageSquare, Play, Pause } from "lucide-react";
import { Subtask } from "@/pages/TaskWork";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  isUser: boolean;
  text: string;
  timestamp: Date;
}

interface SubtaskData {
  [subtaskId: string]: {
    result: string;
    completed: boolean;
  };
}

interface JarvioAssistantProps {
  taskId: string;
  taskTitle: string;
  taskDescription: string;
  subtasks: Subtask[];
  currentSubtaskIndex: number;
  onSubtaskComplete: (idx: number) => Promise<void>;
  onSubtaskSelect: (idx: number) => void;
}

export const JarvioAssistant: React.FC<JarvioAssistantProps> = ({
  taskId,
  taskTitle,
  taskDescription,
  subtasks,
  currentSubtaskIndex,
  onSubtaskComplete,
  onSubtaskSelect,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [autoRunMode, setAutoRunMode] = useState(false);
  const [autoRunPaused, setAutoRunPaused] = useState(false);
  const [subtaskData, setSubtaskData] = useState<SubtaskData>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Tracks if we're ready to proceed to the next subtask
  const [readyForNextSubtask, setReadyForNextSubtask] = useState(false);

  const [awaitingContinue, setAwaitingContinue] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    // Add welcome message when component mounts or when subtask changes
    if (messages.length === 0 && subtasks && subtasks.length > 0) {
      const currentSubtask = subtasks[currentSubtaskIndex];
      if (currentSubtask) {
        setMessages([
          {
            id: crypto.randomUUID(),
            isUser: false,
            text: `Hi! I'm Jarvio, your Amazon brand seller assistant. I'm here to help you complete your task "${taskTitle}". Let's work on the current subtask: "${currentSubtask.title}". How can I help you get started?`,
            timestamp: new Date(),
          },
        ]);
      }
    }
  }, [currentSubtaskIndex, subtasks, messages.length, taskTitle]);

  // Effect to handle auto-run mode
  useEffect(() => {
    let autoRunTimer: number | undefined;
    
    if (autoRunMode && !autoRunPaused && subtasks && subtasks.length > 0) {
      // Only proceed if we're not already processing and there's no pending approval
      if (!isLoading && !pendingApproval) {
        // If current subtask is completed, move to the next one
        if (readyForNextSubtask && currentSubtaskIndex < subtasks.length - 1) {
          const moveToNextSubtask = async () => {
            await onSubtaskComplete(currentSubtaskIndex);
            onSubtaskSelect(currentSubtaskIndex + 1);
            setReadyForNextSubtask(false);
            
            // Add transition message
            setTimeout(() => {
              const nextSubtask = subtasks[currentSubtaskIndex + 1];
              const prevSubtaskData = subtaskData[subtasks[currentSubtaskIndex]?.id]?.result || "No data collected";
              
              setMessages(prev => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  isUser: false,
                  text: `Moving to next subtask: "${nextSubtask?.title}". Using data from previous step: ${prevSubtaskData.substring(0, 100)}${prevSubtaskData.length > 100 ? '...' : ''}`,
                  timestamp: new Date()
                }
              ]);

              // Auto-initiate the next subtask
              autoRunTimer = window.setTimeout(() => {
                handleAutoRunStep();
              }, 2000);
            }, 1000);
          };
          
          moveToNextSubtask();
        } 
        // If we're at a new subtask that isn't completed and we're not waiting for anything
        else if (!readyForNextSubtask && !subtasks[currentSubtaskIndex]?.done) {
          autoRunTimer = window.setTimeout(() => {
            handleAutoRunStep();
          }, 1000);
        }
      }
    }
    
    return () => {
      if (autoRunTimer) window.clearTimeout(autoRunTimer);
    };
  }, [autoRunMode, autoRunPaused, currentSubtaskIndex, isLoading, pendingApproval, readyForNextSubtask, subtasks]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Prepare previous subtask data as context for the current subtask
  const getPreviousSubtasksContext = () => {
    if (!subtasks || subtasks.length === 0 || currentSubtaskIndex === 0) {
      return "";
    }
    
    let context = "Previous subtasks data:\n";
    
    // Include data from all previous subtasks
    for (let i = 0; i < currentSubtaskIndex; i++) {
      const subtask = subtasks[i];
      if (subtask && subtaskData[subtask.id]) {
        context += `- ${subtask.title}: ${subtaskData[subtask.id].result}\n`;
      }
    }
    
    return context;
  };

  const handleSendMessage = async (e?: React.FormEvent, autoMessage?: string, feedbackMessage?: string) => {
    e?.preventDefault();
    const messageToSend = autoMessage || inputValue;

    // If user provided feedback, include it in the conversation
    let conversation = messages;
    if (feedbackMessage) {
      conversation = [
        ...messages,
        {
          id: crypto.randomUUID(),
          isUser: true,
          text: `Feedback: ${feedbackMessage}`,
          timestamp: new Date(),
        },
      ];
    }

    if ((!messageToSend.trim() && !autoMessage) || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      isUser: true,
      text: messageToSend,
      timestamp: new Date(),
    };

    if (!autoMessage) {
      setMessages((prev) => [...prev, userMessage]);
      setInputValue("");
    }
    setIsLoading(true);
    setAwaitingContinue(false);

    try {
      const previousContext = getPreviousSubtasksContext();

      const { data, error } = await supabase.functions.invoke("jarvio-assistant", {
        body: {
          message: messageToSend,
          taskContext: {
            id: taskId,
            title: taskTitle,
            description: taskDescription,
          },
          subtasks: subtasks || [],
          currentSubtaskIndex,
          previousContext,
          conversationHistory: conversation,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data) {
        const { reply, subtaskComplete, approvalNeeded, collectedData } = data;

        const assistantMessage = {
          id: crypto.randomUUID(),
          isUser: false,
          text: reply,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Always save collected data for this subtask
        if (subtasks && currentSubtaskIndex < subtasks.length) {
          const currentSubtaskId = subtasks[currentSubtaskIndex].id;
          setSubtaskData(prev => ({
            ...prev,
            [currentSubtaskId]: {
              result: collectedData,
              completed: subtaskComplete || false
            }
          }));
        }

        // Only show Continue (block progress) after subtaskComplete!
        if (subtaskComplete) {
          setAwaitingContinue(true); // force user feedback/approval
          setReadyForNextSubtask(true);
        }

        // Approval, feedback, or other handles (existing logic)
        if (approvalNeeded) {
          setPendingApproval(true);
          if (autoRunMode) {
            setAutoRunPaused(true);
            toast({
              title: "Auto-run paused",
              description: "Your approval is required before continuing"
            });
          }
        }
      }
    } catch (error) {
      console.error("Error calling Jarvio:", error);
      toast({
        title: "Error",
        description: "Failed to get response from assistant",
        variant: "destructive",
      });

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          isUser: false,
          text: "Sorry, I encountered an error while processing your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
      
      if (autoRunMode) {
        setAutoRunPaused(true);
        toast({
          title: "Auto-run paused",
          description: "An error occurred"
        });
      }
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
  };

  // Continue to next subtask only after user clicks Continue or gives feedback
  const handleContinue = async () => {
    setAwaitingContinue(false);
    setFeedback("");
    setReadyForNextSubtask(false);

    // Mark current subtask as complete, move to next
    if (subtasks && currentSubtaskIndex < subtasks.length && !subtasks[currentSubtaskIndex].done) {
      await onSubtaskComplete(currentSubtaskIndex);
      toast({
        title: "Subtask completed",
        description: `"${subtasks[currentSubtaskIndex].title}" marked as complete`,
      });

      // If more subtasks, move to next & auto-initiate next one if in auto-run
      if (currentSubtaskIndex < subtasks.length - 1) {
        const nextIndex = currentSubtaskIndex + 1;
        onSubtaskSelect(nextIndex);

        setTimeout(() => {
          const prevSubtaskData =
            subtaskData[subtasks[currentSubtaskIndex]?.id]?.result ||
            "No data collected";

          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              isUser: false,
              text: `Ready to begin next subtask: "${subtasks[nextIndex].title}". Using data from previous step: ${prevSubtaskData.substring(0, 100)}${prevSubtaskData.length > 100 ? '...' : ''}`,
              timestamp: new Date(),
            },
          ]);
        }, 1000);

        // If in auto-run and not paused, auto-start next step
        if (autoRunMode && !autoRunPaused) {
          setTimeout(() => {
            handleAutoRunStep();
          }, 2000);
        }
      }
    }
  };

  // Feedback + continue
  const handleFeedbackAndContinue = (e: React.FormEvent) => {
    e.preventDefault();
    setAwaitingContinue(false);
    handleSendMessage(undefined,
      `Here's my feedback for the subtask: "${feedback}"`,
      feedback
    );
    setFeedback("");
  };

  const handleApproval = async (approved: boolean) => {
    setPendingApproval(false);
    if (approved) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          isUser: true,
          text: "I approve this action.",
          timestamp: new Date(),
        },
      ]);

      setTimeout(async () => {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            isUser: false,
            text: "Thank you for your approval. I'll proceed with the next steps.",
            timestamp: new Date(),
          },
        ]);
        
        // Resume auto-run if it was active
        if (autoRunMode && autoRunPaused) {
          setAutoRunPaused(false);
        }
      }, 500);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          isUser: true,
          text: "I don't approve this action.",
          timestamp: new Date(),
        },
      ]);

      setTimeout(async () => {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            isUser: false,
            text: "I understand. Let's take a different approach. What would you like to do instead?",
            timestamp: new Date(),
          },
        ]);
        
        // Pause auto-run if it was active
        if (autoRunMode) {
          setAutoRunPaused(true);
        }
      }, 500);
    }
  };

  const handleAutoRunStep = () => {
    // Don't proceed if we're already loading or approval is pending
    if (isLoading || pendingApproval) return;
    
    const currentSubtask = subtasks?.[currentSubtaskIndex];
    if (!currentSubtask) return;
    
    // Auto generate an appropriate message based on the current subtask
    const autoMessage = `Please help me complete the subtask "${currentSubtask.title}". ${currentSubtask.description ? `Details: ${currentSubtask.description}` : ''} Please proceed automatically and collect the necessary data.`;
    
    // Add a system message showing auto-run is active
    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        isUser: true,
        text: `[Auto-run] Working on: ${currentSubtask.title}`,
        timestamp: new Date()
      }
    ]);
    
    // Process the auto message
    handleSendMessage(undefined, autoMessage);
  };
  
  const toggleAutoRun = () => {
    const newAutoRunState = !autoRunMode;
    setAutoRunMode(newAutoRunState);
    
    if (newAutoRunState) {
      // Starting auto-run
      setAutoRunPaused(false);
      toast({
        title: "Auto-run activated",
        description: "Jarvio will work through steps automatically"
      });
    } else {
      // Stopping auto-run
      setAutoRunPaused(false);
      toast({
        title: "Auto-run deactivated",
        description: "Switched to manual mode"
      });
    }
  };

  const togglePause = () => {
    setAutoRunPaused(!autoRunPaused);
    toast({
      title: autoRunPaused ? "Auto-run resumed" : "Auto-run paused",
      description: autoRunPaused ? "Continuing with the process" : "Paused until you resume"
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if subtasks exist and have elements before rendering content related to subtasks
  const hasSubtasks = subtasks && subtasks.length > 0;
  const currentSubtask = hasSubtasks ? subtasks[currentSubtaskIndex] : null;

  // Calculate progress through subtasks
  const completedSubtasks = subtasks?.filter(s => s.done)?.length || 0;
  const totalSubtasks = subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  // Enhance: When showing the CURRENT SUBTASK, always show demo data if present for current (or any visited) step.
  return (
    <div className="flex flex-col h-full">
      {/* Auto-run controls */}
      <div className="px-4 py-2 border-b flex items-center justify-between bg-purple-50">
        <div className="flex items-center gap-2">
          <Switch
            checked={autoRunMode}
            onCheckedChange={toggleAutoRun}
            id="auto-run"
          />
          <label htmlFor="auto-run" className="text-sm font-medium">
            Auto-run
          </label>
        </div>
        
        {autoRunMode && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2"
            onClick={togglePause}
          >
            {autoRunPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {/* Progress indicator */}
      {hasSubtasks && (
        <div className="px-4 py-2 border-b">
          <div className="flex justify-between items-center text-xs mb-1">
            <span className="font-medium">Progress</span>
            <span>{completedSubtasks} of {totalSubtasks} steps</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pr-2">
          {messages.map((message, idx) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.isUser ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.isUser
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {message.isUser ? <User size={18} /> : <Zap size={18} />}
              </div>
              <div
                className={`rounded-lg px-4 py-2 max-w-[85%] ${
                  message.isUser
                    ? "bg-blue-50 text-blue-900"
                    : "bg-purple-50 text-purple-900"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">{message.text}</div>
                <div className="text-xs mt-1 opacity-60">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
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
                  onClick={() => handleApproval(true)}
                >
                  <ThumbsUp size={16} className="mr-1" /> Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => handleApproval(false)}
                >
                  Reject
                </Button>
              </div>
            </div>
          )}
          {/* Show "Continue" and Feedback after subtask completion */}
          {awaitingContinue && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex flex-col gap-3">
              <p className="text-sm font-medium text-green-800 mb-2">
                Subtask complete! Review the results above. Would you like to continue to the next step or provide feedback?
              </p>
              <form className="flex flex-col gap-2" onSubmit={handleFeedbackAndContinue}>
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
                    onClick={handleContinue}
                    type="button"
                  >
                    Continue
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!feedback.trim()}
                    type="submit"
                  >
                    Send Feedback & Continue
                  </Button>
                </div>
              </form>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* ... keep existing code (current subtask info, input area, etc) ... */}
      {hasSubtasks && currentSubtask && (
        <div className="px-4 py-2 border-t">
          <p className="text-xs font-medium mb-2 text-gray-500">CURRENT SUBTASK:</p>
          <div className="flex items-center gap-2 mb-1">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              currentSubtask?.done 
                ? "bg-green-500 text-white" 
                : "border-2 border-gray-300"
            }`}>
              {currentSubtask?.done && <Check size={12} />}
            </div>
            <p className="text-sm font-medium">{currentSubtask?.title || "No subtask selected"}</p>
          </div>
          {currentSubtask?.description && (
            <p className="text-xs text-gray-600 ml-7 mb-2">{currentSubtask.description}</p>
          )}

          {/* Show any collected data from this subtask if present */}
          {subtaskData[currentSubtask.id]?.result && (
            <div className="bg-green-50 border border-green-300 rounded-md px-3 py-2 my-2">
              <p className="text-xs font-semibold text-green-800 mb-1">COLLECTED DATA for this subtask:</p>
              <pre className="text-xs text-green-800 whitespace-pre-wrap">{subtaskData[currentSubtask.id].result}</pre>
            </div>
          )}
          
          {currentSubtaskIndex > 0 && subtaskData[subtasks[currentSubtaskIndex - 1]?.id] && (
            <div className="bg-blue-50 p-2 rounded-md mt-1 mb-1">
              <p className="text-xs font-medium text-blue-700">Previous step data:</p>
              <p className="text-xs text-blue-600 truncate">
                {(subtaskData[subtasks[currentSubtaskIndex - 1].id].result || "").substring(0, 100)}
                {(subtaskData[subtasks[currentSubtaskIndex - 1].id].result || "").length > 100 ? '...' : ''}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ... keep existing code (input form, message posting) the same ... */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 pt-2 border-t mt-auto bg-white"
      >
        <div className="flex items-end gap-2">
          <Textarea
            className="min-h-24 text-sm resize-none"
            placeholder="Ask Jarvio for help..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading || pendingApproval || (autoRunMode && !autoRunPaused) || awaitingContinue}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !inputValue.trim() || pendingApproval || (autoRunMode && !autoRunPaused) || awaitingContinue}
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
