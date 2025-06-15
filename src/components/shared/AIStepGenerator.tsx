
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, HelpCircle, Loader2, WandSparkles } from 'lucide-react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AIStepFormValues {
  prompt: string;
}

interface AIStepGeneratorProps {
  onStepsGenerated: (steps: string[]) => void;
  taskTitle?: string;
  taskDescription?: string;
  placeholder?: string;
  className?: string;
}

export function AIStepGenerator({ 
  onStepsGenerated, 
  taskTitle, 
  taskDescription,
  placeholder = "E.g.: Break down this task into actionable steps that can be executed by an AI agent...",
  className = ""
}: AIStepGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const form = useForm<AIStepFormValues>({
    defaultValues: {
      prompt: taskDescription || ""
    }
  });

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
      
      const response = await supabase.functions.invoke('generate-task-steps', {
        body: {
          title: taskTitle || "Task Steps",
          description: data.prompt
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      const steps = response.data?.steps || [];
      const stepTitles = steps.map((step: any) => step.title || step);
      
      if (stepTitles.length === 0) {
        throw new Error("No steps were generated");
      }

      onStepsGenerated(stepTitles);
      form.reset();
      
      toast({
        title: "Steps generated",
        description: `Generated ${stepTitles.length} steps for your task`
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
