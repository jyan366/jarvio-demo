
import React from 'react';
import { AIStepGenerator } from '@/components/shared/AIStepGenerator';
import { FlowStep, FlowBlock } from '@/types/flowTypes';

interface AIPromptSectionProps {
  form: any;
  onSubmit: (steps: FlowStep[], blocks: FlowBlock[]) => Promise<void>;
  isGenerating: boolean;
  aiError: string | null;
}

export function AIPromptSection({ 
  form, 
  onSubmit, 
  isGenerating, 
  aiError 
}: AIPromptSectionProps) {
  const handleStepsGenerated = async (steps: FlowStep[], blocks: FlowBlock[]) => {
    await onSubmit(steps, blocks);
  };

  return (
    <AIStepGenerator
      onStepsGenerated={handleStepsGenerated}
      placeholder="E.g.: Create a flow that analyzes customer reviews weekly, identifies common issues, and sends a summary email to the team."
      className="border-2 border-purple-200 bg-purple-50/50"
    />
  );
}
