
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { v4 as uuidv4 } from 'uuid';
import { UseFormReturn } from 'react-hook-form';

interface AIPromptSectionProps {
  form: UseFormReturn<{ prompt: string }>;
  onSubmit: (steps: FlowStep[], blocks: FlowBlock[]) => void;
  isGenerating: boolean;
  aiError: string | null;
}

export function AIPromptSection({ form, onSubmit, isGenerating, aiError }: AIPromptSectionProps) {
  const [localGenerating, setLocalGenerating] = useState(false);

  const handleAIGeneration = async (prompt: string) => {
    if (!prompt.trim()) return;
    
    setLocalGenerating(true);
    
    try {
      // Simulate AI generation with more detailed step descriptions
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockSteps: Array<{title: string, description: string, blockType: 'collect' | 'think' | 'act', blockOption: string}> = [
        {
          title: "Get Amazon Sales for last 30 days",
          description: 'Use the "AMAZON PERFORMANCE SUMMARY" block to retrieve sales data for the last 30 days from your Amazon seller account.',
          blockType: "collect",
          blockOption: "All Listing Info"
        },
        {
          title: "Analyze sales performance trends",
          description: 'Use the "BASIC AI ANALYSIS" block to identify patterns, trends, and anomalies in the sales data.',
          blockType: "think",
          blockOption: "Basic AI Analysis"
        },
        {
          title: "Generate performance report",
          description: 'Use the "AI SUMMARY" block to create a comprehensive sales performance report with insights and recommendations.',
          blockType: "act",
          blockOption: "AI Summary"
        },
        {
          title: "Send report to team",
          description: 'Use the "SEND EMAIL" block to distribute the sales performance report to the relevant team members.',
          blockType: "act",
          blockOption: "Send Email"
        }
      ];

      const generatedSteps: FlowStep[] = [];
      const generatedBlocks: FlowBlock[] = [];

      mockSteps.forEach((stepData, index) => {
        const blockId = uuidv4();
        const stepId = uuidv4();
        
        generatedBlocks.push({
          id: blockId,
          type: stepData.blockType,
          option: stepData.blockOption,
          name: stepData.title
        });
        
        generatedSteps.push({
          id: stepId,
          title: stepData.title,
          description: stepData.description,
          completed: false,
          order: index,
          blockId: blockId
        });
      });

      onSubmit(generatedSteps, generatedBlocks);
    } catch (error) {
      console.error('AI generation failed:', error);
    } finally {
      setLocalGenerating(false);
    }
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Sparkles className="h-5 w-5" />
          Generate Flow with AI
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={form.handleSubmit((data) => handleAIGeneration(data.prompt))}>
          <div className="space-y-3">
            <Textarea
              {...form.register('prompt')}
              placeholder="Describe what you want your flow to do. E.g., 'Create a weekly Amazon sales analysis that checks performance, identifies trends, and emails a summary to the team.'"
              className="min-h-[100px] resize-none"
            />
            
            <div className="flex gap-2">
              <Button 
                type="submit" 
                disabled={localGenerating || isGenerating}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {(localGenerating || isGenerating) ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Steps...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Steps
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {aiError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{aiError}</AlertDescription>
          </Alert>
        )}
        
        <div className="text-xs text-purple-600 bg-purple-100 p-3 rounded-md">
          <p className="font-medium mb-1">AI will generate:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Step names in plain language</li>
            <li>Detailed descriptions with specific block references</li>
            <li>Proper block configurations for each step</li>
            <li>Clickable block references for easy configuration</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
