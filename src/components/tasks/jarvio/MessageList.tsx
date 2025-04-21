
import React from "react";
import { Zap, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Message } from "../../tasks/JarvioAssistant";

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  pendingApproval: boolean;
  awaitingContinue: boolean;
  refBottom: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  isLoading,
  pendingApproval,
  awaitingContinue,
  refBottom,
}) => (
  <div className="space-y-4 pr-2">
    {messages.map((message) => (
      <div
        key={message.id}
        className={`flex items-start gap-3 ${
          message.isUser ? "flex-row-reverse" : ""
        }`}
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
            {message.timestamp instanceof Date
              ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : ""}
          </div>
        </div>
      </div>
    ))}
    {isLoading && (
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
          <Zap size={18} />
        </div>
        <div className="rounded-lg px-4 py-3 bg-purple-50">
          <div className="flex items-center gap-3">
            <Skeleton className="h-2 w-[190px]" />
            <Skeleton className="h-2 w-[160px]" />
          </div>
        </div>
      </div>
    )}
    <div ref={refBottom} />
  </div>
);
