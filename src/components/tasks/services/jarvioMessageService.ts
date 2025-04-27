
import { supabase } from "@/integrations/supabase/client";
import { Message } from "../hooks/useJarvioAssistantLogic";
import { Subtask } from "@/pages/TaskWorkContainer";

export interface JarvioMessageResponse {
  reply: string;
  subtaskComplete: boolean;
  approvalNeeded: boolean;
  collectedData?: string | null;
  userWorkLog?: string | null;
}

export async function sendMessageToJarvio(
  message: string,
  taskTitle: string,
  taskDescription: string,
  subtasks: Subtask[],
  currentSubtaskIndex: number,
  conversationHistory: Message[],
  previousContext: string
): Promise<JarvioMessageResponse> {
  try {
    const subtaskContext = subtasks[currentSubtaskIndex];
    
    const response = await supabase.functions.invoke("jarvio-assistant", {
      body: {
        message,
        taskContext: {
          title: taskTitle,
          description: taskDescription
        },
        subtasks,
        currentSubtaskIndex,
        conversationHistory,
        previousContext
      }
    });

    if (response.error) throw response.error;

    return response.data;
  } catch (error) {
    console.error("Error sending message to Jarvio:", error);
    throw error;
  }
}

export function formatJarvioResponse(
  messageId: string, 
  reply: string, 
  currentSubtaskIndex: number
): Message {
  return {
    id: messageId || crypto.randomUUID(),
    isUser: false,
    text: reply,
    timestamp: new Date(),
    subtaskIdx: currentSubtaskIndex
  };
}

export function formatUserMessage(
  message: string, 
  currentSubtaskIndex: number
): Message {
  return {
    id: crypto.randomUUID(),
    isUser: true,
    text: message,
    timestamp: new Date(),
    subtaskIdx: currentSubtaskIndex
  };
}
