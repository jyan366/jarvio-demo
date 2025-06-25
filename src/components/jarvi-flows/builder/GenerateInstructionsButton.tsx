
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';

interface GenerateInstructionsButtonProps {
  step: FlowStep;
  block: FlowBlock;
  onInstructionsGenerated: (instructions: string) => void;
}

export function GenerateInstructionsButton({ 
  step, 
  block, 
  onInstructionsGenerated 
}: GenerateInstructionsButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInstructions = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call to generate instructions
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const instructions = `Use the "${block.option.toUpperCase()}" block to ${step.title.toLowerCase()}. This ${block.type} block will process the required data and provide the necessary output for the next step.`;
      
      onInstructionsGenerated(instructions);
    } catch (error) {
      console.error('Failed to generate instructions:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleGenerateInstructions}
      disabled={isGenerating}
      className="text-xs"
    >
      {isGenerating ? (
        <>
          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="w-3 h-3 mr-1" />
          Generate Instructions
        </>
      )}
    </Button>
  );
}
