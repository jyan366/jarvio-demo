
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

interface TaskPrioritizationBoxProps {
  onSubmit: () => void;
}

export function TaskPrioritizationBox({ onSubmit }: TaskPrioritizationBoxProps) {
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
        description: "Suggested tasks will start to be prioritized in this order from now on.",
      });
      onSubmit();
    }, 1500);
  };

  return (
    <Card className="p-4 mb-6 border-[#e6e9f0] bg-[#f8f9fc]">
      <div className="flex items-start space-x-3">
        <div className="bg-[#4457ff]/10 p-2 rounded-full">
          <Sparkles className="h-5 w-5 text-[#4457ff]" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-2">Welcome to Action Studio</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Here are your initial suggested tasks. Help Jarvio prioritize them by sharing what's most important to you right now.
          </p>
          
          <div className="space-y-3">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px] text-sm"
              placeholder="Tell Jarvio how to prioritize your tasks..."
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting || !prompt.trim()}
                className="bg-[#4457ff] hover:bg-[#4457ff]/90"
              >
                {isSubmitting ? "Updating priorities..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
