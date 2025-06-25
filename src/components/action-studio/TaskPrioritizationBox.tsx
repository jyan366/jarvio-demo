
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
    <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
      <div className="flex items-start gap-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          <Sparkles className="h-5 w-5 text-purple-600" />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Customize Task Prioritization</h3>
            <p className="text-sm text-muted-foreground">
              Tell Jarvio how you'd like suggested tasks to be prioritized based on your business goals
            </p>
          </div>
          
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your prioritization preferences..."
            className="min-h-[100px]"
          />
          
          <div className="flex gap-2">
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? "Updating..." : "Update Priorities"}
            </Button>
            <Button 
              variant="outline" 
              onClick={onSubmit}
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
