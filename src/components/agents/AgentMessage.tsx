
import React from "react";
import { Message } from "./types";
import { cn } from "@/lib/utils";

interface AgentMessageProps {
  message: Message;
  agentColor?: string;
}

export function AgentMessage({ message, agentColor }: AgentMessageProps) {
  return (
    <div className={cn(
      "flex mb-4",
      message.isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[70%] rounded-lg p-3", // Changed from max-w-[80%] to max-w-[70%]
        message.isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted"
      )}>
        {!message.isUser && (
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: agentColor }}
            >
              {message.sender.charAt(0)}
            </div>
            <span className="text-xs font-semibold">{message.sender}</span>
          </div>
        )}
        <div className="text-sm whitespace-pre-wrap break-words">{message.content}</div>
        <div className="text-[10px] opacity-70 text-right mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
