
import React, { useState, useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  size: number;
  opacity: number;
  id: number;
  color: string;
}

export function GradientBackground({ children }: { children: React.ReactNode }) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoverIntensity, setHoverIntensity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const rippleIdRef = useRef(0);
  const lastMoveTimeRef = useRef(Date.now());
  
  // Colors for the ripples
  const rippleColors = [
    'rgba(79, 70, 229, 0.2)',  // Indigo
    'rgba(124, 58, 237, 0.2)', // Purple
    'rgba(59, 130, 246, 0.2)', // Blue
    'rgba(16, 185, 129, 0.15)' // Emerald
  ];

  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Calculate movement speed based on distance moved since last event
      const now = Date.now();
      const timeDiff = now - lastMoveTimeRef.current;
      lastMoveTimeRef.current = now;
      
      // Update cursor position with smoothing
      setCursorPosition(prev => ({
        x: x,
        y: y
      }));
      
      // Increase hover intensity when mouse is moving
      setHoverIntensity(0.8);
      
      // Create ripples more dynamically based on movement speed
      if (timeDiff > 20) { // Limit ripple creation rate
        const size = Math.random() * 10 + 20; // Varied sizes
        const randomColor = rippleColors[Math.floor(Math.random() * rippleColors.length)];
        
        const newRipple = {
          x,
          y,
          size,
          opacity: 0.7,
          id: rippleIdRef.current++,
          color: randomColor
        };
        
        setRipples(prev => [...prev, newRipple]);
      }
    };
    
    const handleMouseLeave = () => {
      setHoverIntensity(0);
    };
    
    const handleMouseEnter = () => {
      setHoverIntensity(0.5);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
      container.addEventListener('mouseenter', handleMouseEnter);
    }
    
    // Gradually reduce hover intensity when not moving
    const intensityInterval = setInterval(() => {
      if (Date.now() - lastMoveTimeRef.current > 100) {
        setHoverIntensity(prev => Math.max(0.2, prev * 0.95));
      }
    }, 100);
    
    return () => {
      if (container) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('mouseleave', handleMouseLeave);
        container.removeEventListener('mouseenter', handleMouseEnter);
      }
      clearInterval(intensityInterval);
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
            size: ripple.size + 2.5, // Faster expansion
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
      className="relative overflow-hidden rounded-xl shadow-lg cursor-none"
      style={{ touchAction: 'none' }}
    >
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-blue-100 to-purple-100 z-0" />
      
      {/* Interactive gradient overlay that follows cursor with enhanced movement */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-blue-200/20 via-purple-200/30 to-indigo-200/20 z-10 transition-all duration-300 ease-out"
        style={{
          transform: `translate(${cursorPosition.x * 0.02}px, ${cursorPosition.y * 0.02}px) scale(${1 + hoverIntensity * 0.05})`,
          opacity: 0.7 + hoverIntensity * 0.3,
          backgroundSize: `${200 + hoverIntensity * 50}% ${200 + hoverIntensity * 50}%`,
        }}
      />
      
      {/* Custom cursor effect */}
      <div
        className="pointer-events-none absolute z-50 rounded-full bg-white/30 shadow-inner shadow-white/50 mix-blend-overlay hidden md:block"
        style={{
          width: 40,
          height: 40,
          transform: `translate(${cursorPosition.x - 20}px, ${cursorPosition.y - 20}px)`,
          transition: 'transform 0.15s ease-out, opacity 0.3s ease',
          opacity: hoverIntensity,
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(255,255,255,0.3)'
        }}
      />
      
      {/* Enhanced ripple effects with varied colors */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full z-20 pointer-events-none"
          style={{
            left: ripple.x - ripple.size / 2,
            top: ripple.y - ripple.size / 2,
            width: ripple.size,
            height: ripple.size,
            opacity: ripple.opacity,
            background: ripple.color,
            transform: `scale(${1 + ripple.size * 0.005})`,
            transition: 'transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)'
          }}
        />
      ))}
      
      {/* Enhanced gradient overlays with more distinct patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_70%)] z-20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(79,70,229,0.15)_0%,rgba(79,70,229,0)_60%)] z-30" />
      
      {/* Dynamic pattern based on cursor position */}
      <div 
        className="absolute inset-0 opacity-10 z-25 transition-opacity duration-700"
        style={{
          backgroundImage: `radial-gradient(circle at ${cursorPosition.x}px ${cursorPosition.y}px, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) ${50 + hoverIntensity * 100}px)`,
          opacity: 0.1 + hoverIntensity * 0.2
        }}
      />
      
      {/* Subtle animated gradient shimmer */}
      <div className="absolute inset-0 opacity-20 z-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-[shimmer_3s_infinite] translate-x-[-100%]"></div>
      </div>
      
      {/* Content container with improved padding */}
      <div className="relative z-40 p-6 md:p-14">
        {children}
      </div>
    </div>
  );
}
