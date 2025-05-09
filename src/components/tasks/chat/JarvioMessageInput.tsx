
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { MenuItemType } from "../JarvioMenuTypes";

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
  // State for formatted display of text
  const [formattedDisplay, setFormattedDisplay] = useState<string>("");
  
  // Format text for display
  useEffect(() => {
    // Apply bold formatting
    const formatted = inputValue.replace(/\*\*([\s\S]*?)\*\*/g, '<strong>$1</strong>');
    setFormattedDisplay(formatted);
  }, [inputValue]);

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
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

  // Handle input change to detect commands
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
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
      
      <div className="flex-1 relative">
        {/* Real textarea for input handling - now fully transparent but still interactive */}
        <Textarea
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isLoading ? "Jarvio is thinking..." : "Type / for blocks, @ for agents..."}
          className="flex-1 min-h-[36px] max-h-24 resize-none absolute inset-0 z-20 opacity-0"
          disabled={isLoading || isTransitioning}
          ref={inputRef}
          rows={1}
          style={{ caretColor: 'transparent' }} // Hide the cursor in the invisible textarea
        />
        
        {/* Formatted display div that shows the styled text */}
        <div 
          className="flex-1 min-h-[36px] max-h-24 resize-none border border-input bg-background px-3 py-2 text-sm rounded-md overflow-y-auto whitespace-pre-wrap pointer-events-none"
          dangerouslySetInnerHTML={{ 
            __html: formattedDisplay || 
              '<span class="text-muted-foreground">' + 
              (isLoading ? "Jarvio is thinking..." : "Type / for blocks, @ for agents...") + 
              '</span>' 
          }}
        />
        
        {/* Add a blinking cursor effect at the end of the text */}
        {!isLoading && !isTransitioning && 
          <div className="absolute right-3 top-2 h-4 w-0.5 bg-black animate-blink"></div>
        }
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
