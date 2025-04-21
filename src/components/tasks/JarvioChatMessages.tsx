
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
  messages,
  subtasks,
  activeSubtaskIdx
}) => {
  const getStepNumber = (idx: number) => (subtasks ? idx + 1 : 1);
  const activeSubtask = subtasks[activeSubtaskIdx];

  const getSubtaskIntroMessage = (subtask: Subtask, idx: number) => {
    return (
      <div
        className="text-sm mb-2 flex flex-col"
        key={`step-intro-${subtask.id}`}
      >
        <span className="font-bold text-primary">{`Step ${getStepNumber(idx)}: ${subtask.title}`}</span>
        {subtask.description && (
          <span className="text-xs text-muted-foreground">{subtask.description}</span>
        )}
      </div>
    );
  };

  return (
    <>
      {messages.flatMap((message, i, arr) => {
        const isFirstInSubtask = i === 0;
        const stepIntro =
          isFirstInSubtask && activeSubtask
            ? [getSubtaskIntroMessage(activeSubtask, activeSubtaskIdx)]
            : [];
        return [
          ...stepIntro,
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.isUser ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isUser
                  ? "bg-blue-100 text-blue-700"
                  : message.systemLog
                  ? "bg-green-100 text-green-800"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {message.isUser ? <User size={18} /> : <Zap size={18} />}
            </div>
            <div
              className={`rounded-lg px-4 py-2 max-w-[85%] ${
                message.isUser
                  ? "bg-blue-50 text-blue-900"
                  : message.systemLog
                  ? "bg-green-50 text-green-800 border border-green-100"
                  : "bg-purple-50 text-purple-900"
              }`}
            >
              <div className="whitespace-pre-wrap text-sm">{message.text}</div>
              <div className="text-xs mt-1 opacity-60">
                {message.timestamp
                  ? new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : ""}
              </div>
            </div>
          </div>,
        ];
      })}
    </>
  );
};
