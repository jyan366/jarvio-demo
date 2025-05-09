
import React from "react";
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
  );
};
