
import React from "react";
import { Message } from "./types";
import { cn } from "@/lib/utils";
import { agentsData } from "@/data/agentsData";

interface AgentMessageProps {
  message: Message;
  agentColor?: string;
}

export function AgentMessage({ message, agentColor }: AgentMessageProps) {
  // Function to format message text with styling
  const formatMessageText = (text: string) => {
    if (!text) return '';
    
    // Convert markdown-style bold (**text**) to HTML bold
    let formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Process all agent mentions
    agentsData.forEach(agent => {
      const pattern = new RegExp(`@${agent.name}`, 'g');
      const mentionColor = agent.avatarColor || '#9b87f5'; // Use agent color or default to primary purple
      formattedText = formattedText.replace(
        pattern, 
        `<span style="color:${mentionColor};font-weight:bold;">@${agent.name}</span>`
      );
    });
    
    return formattedText;
  };

  return (
    <div className={cn(
      "flex mb-4",
      message.isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[70%] rounded-lg p-3", 
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
        <div 
          className="text-sm whitespace-pre-wrap break-words"
          dangerouslySetInnerHTML={{ 
            __html: formatMessageText(message.content) 
          }}
        />
        <div className="text-[10px] opacity-70 text-right mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
