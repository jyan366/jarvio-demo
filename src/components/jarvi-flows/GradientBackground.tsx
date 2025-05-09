
import React, { useState, useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  size: number;
  opacity: number;
  id: number;
}

export function GradientBackground({ children }: { children: React.ReactNode }) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setCursorPosition({ x, y });
      
      // Create a new ripple with some probability to avoid too many ripples
      if (Math.random() > 0.85) {
        const newRipple = {
          x,
          y,
          size: 10,
          opacity: 0.7,
          id: rippleIdRef.current++
        };
        
        setRipples(prev => [...prev, newRipple]);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  // Animate ripples
  useEffect(() => {
    if (ripples.length === 0) return;
    
    const animateRipples = () => {
      setRipples(prev => 
        prev
          .map(ripple => ({
            ...ripple,
            size: ripple.size + 1.5,
            opacity: ripple.opacity - 0.01
          }))
          .filter(ripple => ripple.opacity > 0)
      );
    };
    
    const interval = setInterval(animateRipples, 16);
    return () => clearInterval(interval);
  }, [ripples]);

  return (
    <div 
      ref={containerRef} 
      className="relative overflow-hidden rounded-xl shadow-lg cursor-default"
      style={{ touchAction: 'none' }} // Prevents touch scrolling issues
    >
      {/* Base gradient background - using darker colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-purple-200 z-0" />
      
      {/* Interactive gradient overlay that follows cursor - increased opacity */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-300/20 via-purple-300/30 to-indigo-300/20 z-10 transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${cursorPosition.x * 0.01}px, ${cursorPosition.y * 0.01}px)`,
          opacity: 0.9
        }}
      />
      
      {/* Ripple effects - darker color for better visibility */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full bg-white/70 z-20 pointer-events-none"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            opacity: ripple.opacity,
            transform: `scale(${1 + ripple.size * 0.01})`,
            transition: 'transform 0.5s ease-out',
            background: 'rgba(255, 255, 255, 0.7)',
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
          }}
        />
      ))}
      
      {/* Enhanced gradient overlays with more distinct patterns - increased intensity */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_70%)] z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(79,70,229,0.2)_0%,rgba(79,70,229,0)_60%)] z-30" />
      
      {/* Subtle animated gradient shimmer */}
      <div className="absolute inset-0 opacity-30 z-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_3s_infinite] translate-x-[-100%]"></div>
      </div>
      
      {/* Content container with improved padding */}
      <div className="relative z-40 p-6 md:p-14">
        {children}
      </div>
    </div>
  );
}
