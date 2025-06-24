
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
    <div className="border-2 border-purple-200 bg-purple-50/50 rounded-lg">
      <AIStepGenerator
        onStepsGenerated={handleStepsGenerated}
      />
    </div>
  );
}
