
import React from 'react';

export function GradientBackground({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-xl shadow-lg">
      {/* Enhanced background with more vibrant gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 z-0" />
      
      {/* Enhanced gradient overlays with more distinct patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.5)_0%,rgba(255,255,255,0)_70%)] z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(79,70,229,0.1)_0%,rgba(79,70,229,0)_60%)] z-20" />
      
      {/* Subtle animated gradient shimmer */}
      <div className="absolute inset-0 opacity-20 z-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_3s_infinite] translate-x-[-100%]"></div>
      </div>
      
      {/* Content container with improved padding */}
      <div className="relative z-30 p-6 md:p-14">
        {children}
      </div>
    </div>
  );
}
