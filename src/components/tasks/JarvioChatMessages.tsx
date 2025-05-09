import React from "react";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import { Subtask } from "@/pages/TaskWorkContainer";
import { Button } from "@/components/ui/button";
import { agentsData } from "@/data/agentsData";

interface JarvioChatMessagesProps {
  messages: any[];
  subtasks: Subtask[];
  activeSubtaskIdx: number;
  onGenerateSteps?: () => void;
}

export const JarvioChatMessages: React.FC<JarvioChatMessagesProps> = ({
  messages,
  subtasks,
  activeSubtaskIdx,
  onGenerateSteps
}) => {
  // Function to format message text with styling
  const formatMessageText = (text: string) => {
    if (!text) return '';
    
    // Replace markdown-style bold (**text**) to HTML bold
    let formattedText = text.replace(
      /\*\*(.*?)\*\*/g, 
      '<strong>$1</strong>'
    );
    
    // Make "Review Information" bold
    formattedText = formattedText.replace(
      /Review Information/g, 
      '<strong>Review Information</strong>'
    );
    
    // Process all agent mentions
    agentsData.forEach(agent => {
      const pattern = new RegExp(`@${agent.name}`, 'g');
      const agentColor = agent.avatarColor || '#9b87f5'; // Use agent color or default to primary purple
      formattedText = formattedText.replace(
        pattern, 
        `<span style="color:${agentColor};font-weight:bold;">@${agent.name}</span>`
      );
    });

    return formattedText;
  };

  if (messages.length === 0 && (!subtasks || subtasks.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
        <MessageCircle className="h-12 w-12 text-primary/20" />
        <div className="max-w-[320px] space-y-2">
          <p className="text-lg font-medium">Let's break down this task</p>
          <p className="text-sm text-muted-foreground">
            I notice there are no subtasks yet. Would you like me to help generate some subtasks to break down this work?
          </p>
          {onGenerateSteps && (
            <Button onClick={onGenerateSteps} className="mt-4">
              Generate Subtasks
            </Button>
          )}
        </div>
      </div>
    );
  }

  const currentSubtask = subtasks[activeSubtaskIdx];

  return (
    <div className="space-y-4 pb-4">
      {messages.map((message, index) => {
        // Check if message contains subtask complete notification
        const isSubtaskComplete = !message.isUser && 
          message.text.includes("SUBTASK COMPLETE") || 
          message.text.includes("Subtask complete");

        return (
          <div
            key={message.id || index}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            {message.isUser && (
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center mr-2 self-start mt-1">
                <span className="text-sm font-semibold text-zinc-700">
                  {message.user?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.isUser
                  ? "bg-white border border-gray-200"
                  : isSubtaskComplete
                  ? "bg-purple-100 border border-purple-200 w-full"
                  : "bg-muted/50 border border-primary/10"
              }`}
            >
              {!message.isUser && !message.systemLog && currentSubtask && (
                <div className="text-purple-600 font-medium text-sm mb-1">
                  {currentSubtask.title}
                </div>
              )}
              
              <div className="prose prose-sm dark:prose-invert break-words">
                {isSubtaskComplete ? (
                  <div className="flex items-center text-purple-700">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-500" />
                    <span>Subtask complete! Please mark this subtask as done and select the next one to continue.</span>
                  </div>
                ) : message.isUser ? (
                  <div>{message.text}</div>
                ) : (
                  <div 
                    className="markdown-content"
                    dangerouslySetInnerHTML={{ __html: formatMessageText(message.text) }}
                  />
                )}
              </div>
              
              {message.timestamp && (
                <div className="text-right text-xs text-gray-400 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
