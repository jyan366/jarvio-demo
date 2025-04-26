
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Subtask } from "@/pages/TaskWorkContainer";

export interface Message {
  id: string;
  isUser: boolean;
  text: string;
  timestamp: Date;
  subtaskIdx?: number;
  systemLog?: boolean;
}

export interface SubtaskData {
  result: string;
  completed: boolean;
  completedAt?: string;
}

export type SubtaskDataMap = {
  [subtaskId: string]: SubtaskData;
};

export function useJarvioAssistantLogic(
  taskId: string,
  taskTitle: string,
  taskDescription: string,
  subtasks: Subtask[],
  currentSubtaskIndex: number,
  onSubtaskComplete: (idx: number) => Promise<void>,
  onSubtaskSelect: (idx: number) => void
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoRunMode, setAutoRunMode] = useState(false);
  const [autoRunPaused, setAutoRunPaused] = useState(false);
  const [readyForNextSubtask, setReadyForNextSubtask] = useState(false);
  const [subtaskData, setSubtaskData] = useState<SubtaskDataMap>({});
  const [historySubtaskIdx, setHistorySubtaskIdx] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const autoRunTimerRef = useRef<number>();
  const autoRunStepInProgressRef = useRef(false);
  const { toast } = useToast();

  // Function to handle sending messages to Jarvio
  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    const userMessage = {
      id: crypto.randomUUID(),
      isUser: true,
      text: message,
      timestamp: new Date(),
      subtaskIdx: currentSubtaskIndex,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const subtaskContext = subtasks[currentSubtaskIndex];
      const response = await supabase.functions.invoke('jarvio-assistant', {
        body: {
          message,
          taskContext: {
            title: taskTitle,
            description: taskDescription
          },
          subtasks,
          currentSubtaskIndex,
          conversationHistory: messages,
          previousContext: getPreviousSubtasksContext()
        }
      });

      if (response.error) throw response.error;

      const { reply, subtaskComplete, approvalNeeded, collectedData } = response.data;

      // Add AI response
      const aiMessage = {
        id: crypto.randomUUID(),
        isUser: false,
        text: reply,
        timestamp: new Date(),
        subtaskIdx: currentSubtaskIndex,
      };

      setMessages(prev => [...prev, aiMessage]);

      // Handle collected data
      if (collectedData && subtaskContext) {
        await handleSaveSubtaskResult(subtaskContext.id, collectedData);
      }

      // Handle subtask completion
      if (subtaskComplete && !approvalNeeded) {
        setReadyForNextSubtask(true);
      }

    } catch (error) {
      console.error('Error in chat:', error);
      toast({
        title: "Error",
        description: "Failed to get response from assistant",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSubtaskResult = async (subtaskId: string, result: string) => {
    try {
      await supabase.functions.invoke('update-task-state', {
        body: {
          action: 'saveSubtaskResult',
          taskId,
          subtaskId,
          data: { result }
        }
      });

      setSubtaskData(prev => ({
        ...prev,
        [subtaskId]: {
          ...prev[subtaskId] || {},
          result,
          completed: true,
          completedAt: new Date().toISOString()
        }
      }));

      return true;
    } catch (err) {
      console.error("Failed to save subtask result:", err);
      return false;
    }
  };

  const getPreviousSubtasksContext = () => {
    if (!subtasks || subtasks.length === 0 || currentSubtaskIndex === 0) {
      return "";
    }

    let context = "";
    for (let i = 0; i < currentSubtaskIndex; i++) {
      const subtask = subtasks[i];
      if (subtask && subtaskData[subtask.id]) {
        context += `${subtask.title}: ${subtaskData[subtask.id].result}\n`;
      }
    }
    return context;
  };

  // Auto-run mode effect
  useEffect(() => {
    const runNextStep = () => {
      if (!autoRunMode || autoRunPaused || isTransitioning) return;
      if (readyForNextSubtask && currentSubtaskIndex < subtasks.length - 1) {
        setAutoRunPaused(true);
        const moveToNextSubtask = async () => {
          setIsTransitioning(true);
          await onSubtaskComplete(currentSubtaskIndex);
          onSubtaskSelect(currentSubtaskIndex + 1);
          setReadyForNextSubtask(false);
          setIsTransitioning(false);
          setAutoRunPaused(false);
        };
        moveToNextSubtask();
      } else if (!readyForNextSubtask && !autoRunStepInProgressRef.current) {
        autoRunStepInProgressRef.current = true;
        const currentSubtask = subtasks[currentSubtaskIndex];
        handleSendMessage(`Let's work on the subtask "${currentSubtask.title}". What's the first step?`);
        autoRunStepInProgressRef.current = false;
      }
    };

    const timer = setInterval(runNextStep, 2000);
    return () => clearInterval(timer);
  }, [autoRunMode, autoRunPaused, currentSubtaskIndex, readyForNextSubtask, subtasks, isTransitioning]);

  return {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isLoading,
    autoRunMode,
    setAutoRunMode,
    autoRunPaused,
    setAutoRunPaused,
    subtaskData,
    readyForNextSubtask,
    setReadyForNextSubtask,
    historySubtaskIdx,
    setHistorySubtaskIdx,
    isTransitioning,
    setIsTransitioning,
    handleSendMessage,
    handleSaveSubtaskResult,
    getPreviousSubtasksContext,
    subtasks,
    currentSubtaskIndex,
    taskId,
    taskTitle,
    taskDescription,
  };
}
