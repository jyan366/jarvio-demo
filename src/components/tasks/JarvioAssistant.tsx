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
import { useJarvioAssistantLogic, Message } from "./hooks/useJarvioAssistantLogic";
import { useJarvioAssistantAutoRun } from "./hooks/useJarvioAssistantAutoRun";
import { isAwaitingUserConfirmation, isUserConfirmationMessage } from "./hooks/useJarvioMessageUtils";
import { useJarvioAssistantTabs } from "./hooks/useJarvioAssistantTabs";

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
  // Main logic state
  const logic = useJarvioAssistantLogic(taskId, taskTitle, taskDescription, subtasks, currentSubtaskIndex, onSubtaskComplete, onSubtaskSelect);
  const { tab, setTab } = useJarvioAssistantTabs();

  // Plug auto-run for step pipeline behavior
  useJarvioAssistantAutoRun({
    autoRunMode: logic.autoRunMode,
    autoRunPaused: logic.autoRunPaused,
    historySubtaskIdx: logic.historySubtaskIdx,
    currentSubtaskIndex: logic.currentSubtaskIndex,
    isLoading: logic.isLoading,
    isTransitioning: logic.isTransitioning,
    readyForNextSubtask: logic.readyForNextSubtask,
    subtasks: logic.subtasks,
    subtaskData: logic.subtaskData,
    onSubtaskComplete: logic.onSubtaskComplete,
    onSubtaskSelect: logic.onSubtaskSelect,
    setAutoRunPaused: logic.setAutoRunPaused,
    setReadyForNextSubtask: logic.setReadyForNextSubtask,
    autoRunTimerRef: logic.autoRunTimerRef,
    autoRunStepInProgressRef: logic.autoRunStepInProgressRef,
    setIsTransitioning: logic.setIsTransitioning,
    setMessages: logic.setMessages,
  });

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

  const handleSendMessage = async (e?: React.FormEvent, autoMessage?: string) => {
    e?.preventDefault();
    const messageToSend = autoMessage || logic.inputValue;
    let conversation = logic.messages;

    if ((!messageToSend.trim() && !autoMessage) || logic.isLoading) return;

    if (isAwaitingUserConfirmation(logic.messages) && isUserConfirmationMessage(messageToSend)) {
      const subtaskId = subtasks[logic.historySubtaskIdx !== null ? logic.historySubtaskIdx : currentSubtaskIndex]?.id;
      if (subtaskId && logic.subtaskData[subtaskId] && logic.subtaskData[subtaskId].result) {
        let jarvioWorkLog = "";
        let userWorkLog = "";

        const result = logic.subtaskData[subtaskId].result;

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
          ...logic.subtaskData[subtaskId],
          result: mergedResult,
          completed: true,
          completedAt: logic.subtaskData[subtaskId]?.completedAt || new Date().toISOString(),
        };
        logic.setSubtaskData(prev => ({ ...prev, [subtaskId]: completedData }));

        if (subtaskId) {
          await handleSaveSubtaskResult(subtaskId, mergedResult);
        }

        logic.setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            isUser: true,
            text: messageToSend,
            timestamp: new Date(),
            subtaskIdx: logic.historySubtaskIdx !== null ? logic.historySubtaskIdx : currentSubtaskIndex
          }
        ]);
        logic.setInputValue("");

        setTimeout(() => {
          logic.setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              isUser: false,
              text: "✅ Subtask complete! Please mark this subtask as done and select the next one to continue.",
              timestamp: new Date(),
              subtaskIdx: logic.historySubtaskIdx !== null ? logic.historySubtaskIdx : currentSubtaskIndex,
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
      subtaskIdx: logic.historySubtaskIdx !== null ? logic.historySubtaskIdx : currentSubtaskIndex
    };

    logic.setMessages((prev) => [...prev, userMessage]);
    logic.setInputValue("");
    logic.setIsLoading(true);

    try {
      const previousContext = logic.getPreviousSubtasksContext();

      const { data, error } = await supabase.functions.invoke("jarvio-assistant", {
        body: {
          message: messageToSend,
          taskContext: {
            id: taskId,
            title: taskTitle,
            description: taskDescription,
          },
          subtasks: subtasks || [],
          currentSubtaskIndex: logic.historySubtaskIdx !== null ? logic.historySubtaskIdx : currentSubtaskIndex,
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

        if (subtasks && (logic.historySubtaskIdx !== null ? logic.historySubtaskIdx : currentSubtaskIndex) < subtasks.length && workLogContent) {
          const currentSubtaskId = subtasks[logic.historySubtaskIdx !== null ? logic.historySubtaskIdx : currentSubtaskIndex].id;
          const existingData = logic.subtaskData[currentSubtaskId] || { result: "", completed: false };
          const updatedData: SubtaskData = {
            ...existingData,
            result: workLogContent,
            completed: subtaskComplete || existingData.completed || false,
            completedAt: subtaskComplete && !existingData.completedAt
              ? new Date().toISOString()
              : existingData.completedAt
          };
          logic.setSubtaskData(prev => ({
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
          subtaskIdx: logic.historySubtaskIdx !== null ? logic.historySubtaskIdx : currentSubtaskIndex
        };

        logic.setMessages((prev) => [...prev, assistantMessage]);

        if (subtaskComplete) {
          logic.setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              isUser: false,
              text: "✅ Subtask complete! Please mark this subtask as done and select the next one to continue.",
              timestamp: new Date(),
              subtaskIdx: logic.historySubtaskIdx !== null ? logic.historySubtaskIdx : currentSubtaskIndex,
              systemLog: true,
            }
          ]);
        }
      }
    } catch (error) {
      console.error("Error calling Jarvio:", error);
      logic.toast({
        title: "Error",
        description: "Failed to get response from assistant",
        variant: "destructive",
      });

      logic.setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          isUser: false,
          text: "Sorry, I encountered an error while processing your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
      
      if (logic.autoRunMode) {
        logic.setAutoRunPaused(true);
        logic.toast({
          title: "Auto-run paused",
          description: "An error occurred"
        });
      }
      logic.setIsLoading(false);
      return;
    }
    logic.setIsLoading(false);
  };

  const handleAutoRunStep = () => {
    if (logic.isLoading || logic.isTransitioning) return;
    
    const currentSubtask = subtasks?.[currentSubtaskIndex];
    if (!currentSubtask) return;
    
    const autoMessage = `Please help me complete the subtask "${currentSubtask.title}". ${currentSubtask.description ? `Details: ${currentSubtask.description}` : ''} Please proceed automatically and collect the necessary data.`;
    
    logic.setMessages(prev => [
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
    const newAutoRunState = !logic.autoRunMode;
    logic.setAutoRunMode(newAutoRunState);
    
    if (newAutoRunState) {
      logic.toast({
        title: "Auto-run activated",
        description: "Click play to start automatic processing"
      });
      logic.setAutoRunPaused(true);
    } else {
      logic.setAutoRunPaused(false);
      if (logic.autoRunTimerRef.current) {
        window.clearTimeout(logic.autoRunTimerRef.current);
        logic.autoRunTimerRef.current = undefined;
      }
      logic.toast({
        title: "Auto-run deactivated",
        description: "Switched to manual mode"
      });
    }
  };

  const togglePause = () => {
    const newPausedState = !logic.autoRunPaused;
    logic.setAutoRunPaused(newPausedState);
    
    if (newPausedState && logic.autoRunTimerRef.current) {
      window.clearTimeout(logic.autoRunTimerRef.current);
      logic.autoRunTimerRef.current = undefined;
    }
    
    logic.toast({
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
    if (logic.autoRunMode && !logic.autoRunPaused) {
      logic.setAutoRunPaused(true);
      if (logic.autoRunTimerRef.current) {
        window.clearTimeout(logic.autoRunTimerRef.current);
        logic.autoRunTimerRef.current = undefined;
      }
      logic.toast({
        title: "Auto-run paused",
        description: "Navigated to a different subtask. Click play to resume."
      });
    }
    if (subtasks[index] && (index < currentSubtaskIndex || subtasks[index].done || index === currentSubtaskIndex)) {
      logic.setHistorySubtaskIdx(index);
      onSubtaskSelect(index);
    }
  };

  useEffect(() => {
    logic.setHistorySubtaskIdx(null);
  }, [currentSubtaskIndex]);

  const activeSubtaskIdx = logic.historySubtaskIdx !== null ? logic.historySubtaskIdx : currentSubtaskIndex;

  return (
    <div className="flex flex-col h-full relative">
      <div className="px-4 py-2 border-b flex items-center justify-between bg-purple-50">
        <div className="flex items-center gap-2">
          <Switch
            checked={logic.autoRunMode}
            onCheckedChange={toggleAutoRun}
            id="auto-run"
          />
          <label htmlFor="auto-run" className="text-sm font-medium">
            Auto-run
          </label>
        </div>
        {logic.autoRunMode && (
          <Button
            size="sm"
            variant="outline"
            className="h-8 px-2"
            onClick={togglePause}
            disabled={logic.isTransitioning}
          >
            {logic.autoRunPaused ? (
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
            messages={logic.messages}
            subtasks={subtasks}
            activeSubtaskIdx={activeSubtaskIdx}
            inputValue={logic.inputValue}
            setInputValue={logic.setInputValue}
            isLoading={logic.isLoading}
            autoRunMode={logic.autoRunMode}
            autoRunPaused={logic.autoRunPaused}
            isTransitioning={logic.isTransitioning}
            onSendMessage={handleSendMessage}
          />
        </TabsContent>
        <TabsContent value="datalog" className="flex-1 overflow-auto p-0">
          <JarvioDataLogTab
            subtasks={subtasks}
            subtaskData={logic.subtaskData}
            activeSubtaskIdx={activeSubtaskIdx}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
