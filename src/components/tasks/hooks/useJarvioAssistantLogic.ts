
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
  flowAction?: boolean;
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
  // State management - use useRef to persist messages across re-renders
  const messagesRef = useRef<Message[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoRunMode, setAutoRunMode] = useState(false);
  const [autoRunPaused, setAutoRunPaused] = useState(false);
  const [readyForNextSubtask, setReadyForNextSubtask] = useState(false);
  const [subtaskData, setSubtaskData] = useState<SubtaskDataMap>({});
  const [historySubtaskIdx, setHistorySubtaskIdx] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [initializedRef, setInitializedRef] = useState(false);
  
  // References for auto-run functionality
  const autoRunTimerRef = useRef<number>();
  const autoRunStepInProgressRef = useRef(false);
  const { toast } = useToast();

  // Initialize messages only once
  useEffect(() => {
    if (!initializedRef && subtasks && subtasks.length > 0) {
      const initialMessage = {
        id: crypto.randomUUID(),
        isUser: false,
        text: `Hello! I'm Jarvio, your AI assistant. I'm here to help you with "${taskTitle}". How can I help you with the current subtask: "${subtasks[currentSubtaskIndex]?.title || 'this task'}"?`,
        timestamp: new Date(),
        subtaskIdx: currentSubtaskIndex
      };
      
      messagesRef.current = [initialMessage];
      setMessages([initialMessage]);
      setInitializedRef(true);
    }
  }, [subtasks, taskTitle, currentSubtaskIndex, initializedRef]);

  // Update messages state when messagesRef changes
  const updateMessages = useCallback((newMessages: Message[]) => {
    messagesRef.current = newMessages;
    setMessages([...newMessages]);
  }, []);

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
    const currentMessages = [...messagesRef.current, userMessage];
    updateMessages(currentMessages);
    
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
          messagesRef.current,
          getPreviousSubtasksContext()
        );

      // Add AI response
      const aiMessage = formatJarvioResponse(crypto.randomUUID(), reply, currentSubtaskIndex);
      const updatedMessages = [...currentMessages, aiMessage];
      updateMessages(updatedMessages);

      // Handle collected data
      if (collectedData && subtasks[currentSubtaskIndex]) {
        await handleSaveSubtaskResult(subtasks[currentSubtaskIndex].id, collectedData);
      }

      // Handle subtask completion
      if (subtaskComplete && !approvalNeeded) {
        // Mark step as complete and add transition message
        await onSubtaskComplete(currentSubtaskIndex);
        
        // Add system message about step completion
        const systemMessage = formatSystemMessage(
          `Step ${currentSubtaskIndex + 1} completed. ${currentSubtaskIndex + 1 < subtasks.length ? 'Moving to next step...' : 'All steps completed!'}`,
          currentSubtaskIndex
        );
        const finalMessages = [...updatedMessages, systemMessage];
        updateMessages(finalMessages);
        
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
  }, [inputValue, isLoading, currentSubtaskIndex, taskTitle, taskDescription, subtasks, getPreviousSubtasksContext, handleSaveSubtaskResult, toast, onSubtaskComplete, updateMessages]);

  return {
    messages,
    setMessages: updateMessages,
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
