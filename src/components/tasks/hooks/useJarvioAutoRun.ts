
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
      // Don't run if auto-run is disabled or paused
      if (!autoRunMode || autoRunPaused) return;
      
      // Don't run if we're viewing history or if operations are in progress
      if (historySubtaskIdx !== null && historySubtaskIdx !== currentSubtaskIndex) return;
      if (isLoading || isTransitioning || autoRunStepInProgressRef.current) return;

      const currentSubtask = subtasks[currentSubtaskIndex];
      if (!currentSubtask) return;

      // If current step is already completed, move to next step
      if (currentSubtask.done && currentSubtaskIndex < subtasks.length - 1) {
        console.log("Current step is done, moving to next step");
        setIsTransitioning(true);
        
        setTimeout(() => {
          onSubtaskSelect(currentSubtaskIndex + 1);
          setIsTransitioning(false);
          
          // Add message about moving to next step
          const nextSubtask = subtasks[currentSubtaskIndex + 1];
          if (nextSubtask) {
            setMessages(prev => [
              ...prev,
              {
                id: crypto.randomUUID(),
                isUser: false,
                text: `Moving to next step: "${nextSubtask.title}"`,
                timestamp: new Date()
              }
            ]);
          }
        }, 1000);
        return;
      }

      // If current step is not completed and we're not already processing it
      if (!currentSubtask.done && !autoRunStepInProgressRef.current) {
        console.log("Starting auto-run for step:", currentSubtaskIndex);
        autoRunStepInProgressRef.current = true;
        
        // Clear any existing timer
        if (autoRunTimerRef.current) {
          clearTimeout(autoRunTimerRef.current);
        }
        
        autoRunTimerRef.current = window.setTimeout(async () => {
          try {
            console.log("Executing step:", currentSubtaskIndex);
            
            // Add AI message about starting the step
            setMessages(prev => [
              ...prev,
              {
                id: crypto.randomUUID(),
                isUser: false,
                text: `Executing step: "${currentSubtask.title}"`,
                timestamp: new Date()
              }
            ]);
            
            // Complete the current step
            await onSubtaskComplete(currentSubtaskIndex);
            
            // Add completion message
            setMessages(prev => [
              ...prev,
              {
                id: crypto.randomUUID(),
                isUser: false,
                text: `Completed step: "${currentSubtask.title}"`,
                timestamp: new Date()
              }
            ]);
            
          } catch (error) {
            console.error("Error in auto-run step execution:", error);
            setAutoRunPaused(true); // Pause on error
          } finally {
            autoRunStepInProgressRef.current = false;
          }
        }, 2000); // 2 second delay between steps
      }

      // If we've completed all steps
      if (currentSubtaskIndex >= subtasks.length - 1 && currentSubtask?.done) {
        console.log("All steps completed, stopping auto-run");
        setAutoRunPaused(true);
        setMessages(prev => [
          ...prev,
          {
            id: crypto.randomUUID(),
            isUser: false,
            text: "🎉 Auto-run completed! All steps have been executed successfully.",
            timestamp: new Date()
          }
        ]);
      }
    };
    
    handleAutoRun();
    
    // Cleanup function
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
    isTransitioning,
    subtasks,
    historySubtaskIdx,
    messages.length // Track messages to trigger re-evaluation
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoRunTimerRef.current) {
        clearTimeout(autoRunTimerRef.current);
      }
    };
  }, []);
}
