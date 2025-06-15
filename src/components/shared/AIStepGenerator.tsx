
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, HelpCircle, Loader2, WandSparkles } from 'lucide-react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FlowStep, FlowBlock } from '@/types/flowTypes';

interface AIStepFormValues {
  prompt: string;
}

interface AIStepGeneratorProps {
  onStepsGenerated: (steps: FlowStep[], blocks: FlowBlock[]) => void;
  taskTitle?: string;
  taskDescription?: string;
  placeholder?: string;
  className?: string;
  onClearCompletions?: () => void;
}

export function AIStepGenerator({ 
  onStepsGenerated, 
  taskTitle, 
  taskDescription,
  placeholder = "E.g.: Create a flow that analyzes customer reviews weekly, identifies common issues, and sends a summary email to the team.",
  className = "",
  onClearCompletions
}: AIStepGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const form = useForm<AIStepFormValues>({
    defaultValues: {
      prompt: taskDescription || ""
    }
  });

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleSubmit = async (data: AIStepFormValues) => {
    try {
      if (!data.prompt.trim()) {
        toast({
          title: "Empty prompt",
          description: "Please enter a description to generate steps",
          variant: "destructive"
        });
        return;
      }
      
      setIsGenerating(true);
      setAiError(null);
      
      console.log("Generating steps for prompt:", data.prompt);
      
      // Clear completion data BEFORE generating new steps
      if (onClearCompletions) {
        console.log("Clearing existing completions before generating new steps");
        await onClearCompletions();
      }
      
      // Call the generate-task-steps edge function directly
      const response = await supabase.functions.invoke('generate-task-steps', {
        body: {
          title: taskTitle || "Generated Task",
          description: data.prompt
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data || !response.data.steps) {
        throw new Error("No steps were generated");
      }

      const generatedSteps = response.data.steps;
      console.log("Generated steps:", generatedSteps);

      // Convert generated steps to FlowStep and FlowBlock format
      const steps: FlowStep[] = [];
      const blocks: FlowBlock[] = [];

      generatedSteps.forEach((step: any, index: number) => {
        const stepId = generateUUID();
        const blockId = generateUUID();

        // Create FlowStep - explicitly set completed to false
        steps.push({
          id: stepId,
          title: step.title || `Step ${index + 1}`,
          description: step.description || "",
          completed: false, // Explicitly ensure new steps are not completed
          order: index,
          blockId: blockId
        });

        // Create FlowBlock with default type and option
        blocks.push({
          id: blockId,
          type: index === 0 ? 'collect' : index === generatedSteps.length - 1 ? 'act' : 'think',
          option: index === 0 ? 'User Text' : index === generatedSteps.length - 1 ? 'AI Summary' : 'Basic AI Analysis',
          name: step.title || `Step ${index + 1}`
        });
      });

      console.log("Converted to steps:", steps);
      console.log("Converted to blocks:", blocks);

      // Call the callback with the generated steps and blocks
      onStepsGenerated(steps, blocks);
      form.reset();
      
      toast({
        title: "Steps generated",
        description: `Generated ${steps.length} steps successfully`
      });
      
    } catch (error) {
      console.error("Error generating steps:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setAiError(errorMessage);
      toast({
        title: "Error generating steps",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className={`border-2 border-purple-200 bg-purple-50/50 ${className}`}>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-medium">Generate steps with AI</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={placeholder}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <WandSparkles className="h-4 w-4 mr-2" />
                    Create with AI
                  </>
                )}
              </Button>
              
              {aiError && (
                <div className="text-xs text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {aiError}
                </div>
              )}
              
              {!aiError && (
                <div className="text-xs text-muted-foreground flex items-center mt-2 sm:mt-0">
                  <HelpCircle className="h-3 w-3 mr-1" />
                  AI will generate actionable steps for your task
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
