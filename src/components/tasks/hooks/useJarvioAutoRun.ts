
import { useEffect } from "react";
import { Message } from "./useJarvioAssistantLogic";
import { Subtask } from "@/pages/TaskWorkContainer";

interface UseJarvioAutoRunProps {
  autoRunMode: boolean;
  autoRunPaused: boolean;
  historySubtaskIdx: number | null;
  currentSubtaskIndex: number;
  isLoading: boolean;
  isTransitioning: boolean;
  readyForNextSubtask: boolean;
  subtasks: Subtask[];
  subtaskData: Record<string, any>;
  messages: Message[];
  onSubtaskComplete: (idx: number) => Promise<void>;
  onSubtaskSelect: (idx: number) => void;
  setAutoRunPaused: (v: boolean) => void;
  setReadyForNextSubtask: (v: boolean) => void;
  autoRunTimerRef: React.MutableRefObject<number | undefined>;
  autoRunStepInProgressRef: React.MutableRefObject<boolean>;
  setIsTransitioning: (v: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  handleSendMessage: (e?: React.FormEvent, autoMessage?: string) => Promise<void>;
}

export function useJarvioAutoRun({
  autoRunMode,
  autoRunPaused,
  historySubtaskIdx,
  currentSubtaskIndex,
  isLoading,
  isTransitioning,
  readyForNextSubtask,
  subtasks,
  subtaskData,
  messages,
  onSubtaskComplete,
  onSubtaskSelect,
  setAutoRunPaused,
  setReadyForNextSubtask,
  autoRunTimerRef,
  autoRunStepInProgressRef,
  setIsTransitioning,
  setMessages,
  handleSendMessage,
}: UseJarvioAutoRunProps) {
  useEffect(() => {
    const handleAutoRun = async () => {
      if (!autoRunMode || autoRunPaused) return;
      if (historySubtaskIdx !== null && historySubtaskIdx !== currentSubtaskIndex) return;
      if (isLoading || isTransitioning) return;
      
      if (readyForNextSubtask && currentSubtaskIndex < subtasks.length - 1) {
        // Handle transitioning to next subtask
        setAutoRunPaused(true);
        setIsTransitioning(true);
        
        try {
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
            setAutoRunPaused(false); // Resume auto-run
          }, 1000);
        } catch (error) {
          console.error("Error transitioning to next subtask:", error);
          setIsTransitioning(false);
          setAutoRunPaused(true); // Pause on error
        }
      } else if (!readyForNextSubtask && 
                !subtasks[currentSubtaskIndex]?.done && 
                !autoRunStepInProgressRef.current) {
        // Handle auto-run step processing
        autoRunStepInProgressRef.current = true;
        
        autoRunTimerRef.current = window.setTimeout(async () => {
          try {
            // Auto generate a message to continue the task
            const lastMessage = messages[messages.length - 1];
            
            // Only send a message if the last message was from the assistant
            if (!lastMessage?.isUser) {
              await handleSendMessage(undefined, "Continue");
            }
          } catch (error) {
            console.error("Error in auto-run step:", error);
          } finally {
            autoRunStepInProgressRef.current = false;
          }
        }, 1500);
      }
    };
    
    handleAutoRun();
    
    return () => {
      if (autoRunTimerRef.current) {
        clearTimeout(autoRunTimerRef.current);
      }
    };
    
  }, [
    autoRunMode, 
    autoRunPaused, 
    currentSubtaskIndex, 
    isLoading, 
    readyForNextSubtask, 
    subtasks, 
    historySubtaskIdx,
    isTransitioning,
    messages
  ]);
}
