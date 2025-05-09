
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';

// Example prompt suggestions
const PROMPT_PLACEHOLDER = "E.g.: Create a weekly product review analysis flow...";

export function TypedPrompts({ onSubmit }: { onSubmit?: (prompt: string) => void }) {
  const [prompt, setPrompt] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() === "") return;
    
    if (onSubmit) {
      onSubmit(prompt);
    } else {
      // Default behavior - navigate to builder with the prompt
      navigate(`/jarvi-flows/builder?prompt=${encodeURIComponent(prompt)}`);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="w-full">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={PROMPT_PLACEHOLDER}
          className="text-lg sm:text-xl bg-white bg-opacity-[0.15] backdrop-blur px-4 py-6 rounded-lg w-full max-w-3xl h-14 border-2 border-blue-100"
          autoComplete="off"
        />
      </form>
    </div>
  );
}
