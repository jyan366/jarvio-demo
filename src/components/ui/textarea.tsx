
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, onChange, ...props }, ref) => {
    // Create a local ref if no ref is provided
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    
    // Enhanced function to adjust height based on content
    const adjustHeight = (element: HTMLTextAreaElement) => {
      // Reset height to auto to get the correct scrollHeight
      element.style.height = 'auto';
      // Set the height to match the scrollHeight with extra padding to ensure all text is visible
      element.style.height = `${element.scrollHeight + 20}px`;  // Increased padding from 12px to 20px
    };
    
    // Handle onChange to adjust height
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e);
      }
      adjustHeight(e.target);
    };
    
    // Set initial height after mounting and whenever value changes
    React.useEffect(() => {
      const textarea = ref ? (ref as React.RefObject<HTMLTextAreaElement>).current : textareaRef.current;
      if (textarea) {
        // Immediate adjustment attempt
        adjustHeight(textarea);
        
        // Multiple adjustment attempts with increasing delays to ensure proper rendering
        const timeouts = [10, 50, 200, 500, 1000].map(delay => // Added a longer 1000ms timeout
          setTimeout(() => {
            if (textarea) adjustHeight(textarea);
          }, delay)
        );
        
        // Cleanup timeouts on unmount or value change
        return () => {
          timeouts.forEach(timeout => clearTimeout(timeout));
        };
      }
    }, [props.value, ref]);
    
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 whitespace-pre-wrap break-words overflow-wrap-break-word",
          className
        )}
        onChange={handleChange}
        ref={ref || textareaRef}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
