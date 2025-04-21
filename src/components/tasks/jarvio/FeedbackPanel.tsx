
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";

interface FeedbackPanelProps {
  feedback: string;
  setFeedback: (val: string) => void;
  onContinue: () => void;
  onSubmitFeedback: (e: React.FormEvent) => void;
}

export const FeedbackPanel: React.FC<FeedbackPanelProps> = ({
  feedback,
  setFeedback,
  onContinue,
  onSubmitFeedback,
}) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-2">
    <p className="text-sm font-medium mb-2 text-green-800">
      Subtask completed! Would you like to continue?
    </p>
    <div className="space-y-2">
      <form onSubmit={onSubmitFeedback}>
        <Textarea
          className="min-h-16 mb-2 text-xs resize-none bg-white"
          placeholder="Optional feedback before continuing..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="bg-green-600 hover:bg-green-700"
            onClick={onContinue}
            type="button"
          >
            <Check size={16} className="mr-1" /> Continue
          </Button>
          <Button
            size="sm"
            type="submit"
            variant="outline"
            disabled={!feedback.trim()}
            className="border-green-300 text-green-700 hover:bg-green-50"
          >
            Send Feedback & Continue
          </Button>
        </div>
      </form>
    </div>
  </div>
);
