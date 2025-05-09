
import React, { useState, useEffect } from 'react';

// Sample prompt suggestions
const PROMPTS = [
  "Create a flow for weekly product review analysis...",
  "Build an automated inventory restock process...",
  "Set up a competitor price monitoring workflow...",
  "Design a customer feedback analysis system...",
  "Generate a monthly sales performance report..."
];

// Duration settings (in milliseconds)
const TYPING_SPEED = 35;  // Time per character
const DELETION_SPEED = 15; // Time per character when deleting
const PAUSE_DURATION = 1500; // Time to pause after typing

export function TypedPrompts() {
  const [currentText, setCurrentText] = useState("");
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);

  // Typing and deletion effect
  useEffect(() => {
    const currentPrompt = PROMPTS[currentPromptIndex];
    
    if (isTyping) {
      // Still typing the current prompt
      if (currentText.length < currentPrompt.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentPrompt.slice(0, currentText.length + 1));
        }, TYPING_SPEED);
        return () => clearTimeout(timeout);
      } 
      // Finished typing, pause before deletion
      else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, PAUSE_DURATION);
        return () => clearTimeout(timeout);
      }
    } else {
      // Still deleting
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, DELETION_SPEED);
        return () => clearTimeout(timeout);
      } 
      // Finished deleting, move to next prompt
      else {
        setCurrentPromptIndex((currentPromptIndex + 1) % PROMPTS.length);
        setIsTyping(true);
        return undefined;
      }
    }
  }, [currentText, currentPromptIndex, isTyping]);

  return (
    <div className="relative h-14 flex items-center">
      <div className="text-lg sm:text-xl bg-white bg-opacity-[0.15] backdrop-blur px-4 py-3 rounded-lg w-full max-w-3xl">
        <span className="text-gray-800">{currentText}</span>
        <span className={`ml-0.5 inline-block h-5 w-0.5 ${cursorVisible ? 'bg-gray-800' : 'bg-transparent'} transition-colors`}></span>
      </div>
    </div>
  );
}
