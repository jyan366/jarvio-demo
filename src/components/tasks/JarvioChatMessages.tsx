
import React from "react";
import { User, Zap, CheckCircle, ArrowRight } from "lucide-react";
import { Subtask } from "@/pages/TaskWorkContainer";

interface Message {
  id: string;
  isUser: boolean;
  text: string;
  timestamp: Date;
  subtaskIdx?: number;
  systemLog?: boolean;
}

interface JarvioChatMessagesProps {
  messages: Message[];
  subtasks: Subtask[];
  activeSubtaskIdx: number;
}

export const JarvioChatMessages: React.FC<JarvioChatMessagesProps> = ({
  messages, subtasks, activeSubtaskIdx
}) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  /** Helper: extract subtask title from a "Step complete" or "Moving to next step" msg */
  const extractStepInfo = (msg: string) => {
    if (msg.startsWith("Step complete: \"")) {
      const extracted = msg.match(/^Step complete: "(.+?)"$/);
      return { type: "completed", title: extracted?.[1] };
    }
    if (msg.startsWith("Moving to next step: \"")) {
      const extracted = msg.match(/^Moving to next step: "(.+?)"$/);
      return { type: "next", title: extracted?.[1] };
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 && (
        <div className="text-center p-4 text-muted-foreground">
          <p>No messages yet</p>
        </div>
      )}
      {messages.map((message, idx) => {
        // Get subtask title for this message, if subtaskIdx is set
        const subtaskTitle = typeof message.subtaskIdx === "number" && subtasks[message.subtaskIdx]
          ? subtasks[message.subtaskIdx].title
          : undefined;

        // Enhanced: Render workflow "step transition" for system logs (completed/next step)
        if (message.systemLog) {
          const stepInfo = extractStepInfo(message.text);
          if (stepInfo) {
            return (
              <div key={message.id} className="flex flex-col items-center my-3">
                <div className="flex items-center w-full max-w-2xl">
                  <div className="flex-1 border-t border-dashed border-purple-200" />
                  <div className="flex flex-col items-center px-3">
                    {stepInfo.type === "completed" ? (
                      <>
                        <CheckCircle className="h-6 w-6 text-green-500 mb-1" />
                        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-2 shadow-sm text-xs font-semibold">
                          Completed: {stepInfo.title}
                        </div>
                      </>
                    ) : (
                      <>
                        <ArrowRight className="h-6 w-6 text-purple-600 mb-1" />
                        <div className="bg-purple-50 border border-purple-200 text-purple-800 rounded-lg px-4 py-2 shadow-sm text-xs font-semibold">
                          Next Step: {stepInfo.title}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex-1 border-t border-dashed border-purple-200" />
                </div>
              </div>
            );
          }
          // Fallback: Other system messages
          return (
            <div key={message.id} className="w-full flex justify-center">
              <div className="rounded-full bg-purple-100 text-purple-700 px-4 py-1 text-xs font-semibold my-2 shadow border border-purple-200 border-dashed">
                {message.text}
              </div>
            </div>
          );
        }

        // Regular (user or assistant) message
        return (
          <div
            key={message.id}
            className="flex items-start gap-3"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isUser
                  ? "bg-gray-100 text-gray-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {message.isUser ? <User size={18} /> : <Zap size={18} />}
            </div>
            <div
              className={`rounded-lg px-4 py-3 ${
                message.isUser
                  ? "bg-gray-50 border border-gray-200"
                  : "bg-purple-50"
              } max-w-3xl`}
            >
              {subtaskTitle && (
                <div className="text-[11px] font-semibold text-purple-700 mb-1">
                  {subtaskTitle}
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap">{message.text}</div>
              <div className="text-[10px] text-gray-400 mt-1 text-right">
                {formatTime(message.timestamp || new Date())}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
