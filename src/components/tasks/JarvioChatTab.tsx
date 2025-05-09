import React, { useRef, useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { JarvioChatMessages } from "./JarvioChatMessages";
import { JarvioFormatMenu } from "./JarvioFormatMenu";
import { Subtask } from "@/pages/TaskWorkContainer";
import { toast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface JarvioChatTabProps {
  messages: any[];
  subtasks: Subtask[];
  activeSubtaskIdx: number;
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  isTransitioning: boolean;
  onSendMessage: (e?: React.FormEvent, autoMessage?: string) => void;
  onGenerateSteps?: () => void;
}

export const JarvioChatTab: React.FC<JarvioChatTabProps> = ({
  messages,
  subtasks,
  activeSubtaskIdx,
  inputValue,
  setInputValue,
  isLoading,
  isTransitioning,
  onSendMessage,
  onGenerateSteps,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  
  // State for format menu
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [slashCommandActive, setSlashCommandActive] = useState(false);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Focus input when loading completes
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);
  
  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Enter key for send message
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading && !isTransitioning && !formatMenuOpen) {
        onSendMessage();
      }
    }
    
    // Escape key to close format menu
    if (e.key === 'Escape' && formatMenuOpen) {
      setFormatMenuOpen(false);
      setSearchValue('');
      setSlashCommandActive(false);
    }
  };

  // Handle input change to detect slash command
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Check if the last character is a slash and not preceded by any text on the same line
    const lastNewLineIndex = value.lastIndexOf('\n');
    const currentLine = value.slice(lastNewLineIndex + 1);
    
    if (currentLine === '/' && !slashCommandActive) {
      setFormatMenuOpen(true);
      setSlashCommandActive(true);
      setSearchValue('');
    } else if (slashCommandActive) {
      // If slash command is active, update search term (remove the slash)
      const searchTerm = currentLine.substring(1);
      setSearchValue(searchTerm);
      
      // Close menu if the slash is deleted
      if (!currentLine.startsWith('/')) {
        setFormatMenuOpen(false);
        setSlashCommandActive(false);
      }
    }
  };

  const handleFormatSelect = (formatText: string) => {
    if (inputRef.current) {
      const cursorPosition = inputRef.current.selectionStart || 0;
      
      // If slash command is active, replace the slash with the format
      if (slashCommandActive) {
        const lastNewLineIndex = inputValue.lastIndexOf('\n', cursorPosition - 1) + 1;
        const beforeSlash = inputValue.substring(0, lastNewLineIndex);
        const afterSlash = inputValue.substring(cursorPosition);
        
        setInputValue(beforeSlash + formatText + afterSlash);
      } else {
        // Otherwise insert format at cursor position or append to end
        const start = cursorPosition;
        const end = inputRef.current.selectionEnd || 0;
        
        const newValue = 
          inputValue.substring(0, start) + 
          formatText + 
          inputValue.substring(end);
        
        setInputValue(newValue);
      }
      
      // Reset states
      setSlashCommandActive(false);
      
      // Focus back on the textarea after inserting format
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col relative overflow-hidden">
      {/* Messages container with scroll */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pb-[76px]">
          <div className="p-4">
            <JarvioChatMessages 
              messages={messages}
              subtasks={subtasks}
              activeSubtaskIdx={activeSubtaskIdx}
              onGenerateSteps={onGenerateSteps}
            />
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input area at bottom */}
      <div className="border-t bg-white shadow-md">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (inputValue.trim() && !isLoading && !isTransitioning) {
              onSendMessage(e);
            } else if (!inputValue.trim()) {
              toast({
                title: "Can't send empty message",
                description: "Please type a message first"
              });
            }
          }} 
          className="flex gap-2 items-end p-3 relative"
        >
          <JarvioFormatMenu
            open={formatMenuOpen}
            setOpen={setFormatMenuOpen}
            onFormatSelect={handleFormatSelect}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            triggerRef={triggerRef}
          />
          
          <div ref={triggerRef} className="hidden" />
          
          <Textarea
            value={inputValue}
            onChange={handleInputChange}
            placeholder={isLoading ? "Jarvio is thinking..." : "Type / for commands..."}
            className="flex-1 min-h-[36px] max-h-24 resize-none"
            disabled={isLoading || isTransitioning}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading || isTransitioning || formatMenuOpen}
            className="self-end rounded-full"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
