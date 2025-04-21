
import React from "react";
import { User, Zap } from "lucide-react";
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

  return (
    <div className="space-y-4">
      {messages.length === 0 && (
        <div className="text-center p-4 text-muted-foreground">
          <p>No messages yet</p>
        </div>
      )}
      {messages.map((message) => {
        // Get subtask title for this message, if subtaskIdx is set
        const subtaskTitle = typeof message.subtaskIdx === "number" && subtasks[message.subtaskIdx]
          ? subtasks[message.subtaskIdx].title
          : undefined;

        return (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.systemLog ? "opacity-70" : ""}`}
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
