import { useState, useRef } from "react";
import { MenuItemType } from "../JarvioMenuTypes";

export function useFormatMenuState() {
  // State for format menu
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [commandActive, setCommandActive] = useState<"slash" | "at" | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuType, setMenuType] = useState<MenuItemType>("blocks");
  
  // Function to handle format selection and insert into textarea
  const handleFormatSelect = (
    formatText: string, 
    inputValue: string, 
    setInputValue: (value: string) => void,
    inputRef: React.RefObject<HTMLTextAreaElement>
  ) => {
    if (!inputRef.current) return;
    
    // Get current cursor position
    const cursorPosition = inputRef.current.selectionStart || 0;
    
    // Insert the formatted text (with bold formatting for blocks)
    let formattedText = formatText;
    if (menuType === "blocks") {
      formattedText = `**${formatText}**`;
    }
    
    // If slash command is active, replace the slash + search term with the format
    if (commandActive === "slash") {
      const lastNewLineIndex = inputValue.lastIndexOf('\n') + 1;
      const slashIndex = inputValue.indexOf('/', lastNewLineIndex);
      
      if (slashIndex !== -1) {
        const beforeSlash = inputValue.substring(0, slashIndex);
        const afterSlashCommand = inputValue.substring(slashIndex + 1 + searchValue.length);
        
        // Create the new value with the format inserted
        const newValue = beforeSlash + formattedText + " " + afterSlashCommand;
        setInputValue(newValue);
        
        // Set cursor position after the inserted format
        setTimeout(() => {
          if (inputRef.current) {
            const newCursorPosition = beforeSlash.length + formattedText.length + 1; // +1 for the space
            inputRef.current.focus();
            inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          }
        }, 0);
      }
    } 
    // If at command is active, replace the @ + search term with the format
    else if (commandActive === "at") {
      const atIndex = inputValue.lastIndexOf('@');
      
      if (atIndex !== -1) {
        const beforeAt = inputValue.substring(0, atIndex);
        const afterAtCommand = inputValue.substring(atIndex + 1 + searchValue.length);
        
        // Create the new value with the format inserted
        const newValue = beforeAt + formattedText + " " + afterAtCommand;
        setInputValue(newValue);
        
        // Set cursor position after the inserted format
        setTimeout(() => {
          if (inputRef.current) {
            const newCursorPosition = beforeAt.length + formattedText.length + 1; // +1 for the space
            inputRef.current.focus();
            inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          }
        }, 0);
      }
    }
    // Otherwise insert format at cursor position
    else {
      const beforeCursor = inputValue.substring(0, cursorPosition);
      const afterCursor = inputValue.substring(cursorPosition);
      
      // Create the new value with the format inserted at cursor
      const newValue = beforeCursor + formattedText + " " + afterCursor;
      setInputValue(newValue);
      
      // Set cursor position after the inserted format
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPosition = cursorPosition + formattedText.length + 1; // +1 for the space
          inputRef.current.focus();
          inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      }, 0);
    }
    
    // Reset states
    setFormatMenuOpen(false);
    setCommandActive(null);
    setSearchValue('');
  };

  return {
    formatMenuOpen,
    setFormatMenuOpen,
    searchValue, 
    setSearchValue,
    commandActive,
    setCommandActive,
    triggerRef,
    menuType,
    setMenuType,
    handleFormatSelect
  };
}
