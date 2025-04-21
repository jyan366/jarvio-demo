
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
  // State is exactly as before
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [autoRunMode, setAutoRunMode] = useState(false);
  const [autoRunPaused, setAutoRunPaused] = useState(false);
  const [subtaskData, setSubtaskData] = useState<SubtaskDataMap>({});
  const [readyForNextSubtask, setReadyForNextSubtask] = useState(false);
  const [historySubtaskIdx, setHistorySubtaskIdx] = useState<number | null>(null);
  const [showDataLog, setShowDataLog] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoRunTimerRef = useRef<number | undefined>();
  const autoRunStepInProgressRef = useRef(false);
  const [justMarkedAsDone, setJustMarkedAsDone] = useState<number | null>(null);

  // Toast hook
  const { toast } = useToast();

  // All UI helpers, effects, and handlers are moved in here.

  // Boot up initial system message
  useEffect(() => {
    if (messages.length === 0 && subtasks && subtasks.length > 0) {
      const currentSubtask = subtasks[currentSubtaskIndex];
      if (currentSubtask) {
        setMessages([
          {
            id: crypto.randomUUID(),
            isUser: false,
            text: `Hi! I'm Jarvio, your Amazon brand seller assistant. I'm here to help you complete your task "${taskTitle}". Let's work on the current subtask: "${currentSubtask.title}". How can I help you get started?`,
            timestamp: new Date(),
            subtaskIdx: currentSubtaskIndex
          }
        ]);
      }
    }
    // Only run on initial
    // eslint-disable-next-line
  }, [currentSubtaskIndex, subtasks, messages.length, taskTitle]);

  const getPreviousSubtasksContext = () => {
    if (!subtasks || subtasks.length === 0 || currentSubtaskIndex === 0) {
      return "";
    }
    let context = "Previous subtasks data:\n";
    for (let i = 0; i < currentSubtaskIndex; i++) {
      const subtask = subtasks[i];
      if (subtask && subtaskData[subtask.id]) {
        context += `- ${subtask.title}: ${subtaskData[subtask.id].result}\n`;
      }
    }
    return context;
  };

  // All auto-run, handlers, messaging and others are to be imported from other hooks.
  // The rest of the state and return structure stays the same.

  return {
    messages,
    setMessages,
    inputValue,
    setInputValue,
    isLoading,
    setIsLoading,
    autoRunMode,
    setAutoRunMode,
    autoRunPaused,
    setAutoRunPaused,
    subtaskData,
    setSubtaskData,
    readyForNextSubtask,
    setReadyForNextSubtask,
    historySubtaskIdx,
    setHistorySubtaskIdx,
    showDataLog,
    setShowDataLog,
    isTransitioning,
    setIsTransitioning,
    autoRunTimerRef,
    autoRunStepInProgressRef,
    justMarkedAsDone,
    setJustMarkedAsDone,
    toast,
    getPreviousSubtasksContext,
    // Pass through props:
    subtasks,
    currentSubtaskIndex,
    onSubtaskComplete,
    onSubtaskSelect,
    taskId,
    taskTitle,
    taskDescription,
  }
}
