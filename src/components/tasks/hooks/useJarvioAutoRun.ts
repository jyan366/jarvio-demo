
import { useEffect, useRef } from "react";
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
  const lastProcessedStepRef = useRef<number>(-1);
  const isProcessingRef = useRef(false);

  useEffect(() => {
    const handleAutoRun = async () => {
      // Don't run if auto-run is disabled or paused
      if (!autoRunMode || autoRunPaused) {
        return;
      }
      
      // Don't run if we're viewing history or if operations are in progress
      if (historySubtaskIdx !== null && historySubtaskIdx !== currentSubtaskIndex) {
        return;
      }
      
      if (isLoading || isTransitioning || isProcessingRef.current) {
        return;
      }

      const currentSubtask = subtasks[currentSubtaskIndex];
      if (!currentSubtask) {
        return;
      }

      console.log("Auto-run checking:", {
        currentStep: currentSubtaskIndex,
        isDone: currentSubtask.done,
        lastProcessed: lastProcessedStepRef.current,
        totalSteps: subtasks.length
      });

      // If current step is completed and we haven't moved to the next step yet
      if (currentSubtask.done && currentSubtaskIndex < subtasks.length - 1) {
        if (lastProcessedStepRef.current !== currentSubtaskIndex) {
          console.log("Moving to next step from", currentSubtaskIndex, "to", currentSubtaskIndex + 1);
          
          lastProcessedStepRef.current = currentSubtaskIndex;
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
        }
        return;
      }

      // If current step is not completed and we haven't processed it yet
      if (!currentSubtask.done && lastProcessedStepRef.current < currentSubtaskIndex) {
        console.log("Executing step:", currentSubtaskIndex);
        
        isProcessingRef.current = true;
        lastProcessedStepRef.current = currentSubtaskIndex;
        
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
          // Complete the current step and wait for it to finish
          await onSubtaskComplete(currentSubtaskIndex);
          console.log("Step completed successfully:", currentSubtaskIndex);
          
        } catch (error) {
          console.error("Error in auto-run step execution:", error);
          setAutoRunPaused(true);
          
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
          isProcessingRef.current = false;
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
    
    // Add a small delay to allow for state updates and prevent rapid re-execution
    const timeoutId = setTimeout(handleAutoRun, 500);
    
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
    subtasks.map(s => s.done).join(','), // Watch completion status changes
    historySubtaskIdx
  ]);

  // Reset refs when auto-run mode changes
  useEffect(() => {
    if (!autoRunMode) {
      lastProcessedStepRef.current = -1;
      isProcessingRef.current = false;
    }
  }, [autoRunMode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoRunTimerRef.current) {
        clearTimeout(autoRunTimerRef.current);
      }
      isProcessingRef.current = false;
    };
  }, []);
}
