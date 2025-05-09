import React from 'react';
import { TypedPrompts } from './TypedPrompts';
import { GradientBackground } from './GradientBackground';
interface HeroSectionProps {
  onAIPromptSubmit: (prompt: string) => Promise<void>;
}
export function HeroSection({
  onAIPromptSubmit
}: HeroSectionProps) {
  return <GradientBackground>
      <div className="flex flex-col items-center justify-center space-y-8 py-10">
        <div className="max-w-3xl text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Make your Amazon business 
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent italic mx-0 px-[3px]"> Flow</span>
          </h1>
          
          <p className="text-gray-700 text-base mb-8 max-w-2xl mx-auto">
            Create powerful automation flows with AI that streamline your Amazon operations
          </p>
        </div>

        <div className="w-full max-w-2xl transition-all duration-500 hover:scale-[1.01]">
          <TypedPrompts onSubmit={onAIPromptSubmit} />
        </div>
      </div>
    </GradientBackground>;
}