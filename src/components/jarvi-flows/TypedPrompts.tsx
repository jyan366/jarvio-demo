
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';

// Example prompt suggestions
const PROMPT_PLACEHOLDER = "E.g.: Create a weekly product review analysis flow...";

export function TypedPrompts({ onSubmit }: { onSubmit?: (prompt: string) => void }) {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() === "") return;
    
    setIsSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(prompt);
      } else {
        // Default behavior - navigate to builder with the prompt
        navigate(`/jarvi-flows/builder?prompt=${encodeURIComponent(prompt)}`);
      }
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
            placeholder={PROMPT_PLACEHOLDER}
            className="text-lg sm:text-xl bg-white bg-opacity-[0.15] backdrop-blur px-4 py-6 rounded-lg w-full h-14 border-2 border-blue-100"
            autoComplete="off"
            disabled={isSubmitting}
          />
        </div>
        <Button 
          type="submit"
          className="bg-[#4457ff] hover:bg-[#4457ff]/90 h-14 px-4"
          disabled={isSubmitting || prompt.trim() === ""}
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Create with AI
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
