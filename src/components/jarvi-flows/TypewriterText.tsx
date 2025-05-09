
import React, { useState, useEffect } from 'react';

// Props for the TypewriterText component
interface TypewriterTextProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export function TypewriterText({
  texts,
  typingSpeed = 40, // Faster typing speed (was 80)
  deletingSpeed = 30, // Faster deleting (was 50)
  pauseDuration = 1200, // Slightly shorter pause (was 1500)
  className = ""
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    // Handle typing animation
    if (isTyping && !isPaused) {
      const currentText = texts[currentIndex];
      
      if (displayText.length < currentText.length) {
        // Continue typing characters
        timeout = setTimeout(() => {
          setDisplayText(currentText.substring(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing, pause before deleting
        timeout = setTimeout(() => {
          setIsPaused(false);
          setIsTyping(false);
        }, pauseDuration);
        setIsPaused(true);
      }
    } 
    // Handle deleting animation
    else if (!isTyping && !isPaused) {
      if (displayText.length > 0) {
        // Continue deleting characters
        timeout = setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        // Finished deleting, move to next text and start typing again
        const nextIndex = (currentIndex + 1) % texts.length;
        setCurrentIndex(nextIndex);
        setIsTyping(true);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, isPaused, currentIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return <span className={className}>{displayText}<span className="animate-pulse">|</span></span>;
}
