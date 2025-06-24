import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { supabase } from '@/integrations/supabase/client';
import { UnifiedTask } from '@/types/unifiedTask';

interface AIStepGeneratorProps {
  taskTitle?: string;
  taskDescription?: string;
  onStepsGenerated: (steps: FlowStep[], blocks: FlowBlock[]) => void;
  task?: UnifiedTask;
}

export function AIStepGenerator({ 
  taskTitle, 
  taskDescription, 
  onStepsGenerated,
  task 
}: AIStepGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSteps = async () => {
    if (!taskTitle) return;
    
    setIsGenerating(true);
    try {
      console.log("Generating steps for task:", taskTitle, taskDescription);
      
      const response = await supabase.functions.invoke('generate-task-steps', {
        body: {
          title: taskTitle,
          description: taskDescription || ""
        }
      });

      console.log("Edge function response:", response);

      if (response.error) {
        console.error("Edge function error:", response.error);
        throw new Error(response.error.message || "Failed to generate steps");
      }

      if (!response.data || !response.data.steps || !Array.isArray(response.data.steps)) {
        console.error("Invalid response data:", response.data);
        throw new Error("Invalid response from step generation service");
      }

      const generatedSteps = response.data.steps;
      console.log("Generated steps:", generatedSteps);

      if (generatedSteps.length === 0) {
        throw new Error("No steps were generated");
      }

      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      };

      const newFlowBlocks = generatedSteps.map((step: any, index: number) => ({
        id: generateUUID(),
        type: index === 0 ? 'collect' : index === generatedSteps.length - 1 ? 'act' : 'think',
        option: index === 0 ? 'User Text' : index === generatedSteps.length - 1 ? 'AI Summary' : 'Basic AI Analysis',
        name: step.title
      }));

      const newFlowSteps = generatedSteps.map((step: any, index: number) => ({
        id: generateUUID(),
        title: step.title,
        description: step.description || "",
        completed: false,
        order: index,
        blockId: newFlowBlocks[index].id
      }));

      console.log("Created flow steps:", newFlowSteps);
      console.log("Created flow blocks:", newFlowBlocks);

      onStepsGenerated(newFlowSteps, newFlowBlocks);
      
    } catch (error) {
      console.error("Error generating steps:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="p-6 text-center">
        <div className="mb-4">
          <Wand2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <h3 className="font-medium">Generate AI Steps</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Let AI break down your task into actionable steps
          </p>
        </div>
        
        <Button 
          onClick={generateSteps} 
          disabled={isGenerating || !taskTitle}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Generating Steps...
            </>
          ) : (
            <>
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Steps with AI
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
