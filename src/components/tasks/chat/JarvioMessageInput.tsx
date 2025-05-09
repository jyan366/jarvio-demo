
import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MenuItemType } from "../JarvioMenuTypes";
import { agentsData } from "@/data/agentsData";

interface JarvioMessageInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  isLoading: boolean;
  isTransitioning: boolean;
  onSendMessage: (e?: React.FormEvent) => void;
  formatMenuOpen: boolean;
  setFormatMenuOpen: (open: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  commandActive: "slash" | "at" | null;
  setCommandActive: (command: "slash" | "at" | null) => void;
  triggerRef: React.RefObject<HTMLDivElement>;
  menuType: MenuItemType;
  setMenuType: (type: MenuItemType) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
}

export const JarvioMessageInput: React.FC<JarvioMessageInputProps> = ({
  inputValue,
  setInputValue,
  isLoading,
  isTransitioning,
  onSendMessage,
  formatMenuOpen,
  setFormatMenuOpen,
  searchValue,
  setSearchValue,
  commandActive,
  setCommandActive,
  triggerRef,
  menuType,
  setMenuType,
  inputRef
}) => {
  // Ref for tracking cursor position and text selection
  const displayRef = useRef<HTMLDivElement>(null);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [isFocused, setIsFocused] = useState(false);

  // Format text for display
  const getFormattedText = (text: string) => {
    if (!text) return '';
    
    let formattedText = text;
    
    // Process bold text
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Process agent mentions
    agentsData.forEach(agent => {
      const pattern = new RegExp(`@${agent.name}`, 'g');
      formattedText = formattedText.replace(
        pattern, 
        `<span style="color:${agent.avatarColor || '#9b87f5'};font-weight:bold;">@${agent.name}</span>`
      );
    });
    
    return formattedText;
  };

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Store selection range on any key activity
    if (inputRef.current) {
      setSelectionStart(inputRef.current.selectionStart || 0);
      setSelectionEnd(inputRef.current.selectionEnd || 0);
    }

    // Slash key to open blocks menu
    if (e.key === '/' && !formatMenuOpen && !commandActive) {
      e.preventDefault(); // Prevent typing the slash
      setFormatMenuOpen(true);
      setCommandActive("slash");
      setSearchValue('');
      setMenuType("blocks");
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

  // Handle input change to detect commands and update selection position
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Store current cursor position and selection
    if (e.target) {
      setSelectionStart(e.target.selectionStart || 0);
      setSelectionEnd(e.target.selectionEnd || 0);
    }
    
    // Check for slash command - triggers anywhere
    if (!commandActive && value.endsWith('/')) {
      setFormatMenuOpen(true);
      setCommandActive("slash");
      setSearchValue('');
      setMenuType("blocks");
    } 
    // Check for at command - triggers anywhere
    else if (!commandActive && value.endsWith('@')) {
      setFormatMenuOpen(true);
      setCommandActive("at");
      setSearchValue('');
      setMenuType("agents");
    } 
    // If command is active, update search term
    else if (commandActive === "slash") {
      const lastSlashIndex = value.lastIndexOf('/');
      if (lastSlashIndex !== -1 && lastSlashIndex < value.length - 1) {
        const searchTerm = value.substring(lastSlashIndex + 1);
        setSearchValue(searchTerm);
      } else if (lastSlashIndex === -1) {
        // Close menu if the slash is deleted
        setFormatMenuOpen(false);
        setCommandActive(null);
      }
    }
    else if (commandActive === "at") {
      const atIndex = value.lastIndexOf('@');
      if (atIndex !== -1 && atIndex < value.length - 1) {
        const searchTerm = value.substring(atIndex + 1);
        setSearchValue(searchTerm);
      } else if (atIndex === -1) {
        // Close menu if the @ is deleted
        setFormatMenuOpen(false);
        setCommandActive(null);
      }
    }
  };

  // Set cursor position and focus
  useEffect(() => {
    if (inputRef.current && isFocused) {
      inputRef.current.selectionStart = selectionStart;
      inputRef.current.selectionEnd = selectionEnd;
    }
  }, [selectionStart, selectionEnd, isFocused]);

  const placeholderText = isLoading ? "Jarvio is thinking..." : "Type / for blocks, @ for agents...";

  return (
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
      
      <div className="flex-1 relative min-h-[42px] max-h-24">
        {/* Actual interactive textarea - set to transparent but maintaining interaction */}
        <Textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholderText}
          className="absolute inset-0 resize-none bg-transparent border-0 z-10 text-base"
          style={{ 
            color: 'transparent', 
            caretColor: '#000', 
            height: displayRef.current?.scrollHeight + 'px',
            fontFamily: 'inherit',
            minHeight: '42px'
          }}
          disabled={isLoading || isTransitioning}
          ref={inputRef}
          rows={1}
        />
        
        {/* Visual representation of formatted text */}
        <div
          ref={displayRef}
          className={`flex-1 min-h-[42px] max-h-24 overflow-auto p-2 border rounded-md bg-background text-base ${isFocused ? 'border-primary' : 'border-input'}`}
          style={{ 
            whiteSpace: 'pre-wrap', 
            wordBreak: 'break-word',
            minHeight: '42px',
            pointerEvents: 'none'
          }}
        >
          {inputValue ? (
            <div dangerouslySetInnerHTML={{ __html: getFormattedText(inputValue) }} />
          ) : (
            <span className="text-muted-foreground pointer-events-none select-none">
              {placeholderText}
            </span>
          )}
        </div>
      </div>
      
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
  );
};
