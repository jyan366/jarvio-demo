
import React from "react";
import { MessageCircle } from "lucide-react";
import { Markdown } from "markdown-to-jsx";
import { Subtask } from "@/pages/TaskWorkContainer";
import { Button } from "@/components/ui/button";

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

  return (
    <div className="space-y-4 pb-4">
      {messages.map((message, index) => (
        <div
          key={message.id || index}
          className={`flex ${
            message.isUser ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[85%] rounded-lg p-3 ${
              message.isUser
                ? "bg-primary text-primary-foreground ml-4"
                : message.systemLog
                ? "bg-muted border border-border"
                : "bg-muted/50 border border-primary/10 mr-4"
            }`}
          >
            <div className="prose prose-sm dark:prose-invert break-words">
              <Markdown options={{
                forceBlock: true,
                wrapper: "div",
                forceWrapper: true,
              }}>
                {message.text}
              </Markdown>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
