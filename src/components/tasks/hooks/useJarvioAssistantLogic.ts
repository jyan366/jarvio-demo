
import { useState, useEffect, useCallback, useRef } from 'react';
import { Subtask } from "@/pages/TaskWorkContainer";
import { formatUserMessage, formatJarvioResponse, formatSystemMessage, sendMessageToJarvio } from '../services/jarvioMessageService';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  subtaskIdx?: number;
  systemLog?: boolean;
  flowAction?: boolean;  // Added this property to fix the type error
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
  const [messages, setMessages] = useState<Message[]>(() => {
    // Add initial welcome message
    if (subtasks && subtasks.length > 0) {
      return [{
        id: crypto.randomUUID(),
        isUser: false,
        text: `Hello! I'm Jarvio, your AI assistant. I'm here to help you with "${taskTitle}". How can I help you with the current subtask: "${subtasks[currentSubtaskIndex]?.title || 'this task'}"?`,
        timestamp: new Date(),
        subtaskIdx: currentSubtaskIndex
      }];
    }
    return [{
      id: crypto.randomUUID(),
      isUser: false,
      text: `Hello! I'm Jarvio, your AI assistant. I'm here to help you with "${taskTitle}". How can I help you?`,
      timestamp: new Date()
    }];
  });
  
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

  // Get context from previous subtasks
  const getPreviousSubtasksContext = useCallback(() => {
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
  }, [subtasks, currentSubtaskIndex, subtaskData]);

  // Handle saving subtask results
  const handleSaveSubtaskResult = useCallback(async (subtaskId: string, result: string) => {
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
  }, [taskId]);

  // Function to handle sending messages to Jarvio
  const handleSendMessage = useCallback(async (e?: React.FormEvent, autoMessage?: string) => {
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
  }, [messages, inputValue, isLoading, currentSubtaskIndex, taskTitle, taskDescription, subtasks, getPreviousSubtasksContext, handleSaveSubtaskResult, toast]);

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
