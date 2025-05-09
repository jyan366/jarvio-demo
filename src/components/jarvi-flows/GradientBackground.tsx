
import React from 'react';

export function GradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-xl">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-purple-200 z-0" />
      
      {/* Enhanced gradient overlay with more subtle patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.3)_0%,rgba(255,255,255,0)_60%)] z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(79,70,229,0.08)_0%,rgba(79,70,229,0)_50%)] z-20" />
      
      {/* Content container with better padding */}
      <div className="relative z-30 p-6 md:p-12">
        {children}
      </div>
    </div>
  );
}
