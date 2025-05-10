
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, HelpCircle, Loader2, WandSparkles } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

interface AIPromptFormValues {
  prompt: string;
}

interface AIPromptSectionProps {
  form: UseFormReturn<AIPromptFormValues>;
  onSubmit: (data: AIPromptFormValues) => Promise<void>;
  isGenerating: boolean;
  aiError: string | null;
}

export function AIPromptSection({ 
  form, 
  onSubmit, 
  isGenerating, 
  aiError 
}: AIPromptSectionProps) {
  return (
    <Card className="border-2 border-purple-200 bg-purple-50/50">
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-medium">Describe your flow</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="E.g.: Create a flow that analyzes customer reviews weekly, identifies common issues, and sends a summary email to the team."
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
                    Generate Flow
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
                  Example: "Create a flow to check inventory weekly and send restock alerts"
                </div>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
