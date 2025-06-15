
import { useEffect, useCallback } from 'react';
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
  messages: any[];
  onSubtaskComplete: (idx: number) => Promise<void>;
  onSubtaskSelect: (idx: number) => void;
  setAutoRunPaused: (paused: boolean) => void;
  setReadyForNextSubtask: (ready: boolean) => void;
  autoRunTimerRef: React.MutableRefObject<number | undefined>;
  autoRunStepInProgressRef: React.MutableRefObject<boolean>;
  setIsTransitioning: (transitioning: boolean) => void;
  setMessages: (messages: any[]) => void;
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
  handleSendMessage
}: UseJarvioAutoRunProps) {

  // Handle automatic step execution when ready for next subtask
  const handleAutoStepExecution = useCallback(async () => {
    if (!autoRunMode || autoRunPaused || isLoading || autoRunStepInProgressRef.current) {
      return;
    }

    const currentSubtask = subtasks[currentSubtaskIndex];
    if (!currentSubtask || currentSubtask.done) {
      return;
    }

    try {
      autoRunStepInProgressRef.current = true;
      console.log(`Auto-executing step ${currentSubtaskIndex + 1}: ${currentSubtask.title}`);
      
      // Send "Start" message to trigger step execution
      await handleSendMessage(undefined, "Start");
      
    } catch (error) {
      console.error("Error in auto step execution:", error);
    } finally {
      autoRunStepInProgressRef.current = false;
    }
  }, [autoRunMode, autoRunPaused, isLoading, currentSubtaskIndex, subtasks, handleSendMessage]);

  // Handle transitions to next subtask
  const handleSubtaskTransition = useCallback(async () => {
    if (!readyForNextSubtask || isTransitioning || historySubtaskIdx !== null) {
      return;
    }

    const nextIndex = currentSubtaskIndex + 1;
    
    if (nextIndex < subtasks.length) {
      setIsTransitioning(true);
      setReadyForNextSubtask(false);
      
      console.log(`Transitioning to subtask ${nextIndex + 1}`);
      
      // Move to next subtask
      onSubtaskSelect(nextIndex);
      
      // Brief delay then continue auto-run
      setTimeout(() => {
        setIsTransitioning(false);
        if (autoRunMode && !autoRunPaused) {
          // Trigger next step execution
          autoRunTimerRef.current = window.setTimeout(() => {
            handleAutoStepExecution();
          }, 1000);
        }
      }, 500);
    } else {
      // All subtasks completed
      setAutoRunPaused(true);
      setReadyForNextSubtask(false);
      console.log("All subtasks completed!");
    }
  }, [readyForNextSubtask, isTransitioning, historySubtaskIdx, currentSubtaskIndex, subtasks, setIsTransitioning, setReadyForNextSubtask, onSubtaskSelect, autoRunMode, autoRunPaused, autoRunTimerRef, handleAutoStepExecution]);

  // Main auto-run effect
  useEffect(() => {
    if (readyForNextSubtask && !isTransitioning && historySubtaskIdx === null) {
      handleSubtaskTransition();
    }
  }, [readyForNextSubtask, isTransitioning, historySubtaskIdx, handleSubtaskTransition]);

  // Auto-execute current step when auto-run starts
  useEffect(() => {
    if (autoRunMode && !autoRunPaused && !isLoading && !isTransitioning && historySubtaskIdx === null) {
      const currentSubtask = subtasks[currentSubtaskIndex];
      if (currentSubtask && !currentSubtask.done && !autoRunStepInProgressRef.current) {
        autoRunTimerRef.current = window.setTimeout(() => {
          handleAutoStepExecution();
        }, 1000);
      }
    }

    return () => {
      if (autoRunTimerRef.current) {
        clearTimeout(autoRunTimerRef.current);
      }
    };
  }, [autoRunMode, autoRunPaused, isLoading, isTransitioning, historySubtaskIdx, currentSubtaskIndex, subtasks, handleAutoStepExecution]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoRunTimerRef.current) {
        clearTimeout(autoRunTimerRef.current);
      }
    };
  }, []);
}
