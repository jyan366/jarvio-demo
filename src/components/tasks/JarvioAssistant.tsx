import React, { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Zap, ThumbsUp, User, Check, MessageSquare, Play, Pause, ArrowRight, ChevronRight } from "lucide-react";
import { Subtask } from "@/pages/TaskWorkContainer";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { JarvioDataLog } from "./JarvioDataLog";
import { JarvioSubtaskHistory } from "./JarvioSubtaskHistory";
import { JarvioChatMessages } from "./JarvioChatMessages";

interface Message {
  id: string;
  isUser: boolean;
  text: string;
  timestamp: Date;
  subtaskIdx?: number;
  systemLog?: boolean;
}

interface SubtaskData {
  result: string;
  completed: boolean;
  completedAt?: string;
}

type SubtaskDataMap = {
  [subtaskId: string]: SubtaskData;
};

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
  const [subtaskData, setSubtaskData] = useState<SubtaskDataMap>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [readyForNextSubtask, setReadyForNextSubtask] = useState(false);
  const [awaitingContinue, setAwaitingContinue] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [historySubtaskIdx, setHistorySubtaskIdx] = useState<number | null>(null);
  const [showDataLog, setShowDataLog] = useState(true);

  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (messages.length === 0 && subtasks && subtasks.length > 0) {
      const currentSubtask = subtasks[currentSubtaskIndex];
      if (currentSubtask) {
        setMessages([
          {
            id: crypto.randomUUID(),
            isUser: false,
            text: `Hi! I'm Jarvio, your Amazon brand seller assistant. I'm here to help you complete your task "${taskTitle}". Let's work on the current subtask: "${currentSubtask.title}". How can I help you get started?`,
            timestamp: new Date(),
            subtaskIdx: currentSubtaskIndex
          }
        ]);
      }
    }
  }, [currentSubtaskIndex, subtasks, messages.length, taskTitle]);

  useEffect(() => {
    let autoRunTimer: number | undefined;
    
    if (
      autoRunMode &&
      !autoRunPaused &&
      subtasks &&
      subtasks.length > 0 &&
      (historySubtaskIdx === null || historySubtaskIdx === currentSubtaskIndex)
    ) {
      if (!isLoading && !pendingApproval && !awaitingContinue && !isTransitioning) {
        if (readyForNextSubtask && currentSubtaskIndex < subtasks.length - 1) {
          setAutoRunPaused(true);
          toast({
            title: "Subtask completed",
            description: "Review the results and continue manually",
          });
          
          const moveToNextSubtask = async () => {
            setIsTransitioning(true);
            await onSubtaskComplete(currentSubtaskIndex);
            onSubtaskSelect(currentSubtaskIndex + 1);
            setReadyForNextSubtask(false);
            
            setTimeout(() => {
              const nextSubtask = subtasks[currentSubtaskIndex + 1];
              const prevSubtaskData = subtaskData[subtasks[currentSubtaskIndex]?.id]?.result || "No data collected";
              
              setMessages(prev => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  isUser: false,
                  text: `Ready to begin next subtask: "${nextSubtask?.title}". Using data from previous step: ${prevSubtaskData.substring(0, 100)}${prevSubtaskData.length > 100 ? '...' : ''}`,
                  timestamp: new Date()
                }
              ]);
              setIsTransitioning(false);
            }, 1000);
          };
          
          moveToNextSubtask();
        } 
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
  }, [
    autoRunMode, 
    autoRunPaused, 
    currentSubtaskIndex, 
    isLoading, 
    pendingApproval, 
    readyForNextSubtask, 
    subtasks, 
    awaitingContinue, 
    historySubtaskIdx,
    isTransitioning
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getPreviousSubtasksContext = () => {
    if (!subtasks || subtasks.length === 0 || currentSubtaskIndex === 0) {
      return "";
    }
    
    let context = "Previous subtasks data:\n";
    
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

    let conversation = messages;
    if (feedbackMessage) {
      conversation = [
        ...messages,
        {
          id: crypto.randomUUID(),
          isUser: true,
          text: `Feedback: ${feedbackMessage}`,
          timestamp: new Date(),
          subtaskIdx: currentSubtaskIndex
        },
      ];
    }

    if ((!messageToSend.trim() && !autoMessage) || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      isUser: true,
      text: messageToSend,
      timestamp: new Date(),
      subtaskIdx: currentSubtaskIndex
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
          subtaskIdx: currentSubtaskIndex
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (subtasks && currentSubtaskIndex < subtasks.length) {
          const currentSubtaskId = subtasks[currentSubtaskIndex].id;
          setSubtaskData(prev => ({
            ...prev,
            [currentSubtaskId]: {
              ...prev[currentSubtaskId],
              result: collectedData || prev[currentSubtaskId]?.result || "",
              completed: subtaskComplete || false,
              completedAt: subtaskComplete && !prev[currentSubtaskId]?.completedAt
                ? new Date().toISOString()
                : prev[currentSubtaskId]?.completedAt
            }
          }));
        }

        if (subtaskComplete) {
          setAwaitingContinue(true);
          setReadyForNextSubtask(true);
          
          if (autoRunMode) {
            setAutoRunPaused(true);
            toast({
              title: "Subtask completed",
              description: "Review the results and continue manually"
            });
          }
        }

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

  const handleContinue = async () => {
    setAwaitingContinue(false);
    setFeedback("");
    setReadyForNextSubtask(false);
    setIsTransitioning(true);

    if (subtasks && currentSubtaskIndex < subtasks.length && !subtasks[currentSubtaskIndex].done) {
      await onSubtaskComplete(currentSubtaskIndex);
      toast({
        title: "Subtask completed",
        description: `"${subtasks[currentSubtaskIndex].title}" marked as complete`,
      });

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
          
          setIsTransitioning(false);
        }, 1000);
      } else {
        setIsTransitioning(false);
      }
    } else {
      setIsTransitioning(false);
    }
  };

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
        
        if (autoRunMode) {
          setAutoRunPaused(true);
        }
      }, 500);
    }
  };

  const handleAutoRunStep = () => {
    if (isLoading || pendingApproval || awaitingContinue || isTransitioning) return;
    
    const currentSubtask = subtasks?.[currentSubtaskIndex];
    if (!currentSubtask) return;
    
    const autoMessage = `Please help me complete the subtask "${currentSubtask.title}". ${currentSubtask.description ? `Details: ${currentSubtask.description}` : ''} Please proceed automatically and collect the necessary data.`;
    
    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        isUser: true,
        text: `[Auto-run] Working on: ${currentSubtask.title}`,
        timestamp: new Date()
      }
    ]);
    
    handleSendMessage(undefined, autoMessage);
  };

  const toggleAutoRun = () => {
    const newAutoRunState = !autoRunMode;
    setAutoRunMode(newAutoRunState);
    
    if (newAutoRunState) {
      toast({
        title: "Auto-run activated",
        description: "Click play to start automatic processing"
      });
    } else {
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

  const hasSubtasks = subtasks && subtasks.length > 0;
  const currentSubtask = hasSubtasks ? subtasks[currentSubtaskIndex] : null;

  const completedSubtasks = subtasks?.filter(s => s.done)?.length || 0;
  const totalSubtasks = subtasks?.length || 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const handleSubtaskHistoryClick = (index: number) => {
    if (autoRunMode && !autoRunPaused) {
      setAutoRunPaused(true);
      toast({
        title: "Auto-run paused",
        description: "Navigated to a different subtask. Click play to resume."
      });
    }
    if (subtasks[index] && (index < currentSubtaskIndex || subtasks[index].done || index === currentSubtaskIndex)) {
      setHistorySubtaskIdx(index);
      onSubtaskSelect(index);
    }
  };

  useEffect(() => {
    setHistorySubtaskIdx(null);
  }, [currentSubtaskIndex]);

  const activeSubtaskIdx = historySubtaskIdx !== null ? historySubtaskIdx : currentSubtaskIndex;
  const activeSubtask = subtasks[activeSubtaskIdx];

  const subtaskMessages = messages.filter(
    (msg) => msg.subtaskIdx === activeSubtaskIdx
  );

  const getStepNumber = (idx: number) => (subtasks ? idx + 1 : 1);

  const getSubtaskIntroMessage = (subtask: Subtask, idx: number) => {
    return (
      <div className="text-sm mb-2 flex flex-col">
        <span className="font-bold text-primary">{`Step ${getStepNumber(idx)}: ${subtask.title}`}</span>
        {subtask.description && (
          <span className="text-xs text-muted-foreground">{subtask.description}</span>
        )}
      </div>
    );
  };

  const chatMessages = subtaskMessages.flatMap((message, i, arr) => {
    const isFirstInSubtask = i === 0;
    const stepIntro = isFirstInSubtask && activeSubtask
      ? [getSubtaskIntroMessage(activeSubtask, activeSubtaskIdx)]
      : [];
    return [...stepIntro, (
      <div
        key={message.id}
        className={`flex items-start gap-3 ${message.isUser ? "flex-row-reverse" : ""}`}
      >
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            message.isUser
              ? "bg-blue-100 text-blue-700"
              : message.systemLog
                ? "bg-green-100 text-green-800"
                : "bg-purple-100 text-purple-700"
          }`}
        >
          {message.isUser ? <User size={18} /> : <Zap size={18} />}
        </div>
        <div
          className={`rounded-lg px-4 py-2 max-w-[85%] ${
            message.isUser
              ? "bg-blue-50 text-blue-900"
              : message.systemLog
                ? "bg-green-50 text-green-800 border border-green-100"
                : "bg-purple-50 text-purple-900"
          }`}
        >
          <div className="whitespace-pre-wrap text-sm">{message.text}</div>
          <div className="text-xs mt-1 opacity-60">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    )];
  });

  const renderDataLog = () => {
    if (!activeSubtask) return null;
    const subData = subtaskData[activeSubtask.id];
    return (
      <JarvioDataLog
        result={subData?.result}
        completedAt={subData?.completedAt}
      />
    );
  };

  return (
    <div className="flex flex-col h-full relative">
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
            disabled={isTransitioning}
          >
            {autoRunPaused ? (
              <Play className="h-4 w-4" />
            ) : (
              <Pause className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <div className="px-4 py-3 border-b flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex justify-between items-center text-xs mb-2">
            <span className="font-medium">Task Progress</span>
            <span>{completedSubtasks} of {totalSubtasks} steps</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        <div className="mt-2 sm:mt-0 flex items-center gap-2">
          <Button
            variant={showDataLog ? "default" : "outline"}
            size="sm"
            className="text-xs h-8 px-3"
            onClick={() => setShowDataLog(val => !val)}
          >
            {showDataLog ? "Hide Data Log" : "Show Data Log"}
          </Button>
        </div>
      </div>

      <JarvioSubtaskHistory
        subtasks={subtasks}
        activeSubtaskIdx={activeSubtaskIdx}
        currentSubtaskIndex={currentSubtaskIndex}
        onSubtaskHistoryClick={handleSubtaskHistoryClick}
      />

      {showDataLog && (
        <div className="bg-white border-b px-4 py-3 fade-in-100">
          {renderDataLog()}
        </div>
      )}

      <ScrollArea className="flex-1 p-4 pb-0" style={{ height: "1px", minHeight: 0 }}>
        <div className="space-y-4 pr-2">
          {isTransitioning && (
            <div className="flex items-center justify-center p-4">
              <div className="text-center">
                <Loader2 size={24} className="animate-spin mx-auto mb-2 text-purple-600" />
                <p className="text-sm text-purple-800">Transitioning to next subtask...</p>
              </div>
            </div>
          )}

          {!isTransitioning && (
            <JarvioChatMessages
              messages={subtaskMessages}
              subtasks={subtasks}
              activeSubtaskIdx={activeSubtaskIdx}
            />
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
          {awaitingContinue && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-green-800">
                <Check size={18} className="text-green-600" />
                <p className="font-medium">Subtask complete!</p>
              </div>
              <p className="text-sm text-green-700">
                Review the results above and the collected data (see "Data Log" area).
              </p>
              
              {currentSubtaskIndex < subtasks.length - 1 && (
                <div className="bg-white border border-green-100 rounded p-2 mb-1">
                  <p className="text-xs font-medium text-green-700">Next subtask:</p>
                  <p className="text-sm flex items-center gap-1">
                    <ChevronRight size={14} className="text-green-500" />
                    {subtasks[currentSubtaskIndex + 1]?.title || "No more subtasks"}
                  </p>
                </div>
              )}
              
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
                    className="bg-green-600 hover:bg-green-700 flex items-center gap-1"
                    disabled={isTransitioning}
                  >
                    {currentSubtaskIndex < subtasks.length - 1 ? (
                      <>Continue to next step <ArrowRight size={14} /></>
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
      </ScrollArea>

      <form
        onSubmit={handleSendMessage}
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
