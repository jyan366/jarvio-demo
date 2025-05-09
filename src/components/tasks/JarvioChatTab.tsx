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
  
  // State for format menu
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [commandActive, setCommandActive] = useState<"slash" | "at" | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuType, setMenuType] = useState<"blocks" | "agents">("blocks");

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
    // Slash key to open blocks menu
    if (e.key === '/' && !formatMenuOpen && !commandActive) {
      // Only activate if at the start of a line
      const cursorPosition = inputRef.current?.selectionStart || 0;
      const textBeforeCursor = inputValue.substring(0, cursorPosition);
      const lastNewLineIndex = textBeforeCursor.lastIndexOf('\n');
      const currentLineText = textBeforeCursor.substring(lastNewLineIndex + 1);
      
      if (currentLineText === '') {
        e.preventDefault(); // Prevent typing the slash
        setFormatMenuOpen(true);
        setCommandActive("slash");
        setSearchValue('');
        setMenuType("blocks");
      }
    }
    
    // @ key to open agents menu
    if (e.key === '@' && !formatMenuOpen && !commandActive) {
      e.preventDefault(); // Prevent typing the @
      setFormatMenuOpen(true);
      setCommandActive("at");
      setSearchValue('');
      setMenuType("agents");
    }
    
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
      setCommandActive(null);
    }
  };

  // Handle input change to detect commands
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Check for slash command
    if (!commandActive && value.endsWith('/')) {
      // Check if the slash is at the start of a line
      const lastNewLineIndex = value.lastIndexOf('\n', value.length - 2);
      const currentLine = value.substring(lastNewLineIndex + 1);
      
      if (currentLine === '/') {
        setFormatMenuOpen(true);
        setCommandActive("slash");
        setSearchValue('');
        setMenuType("blocks");
      }
    } 
    // Check for at command
    else if (!commandActive && value.endsWith('@')) {
      setFormatMenuOpen(true);
      setCommandActive("at");
      setSearchValue('');
      setMenuType("agents");
    } 
    // If command is active, update search term
    else if (commandActive === "slash") {
      const lastNewLineIndex = value.lastIndexOf('\n');
      const currentLine = value.substring(lastNewLineIndex + 1);
      
      if (currentLine.startsWith('/')) {
        const searchTerm = currentLine.substring(1);
        setSearchValue(searchTerm);
      } else {
        // Close menu if the slash is deleted
        setFormatMenuOpen(false);
        setCommandActive(null);
      }
    }
    else if (commandActive === "at") {
      const atIndex = value.lastIndexOf('@');
      if (atIndex !== -1) {
        const searchTerm = value.substring(atIndex + 1);
        setSearchValue(searchTerm);
      } else {
        // Close menu if the @ is deleted
        setFormatMenuOpen(false);
        setCommandActive(null);
      }
    }
  };

  const handleFormatSelect = (formatText: string) => {
    if (inputRef.current) {
      // If slash command is active, replace the slash with the format
      if (commandActive === "slash") {
        const lastNewLineIndex = inputValue.lastIndexOf('\n') + 1;
        const slashIndex = inputValue.indexOf('/', lastNewLineIndex);
        
        if (slashIndex !== -1) {
          const beforeSlash = inputValue.substring(0, slashIndex);
          const afterSlashCommand = inputValue.substring(slashIndex + 1 + searchValue.length);
          
          setInputValue(beforeSlash + formatText + " " + afterSlashCommand);
          
          // Set cursor position after the inserted format
          setTimeout(() => {
            if (inputRef.current) {
              const newCursorPosition = beforeSlash.length + formatText.length + 1; // +1 for the space
              inputRef.current.focus();
              inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
            }
          }, 0);
        }
      } 
      // If at command is active, replace the @ with the format
      else if (commandActive === "at") {
        const atIndex = inputValue.lastIndexOf('@');
        
        if (atIndex !== -1) {
          const beforeAt = inputValue.substring(0, atIndex);
          const afterAtCommand = inputValue.substring(atIndex + 1 + searchValue.length);
          
          setInputValue(beforeAt + formatText + " " + afterAtCommand);
          
          // Set cursor position after the inserted format
          setTimeout(() => {
            if (inputRef.current) {
              const newCursorPosition = beforeAt.length + formatText.length + 1; // +1 for the space
              inputRef.current.focus();
              inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
            }
          }, 0);
        }
      }
      // Otherwise insert format at cursor position
      else {
        const cursorPosition = inputRef.current.selectionStart || 0;
        const beforeCursor = inputValue.substring(0, cursorPosition);
        const afterCursor = inputValue.substring(cursorPosition);
        
        setInputValue(beforeCursor + formatText + " " + afterCursor);
        
        // Set cursor position after the inserted format
        setTimeout(() => {
          if (inputRef.current) {
            const newCursorPosition = cursorPosition + formatText.length + 1; // +1 for the space
            inputRef.current.focus();
            inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          }
        }, 0);
      }
      
      // Reset states
      setFormatMenuOpen(false);
      setCommandActive(null);
      setSearchValue('');
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
          <div className="absolute bottom-full mb-2" style={{ left: '50%', transform: 'translateX(-50%)' }}>
            <div ref={triggerRef} className="w-1 h-1" />
          </div>
          
          {/* Format menu popover */}
          <JarvioFormatMenu
            open={formatMenuOpen}
            setOpen={setFormatMenuOpen}
            onFormatSelect={handleFormatSelect}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            triggerRef={triggerRef}
            menuType={menuType}
          />
          
          <Textarea
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={isLoading ? "Jarvio is thinking..." : "Type / for blocks, @ for agents..."}
            className="flex-1 min-h-[36px] max-h-24 resize-none"
            disabled={isLoading || isTransitioning}
            ref={inputRef}
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
