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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { JarvioChatTab } from "./JarvioChatTab";
import { JarvioDataLogTab } from "./JarvioDataLogTab";

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
  const [autoRunMode, setAutoRunMode] = useState(false);
  const [autoRunPaused, setAutoRunPaused] = useState(false);
  const [subtaskData, setSubtaskData] = useState<SubtaskDataMap>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [readyForNextSubtask, setReadyForNextSubtask] = useState(false);
  const [historySubtaskIdx, setHistorySubtaskIdx] = useState<number | null>(null);
  const [showDataLog, setShowDataLog] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoRunTimerRef = useRef<number | undefined>();
  const autoRunStepInProgressRef = useRef(false);
  const [justMarkedAsDone, setJustMarkedAsDone] = useState<number | null>(null);

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
    return () => {
      if (autoRunTimerRef.current) {
        window.clearTimeout(autoRunTimerRef.current);
        autoRunTimerRef.current = undefined;
      }
    };
  }, [
    autoRunMode, 
    autoRunPaused, 
    currentSubtaskIndex,
    subtasks
  ]);

  useEffect(() => {
    const handleAutoRun = () => {
      if (!autoRunMode || autoRunPaused) return;
      if (historySubtaskIdx !== null && historySubtaskIdx !== currentSubtaskIndex) return;
      if (isLoading || isTransitioning) return;
      if (readyForNextSubtask && currentSubtaskIndex < subtasks.length - 1) {
        setAutoRunPaused(true);
        toast({
          title: "Subtask completed",
          description: "Review the results and continue manually"
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
      } else if (!readyForNextSubtask && 
               !subtasks[currentSubtaskIndex]?.done && 
               !autoRunStepInProgressRef.current) {
        autoRunStepInProgressRef.current = true;
        autoRunTimerRef.current = window.setTimeout(() => {
          handleAutoRunStep();
          autoRunStepInProgressRef.current = false;
        }, 1500);
      }
    };
    handleAutoRun();
  }, [
    autoRunMode, 
    autoRunPaused, 
    currentSubtaskIndex, 
    isLoading, 
    readyForNextSubtask, 
    subtasks, 
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

  const activeSubtaskIdx = historySubtaskIdx !== null ? historySubtaskIdx : currentSubtaskIndex;
  const activeSubtask = subtasks?.[activeSubtaskIdx];

  const handleSaveSubtaskResult = async (subtaskId: string, result: string) => {
    if (!taskId) return false;
    
    try {
      console.log("Saving subtask result for:", subtaskId);
      
      await supabase.functions.invoke("update-task-state", {
        body: {
          action: 'saveSubtaskResult',
          taskId: taskId,
          subtaskId,
          data: {
            result
          }
        }
      });
      
      return true;
    } catch (err) {
      console.error("Failed to save subtask result:", err);
      return false;
    }
  };

  function isAwaitingUserConfirmation() {
    const last = messages[messages.length - 1];
    if (!last || last.isUser) return false;
    const txt = last.text.toLowerCase();
    return (
      txt.includes("please confirm") ||
      txt.includes("confirm") ||
      txt.includes("let me know") ||
      txt.includes("user work log") ||
      txt.includes("your confirmation") ||
      txt.includes("once you confirm") ||
      txt.includes("did you") ||
      txt.includes("tell me") ||
      txt.includes("waiting") ||
      txt.includes("waiting for your confirmation")
    );
  }

  function isUserConfirmationMessage(text: string) {
    const lower = text.toLowerCase().trim();
    return (
      ["confirmed", "done", "completed", "yes", "ok", "approved", "i did", "finished", "accepted"].some(keyword =>
        lower.startsWith(keyword)
      ) ||
      lower === "y"
    );
  }

  const handleSendMessage = async (e?: React.FormEvent, autoMessage?: string) => {
    e?.preventDefault();
    const messageToSend = autoMessage || inputValue;
    let conversation = messages;

    if ((!messageToSend.trim() && !autoMessage) || isLoading) return;

    if (isAwaitingUserConfirmation() && isUserConfirmationMessage(messageToSend)) {
      const subtaskId = subtasks[activeSubtaskIdx]?.id;
      if (subtaskId && subtaskData[subtaskId] && subtaskData[subtaskId].result) {
        let jarvioWorkLog = "";
        let userWorkLog = "";

        const result = subtaskData[subtaskId].result;

        const aiMatch = result.match(/COLLECTED DATA:\s*([\s\S]+?)(?=(USER WORK LOG:|$))/i);
        jarvioWorkLog = aiMatch?.[1]?.trim() || "";
        const userMatch = result.match(/USER WORK LOG:\s*([\s\S]+)/i);
        userWorkLog = userMatch?.[1]?.trim() || "";

        const newEntry = `User confirmed: ${messageToSend}`;
        if (userWorkLog) {
          userWorkLog = userWorkLog + "\n" + newEntry;
        } else {
          userWorkLog = newEntry;
        }

        let mergedResult = "";
        if (jarvioWorkLog) {
          mergedResult += `COLLECTED DATA:\n${jarvioWorkLog}`;
        }
        if (userWorkLog) {
          mergedResult += `\n\nUSER WORK LOG:\n${userWorkLog}`;
        }

        const completedData: SubtaskData = {
          ...subtaskData[subtaskId],
          result: mergedResult,
          completed: true,
          completedAt: subtaskData[subtaskId]?.completedAt || new Date().toISOString(),
        };
        setSubtaskData(prev => ({ ...prev, [subtaskId]: completedData }));

        if (subtaskId) {
          await handleSaveSubtaskResult(subtaskId, mergedResult);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            isUser: true,
            text: messageToSend,
            timestamp: new Date(),
            subtaskIdx: activeSubtaskIdx
          }
        ]);
        setInputValue("");

        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              isUser: false,
              text: "✅ Subtask complete! Please mark this subtask as done and select the next one to continue.",
              timestamp: new Date(),
              subtaskIdx: activeSubtaskIdx,
              systemLog: true,
            }
          ]);
        }, 600);

        return;
      }
    }

    const userMessage = {
      id: crypto.randomUUID(),
      isUser: true,
      text: messageToSend,
      timestamp: new Date(),
      subtaskIdx: activeSubtaskIdx
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

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
          currentSubtaskIndex: activeSubtaskIdx,
          previousContext,
          conversationHistory: conversation,
        },
      });

      if (error) throw new Error(error.message);

      if (data) {
        const { reply, subtaskComplete, collectedData, userWorkLog } = data;

        let workLogContent = "";
        
        if (collectedData) {
          workLogContent = `COLLECTED DATA:\n${collectedData}\n`;
        } else if (reply.match(/COLLECTED DATA:/i)) {
          const collectedDataMatch = reply.match(/COLLECTED DATA:\s*([\s\S]+?)(?=(\n\S|$))/i);
          if (collectedDataMatch && collectedDataMatch[1]) {
            workLogContent = `COLLECTED DATA:\n${collectedDataMatch[1].trim()}\n`;
          }
        }
        
        if (userWorkLog) {
          workLogContent += `\nUSER WORK LOG:\n${userWorkLog}`;
        } else if (reply.match(/USER WORK LOG:/i)) {
          const userWorkLogMatch = reply.match(/USER WORK LOG:\s*([\s\S]+?)(?=(\n\S|$))/i);
          if (userWorkLogMatch && userWorkLogMatch[1]) {
            workLogContent += `\nUSER WORK LOG:\n${userWorkLogMatch[1].trim()}`;
          }
        }
        
        if (!workLogContent && reply) {
          workLogContent = reply;
        }

        if (subtasks && activeSubtaskIdx < subtasks.length && workLogContent) {
          const currentSubtaskId = subtasks[activeSubtaskIdx].id;
          const existingData = subtaskData[currentSubtaskId] || { result: "", completed: false };
          const updatedData: SubtaskData = {
            ...existingData,
            result: workLogContent,
            completed: subtaskComplete || existingData.completed || false,
            completedAt: subtaskComplete && !existingData.completedAt
              ? new Date().toISOString()
              : existingData.completedAt
          };
          setSubtaskData(prev => ({
            ...prev,
            [currentSubtaskId]: updatedData
          }));
          if (currentSubtaskId) {
            await handleSaveSubtaskResult(currentSubtaskId, workLogContent);
          }
        }

        const assistantMessage = {
          id: crypto.randomUUID(),
          isUser: false,
          text: reply,
          timestamp: new Date(),
          subtaskIdx: activeSubtaskIdx
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (subtaskComplete) {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              isUser: false,
              text: "✅ Subtask complete! Please mark this subtask as done and select the next one to continue.",
              timestamp: new Date(),
              subtaskIdx: activeSubtaskIdx,
              systemLog: true,
            }
          ]);
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

  const handleAutoRunStep = () => {
    if (isLoading || isTransitioning) return;
    
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
      setAutoRunPaused(true);
    } else {
      setAutoRunPaused(false);
      if (autoRunTimerRef.current) {
        window.clearTimeout(autoRunTimerRef.current);
        autoRunTimerRef.current = undefined;
      }
      toast({
        title: "Auto-run deactivated",
        description: "Switched to manual mode"
      });
    }
  };

  const togglePause = () => {
    const newPausedState = !autoRunPaused;
    setAutoRunPaused(newPausedState);
    
    if (newPausedState && autoRunTimerRef.current) {
      window.clearTimeout(autoRunTimerRef.current);
      autoRunTimerRef.current = undefined;
    }
    
    toast({
      title: newPausedState ? "Auto-run paused" : "Auto-run resumed",
      description: newPausedState ? "Paused until you resume" : "Continuing with the process"
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
      if (autoRunTimerRef.current) {
        window.clearTimeout(autoRunTimerRef.current);
        autoRunTimerRef.current = undefined;
      }
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

  const [tab, setTab] = React.useState<"chat" | "datalog">("chat");

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
      </div>

      <JarvioSubtaskHistory
        subtasks={subtasks}
        activeSubtaskIdx={activeSubtaskIdx}
        currentSubtaskIndex={currentSubtaskIndex}
        onSubtaskHistoryClick={handleSubtaskHistoryClick}
      />

      <Tabs value={tab} onValueChange={v => setTab(v as "chat" | "datalog")} className="w-full flex-1 flex flex-col overflow-hidden">
        <TabsList className="bg-transparent border-b mb-0 px-4">
          <TabsTrigger value="chat" className="text-base px-4 py-2 rounded-none border-b-2 data-[state=active]:border-[#3527A0]">
            Chat
          </TabsTrigger>
          <TabsTrigger value="datalog" className="text-base px-4 py-2 rounded-none border-b-2 data-[state=active]:border-[#3527A0]">
            Work Log
          </TabsTrigger>
        </TabsList>
        <TabsContent value="chat" className="flex-1 overflow-hidden m-0 p-0 h-full border-0">
          <JarvioChatTab
            messages={messages}
            subtasks={subtasks}
            activeSubtaskIdx={activeSubtaskIdx}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isLoading={isLoading}
            autoRunMode={autoRunMode}
            autoRunPaused={autoRunPaused}
            isTransitioning={isTransitioning}
            onSendMessage={handleSendMessage}
          />
        </TabsContent>
        <TabsContent value="datalog" className="flex-1 overflow-auto p-0">
          <JarvioDataLogTab
            subtasks={subtasks}
            subtaskData={subtaskData}
            activeSubtaskIdx={activeSubtaskIdx}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
