
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

interface TaskPrioritizationBoxProps {
  onSubmit: () => void;
}

export function TaskPrioritizationBox({
  onSubmit
}: TaskPrioritizationBoxProps) {
  const [prompt, setPrompt] = useState("How should Jarvio prioritize my suggested tasks?");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate a delay to show loading state
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Priorities Updated",
        description: "Suggested tasks will start to be prioritized in this order from now on."
      });
      onSubmit();
    }, 1500);
  };

  return (
    <Card className="p-6 border-2 border-purple-200 bg-purple-50/50">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-lg font-semibold">Task Prioritization</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Help Jarvio understand how to prioritize your suggested tasks based on your business goals.
        </p>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe how you'd like tasks to be prioritized..."
          className="min-h-[100px]"
        />
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isSubmitting ? "Updating..." : "Update Priorities"}
        </Button>
      </div>
    </Card>
  );
}
