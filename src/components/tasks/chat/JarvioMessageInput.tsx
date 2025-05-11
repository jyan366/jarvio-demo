
import React, { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send, PlayCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JarvioMessageInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => Promise<void>;
  disabled?: boolean;
  isFlowTask?: boolean;
  onRunFlow?: () => void;
}

export const JarvioMessageInput: React.FC<JarvioMessageInputProps> = ({
  value,
  onChange,
  onSubmit,
  disabled = false,
  isFlowTask = false,
  onRunFlow
}) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter key for send message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit();
    } else if (!value.trim()) {
      toast({
        title: "Can't send empty message",
        description: "Please type a message first"
      });
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="flex gap-2 items-end p-3 relative"
    >
      <Textarea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Jarvio is thinking..." : "Type your message..."}
        className="flex-1 min-h-[36px] max-h-24 resize-none"
        disabled={disabled}
        ref={inputRef}
        rows={1}
      />
      
      <Button 
        type="submit" 
        disabled={!value.trim() || disabled}
        className="self-end rounded-full"
      >
        {disabled ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        <span className="sr-only">Send</span>
      </Button>
      
      {isFlowTask && onRunFlow && (
        <Button
          type="button"
          onClick={onRunFlow}
          variant="outline"
          className="self-end ml-1"
          disabled={disabled}
        >
          <PlayCircle className="h-4 w-4 mr-1" />
          Run Flow
        </Button>
      )}
    </form>
  );
};
