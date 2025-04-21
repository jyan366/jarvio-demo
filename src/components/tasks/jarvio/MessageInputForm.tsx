
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare } from "lucide-react";

interface MessageInputFormProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  isLoading: boolean;
  pendingApproval: boolean;
  autoRunMode: boolean;
  autoRunPaused: boolean;
  awaitingContinue: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const MessageInputForm: React.FC<MessageInputFormProps> = ({
  inputValue,
  setInputValue,
  isLoading,
  pendingApproval,
  autoRunMode,
  autoRunPaused,
  awaitingContinue,
  onSubmit,
}) => (
  <form
    onSubmit={onSubmit}
    className="sticky bottom-0 left-0 right-0 p-4 pt-2 border-t bg-white z-20"
    style={{
      boxShadow: "0 -6px 20px 0 rgba(0,0,0,0.10)",
    }}
  >
    <div className="flex items-end gap-2">
      <Textarea
        className="min-h-24 text-sm resize-none"
        placeholder="Ask Jarvio for help..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={
          isLoading ||
          pendingApproval ||
          (autoRunMode && !autoRunPaused) ||
          awaitingContinue
        }
      />
      <Button 
        type="submit" 
        disabled={
          isLoading ||
          !inputValue.trim() ||
          pendingApproval ||
          (autoRunMode && !autoRunPaused) ||
          awaitingContinue
        }
        className="h-10"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <MessageSquare className="h-4 w-4" />
        )}
      </Button>
    </div>
  </form>
);
