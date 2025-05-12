import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

interface AgentInputAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

export function AgentInputArea({
  value,
  onChange,
  onSubmit,
  disabled = false
}: AgentInputAreaProps) {
  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter key for send message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !disabled) {
        onSubmit();
      }
    }
  };

  return (
    <div className="border-t bg-white p-3">
      <div className="flex gap-2 items-end">
        <Textarea
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Jarvio is thinking..." : "Type your message..."}
          className="flex-1 min-h-[36px] max-h-24 resize-none border-gray-300 focus-visible:ring-gray-400"
          disabled={disabled}
          rows={1}
        />
        
        <Button 
          onClick={onSubmit} 
          disabled={!value.trim() || disabled}
          className="self-end rounded-full bg-[#4457ff] hover:bg-[#3a4be0]"
        >
          {disabled ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </div>
  );
}
