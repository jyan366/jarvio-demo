
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Loader2 } from 'lucide-react';
import { TypewriterText } from './TypewriterText';

// Example prompt suggestions for the typewriter effect
const EXAMPLE_PROMPTS = [
  "Create a weekly product review analysis flow...",
  "Build a flow that monitors inventory levels...",
  "Design a flow to analyze customer feedback...",
  "Make a flow that generates listing optimizations...",
  "Create a restock alert system for low inventory...",
];

export function TypedPrompts({ onSubmit }: { onSubmit?: (prompt: string) => void }) {
  const [prompt, setPrompt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
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
            placeholder=""
            className={`
              text-lg sm:text-xl 
              bg-white bg-opacity-95 
              shadow-md
              backdrop-blur 
              px-4 py-6 
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
                typingSpeed={60}
                deletingSpeed={30}
                className="text-lg sm:text-xl"
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
