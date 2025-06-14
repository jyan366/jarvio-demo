
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

      console.log("Auto-run checking step:", currentSubtaskIndex, "done:", currentSubtask.done);

      // If current step is already completed, move to next step
      if (currentSubtask.done && currentSubtaskIndex < subtasks.length - 1) {
        console.log("Current step is done, moving to next step");
        setIsTransitioning(true);
        
        // Add message about moving to next step
        const nextSubtask = subtasks[currentSubtaskIndex + 1];
        if (nextSubtask) {
          setMessages(prev => [
            ...prev,
            {
              id: crypto.randomUUID(),
              isUser: false,
              text: `✅ Step ${currentSubtaskIndex + 1} completed! Moving to step ${currentSubtaskIndex + 2}: "${nextSubtask.title}"`,
              timestamp: new Date()
            }
          ]);
        }
        
        // Wait a moment then move to next step
        setTimeout(() => {
          onSubtaskSelect(currentSubtaskIndex + 1);
          setIsTransitioning(false);
        }, 1500);
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
        
        // Add AI message about starting the step
        setMessages(prev => [
          ...prev,
          {
            id: crypto.randomUUID(),
            isUser: false,
            text: `🔄 Executing step ${currentSubtaskIndex + 1}: "${currentSubtask.title}"`,
            timestamp: new Date()
          }
        ]);
        
        try {
          console.log("Executing step:", currentSubtaskIndex);
          
          // Complete the current step
          await onSubtaskComplete(currentSubtaskIndex);
          
          console.log("Step completed successfully:", currentSubtaskIndex);
          
        } catch (error) {
          console.error("Error in auto-run step execution:", error);
          setAutoRunPaused(true); // Pause on error
          
          setMessages(prev => [
            ...prev,
            {
              id: crypto.randomUUID(),
              isUser: false,
              text: `❌ Error executing step ${currentSubtaskIndex + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`,
              timestamp: new Date()
            }
          ]);
        } finally {
          autoRunStepInProgressRef.current = false;
        }
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
    
    // Add a small delay to allow for state updates
    const timeoutId = setTimeout(handleAutoRun, 100);
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
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
    subtasks, // Watch the entire subtasks array for changes
    historySubtaskIdx
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
