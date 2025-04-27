
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Subtask } from "@/pages/TaskWorkContainer";
import { sendMessageToJarvio, formatUserMessage, formatJarvioResponse } from "../services/jarvioMessageService";

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
  // State management
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoRunMode, setAutoRunMode] = useState(false);
  const [autoRunPaused, setAutoRunPaused] = useState(false);
  const [readyForNextSubtask, setReadyForNextSubtask] = useState(false);
  const [subtaskData, setSubtaskData] = useState<SubtaskDataMap>({});
  const [historySubtaskIdx, setHistorySubtaskIdx] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // References for auto-run functionality
  const autoRunTimerRef = useRef<number>();
  const autoRunStepInProgressRef = useRef(false);
  const { toast } = useToast();

  // Function to handle sending messages to Jarvio
  const handleSendMessage = async (e?: React.FormEvent, autoMessage?: string) => {
    e?.preventDefault();
    
    const messageToSend = autoMessage || inputValue;
    if (!messageToSend.trim() || isLoading) return;

    // Create and add user message
    const userMessage = formatUserMessage(messageToSend, currentSubtaskIndex);
    setMessages(prev => [...prev, userMessage]);
    
    setInputValue("");
    setIsLoading(true);

    try {
      // Send message to Jarvio and get response
      const { reply, subtaskComplete, approvalNeeded, collectedData } = 
        await sendMessageToJarvio(
          messageToSend,
          taskTitle,
          taskDescription,
          subtasks,
          currentSubtaskIndex,
          messages,
          getPreviousSubtasksContext()
        );

      // Add AI response
      const aiMessage = formatJarvioResponse(crypto.randomUUID(), reply, currentSubtaskIndex);
      setMessages(prev => [...prev, aiMessage]);

      // Handle collected data
      if (collectedData && subtasks[currentSubtaskIndex]) {
        await handleSaveSubtaskResult(subtasks[currentSubtaskIndex].id, collectedData);
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

  // Handle saving subtask results
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

  // Get context from previous subtasks
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
    toast,
    autoRunTimerRef,
    autoRunStepInProgressRef,
  };
}
