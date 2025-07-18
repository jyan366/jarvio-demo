
import { supabase } from "@/integrations/supabase/client";
import { Subtask } from "@/pages/TaskWorkContainer";
import { Message } from "../hooks/useJarvioAssistantLogic";

// Format a user message
export const formatUserMessage = (text: string, subtaskIdx?: number): Message => {
  return {
    id: crypto.randomUUID(),
    isUser: true,
    text,
    timestamp: new Date(),
    subtaskIdx
  };
};

// Format Jarvio's response
export const formatJarvioResponse = (id: string, text: string, subtaskIdx?: number): Message => {
  return {
    id,
    isUser: false,
    text,
    timestamp: new Date(),
    subtaskIdx
  };
};

// Format system log message
export const formatSystemMessage = (text: string, subtaskIdx?: number): Message => {
  return {
    id: crypto.randomUUID(),
    isUser: false,
    text,
    timestamp: new Date(),
    subtaskIdx,
    systemLog: true
  };
};

// Format flow action message
export const formatFlowActionMessage = (text: string, subtaskIdx?: number): Message => {
  return {
    id: crypto.randomUUID(),
    isUser: false,
    text,
    timestamp: new Date(),
    subtaskIdx,
    flowAction: true  // This needs to be added to the Message type
  };
};

// Send message to Jarvio assistant
export const sendMessageToJarvio = async (
  message: string,
  taskTitle: string,
  taskDescription: string,
  subtasks: Subtask[],
  currentSubtaskIndex: number,
  previousMessages: Message[],
  previousContext: string
) => {
  // Check if this is a flow-related task
  const isFlowTask = taskTitle.startsWith("Flow:") || taskDescription.includes("flowId:");
  
  // Handle special flow update messages
  if (message.startsWith('[FLOW_UPDATE]')) {
    const flowUpdateMessage = message.replace('[FLOW_UPDATE] ', '');
    return {
      reply: flowUpdateMessage,
      subtaskComplete: false,
      approvalNeeded: false,
      collectedData: null,
      isFlowUpdate: true
    };
  }
  
  // Handle flow action required messages
  if (message.startsWith('[FLOW_ACTION_REQUIRED]')) {
    const actionRequiredMessage = message.replace('[FLOW_ACTION_REQUIRED] ', '');
    return {
      reply: actionRequiredMessage,
      subtaskComplete: false,
      approvalNeeded: true, // This indicates the user needs to take action
      collectedData: null,
      isFlowAction: true
    };
  }
  
  // If flow task and message is about flow execution, handle it specially
  if (isFlowTask && (message.toLowerCase().includes("run flow") || message.toLowerCase().includes("execute flow"))) {
    // This is a request to execute the flow
    return {
      reply: "I'll help you run this flow. Let me prepare the flow execution environment...",
      subtaskComplete: false,
      approvalNeeded: false,
      collectedData: null
    };
  }

  // Filter to include only the current subtask conversation
  const conversationHistory = previousMessages.filter(
    msg => msg.subtaskIdx === currentSubtaskIndex || !msg.subtaskIdx
  );

  try {
    const response = await supabase.functions.invoke('jarvio-assistant', {
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
      },
    });

    if (!response.data) {
      throw new Error("No data received from assistant");
    }

    return {
      reply: response.data.reply,
      subtaskComplete: response.data.subtaskComplete,
      approvalNeeded: response.data.approvalNeeded,
      collectedData: response.data.collectedData
    };
  } catch (error) {
    console.error("Error sending message to Jarvio:", error);
    throw new Error("Failed to get response from assistant");
  }
};
