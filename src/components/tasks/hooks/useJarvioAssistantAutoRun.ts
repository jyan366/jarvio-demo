
import { useEffect } from "react";
import { Message, SubtaskDataMap } from "./useJarvioAssistantLogic";
import { Subtask } from "@/pages/TaskWorkContainer";

interface UseJarvioAssistantAutoRunProps {
  autoRunMode: boolean;
  autoRunPaused: boolean;
  historySubtaskIdx: number | null;
  currentSubtaskIndex: number;
  isLoading: boolean;
  isTransitioning: boolean;
  readyForNextSubtask: boolean;
  subtasks: Subtask[];
  subtaskData: SubtaskDataMap;
  onSubtaskComplete: (idx: number) => Promise<void>;
  onSubtaskSelect: (idx: number) => void;
  setAutoRunPaused: (v: boolean) => void;
  setReadyForNextSubtask: (v: boolean) => void;
  autoRunTimerRef: React.MutableRefObject<number|undefined>;
  autoRunStepInProgressRef: React.MutableRefObject<boolean>;
  setIsTransitioning: (v: boolean) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function useJarvioAssistantAutoRun({
  autoRunMode,
  autoRunPaused,
  historySubtaskIdx,
  currentSubtaskIndex,
  isLoading,
  isTransitioning,
  readyForNextSubtask,
  subtasks,
  subtaskData,
  onSubtaskComplete,
  onSubtaskSelect,
  setAutoRunPaused,
  setReadyForNextSubtask,
  autoRunTimerRef,
  autoRunStepInProgressRef,
  setIsTransitioning,
  setMessages,
}: UseJarvioAssistantAutoRunProps) {
  useEffect(() => {
    const handleAutoRun = () => {
      if (!autoRunMode || autoRunPaused) return;
      if (historySubtaskIdx !== null && historySubtaskIdx !== currentSubtaskIndex) return;
      if (isLoading || isTransitioning) return;
      if (readyForNextSubtask && currentSubtaskIndex < subtasks.length - 1) {
        setAutoRunPaused(true);
        const moveToNextSubtask = async () => {
          setIsTransitioning(true);
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
          }, 1000);
        };
        moveToNextSubtask();
      } else if (!readyForNextSubtask && 
               !subtasks[currentSubtaskIndex]?.done && 
               !autoRunStepInProgressRef.current) {
        autoRunStepInProgressRef.current = true;
        autoRunTimerRef.current = window.setTimeout(() => {
          // We'll trigger the appropriate step logic via a callback.
          // The parent will pass in the function (for message sending etc).
          // This hook will wire only the timing/control.
          autoRunStepInProgressRef.current = false;
        }, 1500);
      }
    };
    handleAutoRun();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    autoRunMode, 
    autoRunPaused, 
    currentSubtaskIndex, 
    isLoading, 
    readyForNextSubtask, 
    subtasks, 
    historySubtaskIdx,
    isTransitioning
  ]);
}
