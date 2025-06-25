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
  const {
    toast
  } = useToast();
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
  return;
}