
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface ReviewQuestionSectionProps {
  onAskQuestion: (question: string) => void;
  answer: string | null;
}

export function ReviewQuestionSection({ onAskQuestion, answer }: ReviewQuestionSectionProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    onAskQuestion(question);
    setQuestion("");
  };

  return (
    <section className="space-y-4">
      <h3 className="font-semibold text-lg">Ask Jarvio About Reviews</h3>
      <div className="space-y-4">
        <div className="flex gap-3">
          <Textarea 
            placeholder="e.g., Summarise my reviews"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="min-h-[60px]"
          />
          <Button 
            onClick={handleSubmit}
            disabled={!question.trim()}
            className="shrink-0"
          >
            Ask Jarvio
          </Button>
        </div>
        
        {answer && (
          <Card className="p-4 bg-green-50 border-green-100">
            <p className="text-green-900 whitespace-pre-line">{answer}</p>
          </Card>
        )}
      </div>
    </section>
  );
}
