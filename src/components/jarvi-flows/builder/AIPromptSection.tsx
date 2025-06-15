
import React from 'react';
import { AIStepGenerator } from '@/components/shared/AIStepGenerator';

interface AIPromptSectionProps {
  form: any;
  onSubmit: (data: { prompt: string }) => Promise<void>;
  isGenerating: boolean;
  aiError: string | null;
}

export function AIPromptSection({ 
  form, 
  onSubmit, 
  isGenerating, 
  aiError 
}: AIPromptSectionProps) {
  const handleStepsGenerated = async (steps: string[]) => {
    // Convert steps to the expected format for flow generation
    await onSubmit({ prompt: form.getValues('prompt') });
  };

  return (
    <AIStepGenerator
      onStepsGenerated={handleStepsGenerated}
      placeholder="E.g.: Create a flow that analyzes customer reviews weekly, identifies common issues, and sends a summary email to the team."
      className="border-2 border-purple-200 bg-purple-50/50"
    />
  );
}
