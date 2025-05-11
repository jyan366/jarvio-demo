
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import { TypewriterText } from './TypewriterText';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// More comprehensive Amazon-specific prompt suggestions
const EXAMPLE_PROMPTS = [
  "Create a flow that monitors competitor pricing and alerts me...",
  "Build a weekly inventory rebalancing system across warehouses...",
  "Design a flow that analyzes negative reviews for product defects...",
  "Create a brand protection system to monitor unauthorized sellers...",
  "Build a flow to generate A+ content suggestions based on trends...",
  "Design an automated PPC campaign optimization strategy...", 
  "Create a flow to track Buy Box ownership percentage by ASIN...",
  "Build a flow that combines sales velocity with inventory levels...",
  "Generate monthly performance reports for each product category...",
  "Set up auto-responders for common customer service queries..."
];

export function TypedPrompts({ onSubmit }: { onSubmit?: (prompt: string) => void }) {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (prompt.trim() === "") {
      toast({
        title: "Empty prompt",
        description: "Please enter a description for your flow",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Submitting prompt:", prompt);
      
      if (onSubmit) {
        await onSubmit(prompt);
      } else {
        // Direct flow generation via the Supabase edge function
        toast({
          title: "Creating your flow",
          description: "Please wait while we generate your custom flow..."
        });

        // Call the generate-flow function directly
        const response = await supabase.functions.invoke("generate-flow", {
          body: {
            prompt: prompt
          }
        });
        
        if (!response.data || response.data.success === false) {
          const errorMsg = response.data?.error || "Unknown error occurred";
          console.error("Flow generation error:", errorMsg);
          throw new Error(errorMsg);
        }
        
        // If successful, navigate to builder with the generated flow encoded in query params
        const generatedFlow = response.data.generatedFlow;
        if (generatedFlow) {
          console.log("Generated flow:", generatedFlow);
          const flowParam = encodeURIComponent(JSON.stringify(generatedFlow));
          navigate(`/jarvi-flows/builder?generatedFlow=${flowParam}`);
        } else {
          throw new Error("No flow was generated");
        }
      }
    } catch (error) {
      console.error("Error generating flow:", error);
      toast({
        title: "Error generating flow",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="flex w-full gap-2">
        <div className="flex-1 relative">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder=""
            className={`
              text-base
              bg-white bg-opacity-95 
              shadow-md
              backdrop-blur 
              px-4 py-5 
              rounded-lg 
              w-full h-14 
              border-2 
              transition-all duration-300
              ${isFocused ? 'border-blue-300 shadow-lg shadow-blue-100/50' : 'border-blue-100'}
            `}
            autoComplete="off"
            disabled={isSubmitting}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          
          {/* Placeholder with typewriter effect (only show when input is empty) */}
          {!prompt && !isSubmitting && (
            <div className="absolute left-4 top-0 h-full flex items-center pointer-events-none text-gray-400">
              <TypewriterText 
                texts={EXAMPLE_PROMPTS}
                typingSpeed={40}
                deletingSpeed={30}
                className="text-base"
              />
            </div>
          )}
        </div>
        <Button 
          type="submit"
          className={`
            bg-[#4457ff] hover:bg-[#4457ff]/90 
            h-14 w-14
            flex items-center justify-center
            shadow-md hover:shadow-lg
            transition-all duration-300
            ${isFocused ? 'bg-[#3446ee]' : ''}
          `}
          disabled={isSubmitting || prompt.trim() === ""}
          aria-label="Create with AI"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
        </Button>
      </form>
    </div>
  );
}
