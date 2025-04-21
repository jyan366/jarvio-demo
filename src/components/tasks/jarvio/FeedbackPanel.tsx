
import React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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
  <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex flex-col gap-3">
    <p className="text-sm font-medium text-green-800 mb-2">
      Subtask complete! Review the results above and the collected data below. Would you like to continue to the next step or provide feedback?
    </p>
    <form className="flex flex-col gap-2" onSubmit={onSubmitFeedback}>
      <Textarea
        className="min-h-14 text-xs"
        placeholder="Optional: Write feedback for Jarvio about this step..."
        value={feedback}
        onChange={e => setFeedback(e.target.value)}
      />
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="default"
          onClick={onContinue}
          type="button"
        >
          Continue
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={!feedback.trim()}
          type="submit"
        >
          Send Feedback & Continue
        </Button>
      </div>
    </form>
  </div>
);
