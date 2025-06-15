
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
}

export function AIStepGenerator({ 
  onStepsGenerated, 
  taskTitle, 
  taskDescription,
  placeholder = "E.g.: Create a flow that analyzes customer reviews weekly, identifies common issues, and sends a summary email to the team.",
  className = ""
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
      
      console.log("Generating flow for prompt:", data.prompt);
      
      // Call the generate-flow edge function with block options
      const response = await supabase.functions.invoke('generate-flow', {
        body: {
          prompt: data.prompt,
          blockOptions: {
            collect: ['User Text', 'File Upload', 'Data Import', 'Form Input'],
            think: ['Basic AI Analysis', 'Advanced Reasoning', 'Data Processing', 'Pattern Recognition'],
            act: ['AI Summary', 'Send Email', 'Create Report', 'Update Database', 'API Call'],
            agent: ['Agent']
          }
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data || response.data.success === false) {
        const errorMsg = response.data?.error || "Unknown error occurred";
        console.error("Flow generation error:", errorMsg);
        throw new Error(errorMsg);
      }

      const generatedFlow = response.data.generatedFlow;
      console.log("Generated flow data:", generatedFlow);

      // Handle the case where we get blocks instead of steps/blocks
      let steps: FlowStep[] = [];
      let blocks: FlowBlock[] = [];

      if (generatedFlow?.blocks && Array.isArray(generatedFlow.blocks)) {
        // Convert the generated blocks into steps and blocks format
        generatedFlow.blocks.forEach((block: any, index: number) => {
          const stepId = generateUUID();
          const blockId = generateUUID();

          // Create FlowStep
          steps.push({
            id: stepId,
            title: block.name || `Step ${index + 1}`,
            description: "",
            completed: false,
            order: index,
            blockId: blockId
          });

          // Create FlowBlock
          blocks.push({
            id: blockId,
            type: block.type || 'collect',
            option: block.option || 'User Text',
            name: block.name || `Step ${index + 1}`
          });
        });
      } else if (generatedFlow?.steps && generatedFlow?.blocks) {
        // Use the steps and blocks directly if they're already in the right format
        steps = generatedFlow.steps;
        blocks = generatedFlow.blocks;
      } else {
        throw new Error("Invalid response format - no blocks or steps found");
      }

      if (steps.length === 0) {
        throw new Error("No steps were generated");
      }

      console.log("Converted to steps:", steps);
      console.log("Converted to blocks:", blocks);

      // Call the callback with the generated steps and blocks
      // This will replace all existing steps
      onStepsGenerated(steps, blocks);
      form.reset();
      
      toast({
        title: "Flow generated",
        description: `Generated ${steps.length} steps with linked blocks`
      });
      
    } catch (error) {
      console.error("Error generating flow:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setAiError(errorMessage);
      toast({
        title: "Error generating flow",
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
                  <FormLabel className="text-md font-medium">Generate flow with AI</FormLabel>
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
                  AI will generate actionable steps with execution blocks
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
