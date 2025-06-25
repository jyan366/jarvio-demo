
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

  const getInstructionsForBlock = (block: FlowBlock, stepTitle: string): string => {
    const blockInstructions: Record<string, (title: string) => string> = {
      'All Listing Info': (title) => 
        `Use the "ALL LISTING INFO" block to ${title.toLowerCase()}. This collect block will fetch comprehensive product data including titles, prices, inventory levels, and performance metrics from your Amazon seller account.`,
      
      'Send Email': (title) => 
        `Use the "SEND EMAIL" block to ${title.toLowerCase()}. This act block will compose and send automated emails with customizable templates and dynamic content.`,
      
      'Basic AI Analysis': (title) => 
        `Use the "BASIC AI ANALYSIS" block to ${title.toLowerCase()}. This think block will analyze your data using AI to identify patterns, trends, and actionable insights.`,
      
      'AI Summary': (title) => 
        `Use the "AI SUMMARY" block to ${title.toLowerCase()}. This act block will generate comprehensive summaries and reports with AI-powered insights.`,
      
      'Get Keywords': (title) => 
        `Use the "GET KEYWORDS" block to ${title.toLowerCase()}. This collect block will research and gather relevant keywords for your products and market analysis.`,
      
      'User Text': (title) => 
        `Use the "USER TEXT" block to ${title.toLowerCase()}. This collect block will gather custom input and instructions from you to proceed with the task.`,
      
      'Upload Sheet': (title) => 
        `Use the "UPLOAD SHEET" block to ${title.toLowerCase()}. This collect block will process uploaded spreadsheets and extract data for analysis.`,
    };

    const generator = blockInstructions[block.option];
    if (generator) {
      return generator(stepTitle);
    }

    // Fallback instruction
    return `Use the "${block.option.toUpperCase()}" block to ${stepTitle.toLowerCase()}. This ${block.type} block will process the required data and provide the necessary output for the next step.`;
  };

  const handleGenerateInstructions = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate API call to generate instructions
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const instructions = getInstructionsForBlock(block, step.title);
      
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
