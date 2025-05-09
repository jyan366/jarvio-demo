
import { useState, useRef } from "react";
import { MenuItemType } from "../JarvioMenuTypes";

export function useFormatMenuState() {
  // State for format menu
  const [formatMenuOpen, setFormatMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [commandActive, setCommandActive] = useState<"slash" | "at" | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const [menuType, setMenuType] = useState<MenuItemType>("blocks");
  
  // Simple function to handle format selection and insert into textarea
  const handleFormatSelect = (
    formatText: string, 
    inputValue: string, 
    setInputValue: (value: string) => void,
    inputRef: React.RefObject<HTMLTextAreaElement>
  ) => {
    if (!inputRef.current) return;
    
    const textarea = inputRef.current;
    const cursorPosition = textarea.selectionStart || 0;
    
    // Format the text based on menu type
    let textToInsert = formatText;
    if (menuType === "blocks") {
      textToInsert = `**${formatText}**`;
    }
    
    let newValue = "";
    let newCursorPosition = 0;
    
    // Logic for handling slash command replacement
    if (commandActive === "slash") {
      // Find the last newline before cursor
      const lastNewline = inputValue.lastIndexOf('\n', cursorPosition - 1) + 1;
      
      // Find the position of the slash that started this command
      const slashPosition = inputValue.indexOf('/', lastNewline);
      
      if (slashPosition !== -1 && slashPosition < cursorPosition) {
        // Replace everything from the slash to the cursor with the formatted text
        const beforeSlash = inputValue.substring(0, slashPosition);
        const afterCursor = inputValue.substring(cursorPosition);
        
        newValue = beforeSlash + textToInsert + " " + afterCursor;
        newCursorPosition = beforeSlash.length + textToInsert.length + 1; // +1 for the space
      } else {
        // Fallback - just insert at cursor
        const beforeCursor = inputValue.substring(0, cursorPosition);
        const afterCursor = inputValue.substring(cursorPosition);
        
        newValue = beforeCursor + textToInsert + " " + afterCursor;
        newCursorPosition = cursorPosition + textToInsert.length + 1;
      }
    }
    // Logic for handling @ command replacement
    else if (commandActive === "at") {
      // Find the position of the @ that started this command
      const atPosition = inputValue.lastIndexOf('@', cursorPosition);
      
      if (atPosition !== -1 && atPosition < cursorPosition) {
        // Replace everything from the @ to the cursor with the formatted text
        const beforeAt = inputValue.substring(0, atPosition);
        const afterCursor = inputValue.substring(cursorPosition);
        
        newValue = beforeAt + textToInsert + " " + afterCursor;
        newCursorPosition = beforeAt.length + textToInsert.length + 1; // +1 for the space
      } else {
        // Fallback - just insert at cursor
        const beforeCursor = inputValue.substring(0, cursorPosition);
        const afterCursor = inputValue.substring(cursorPosition);
        
        newValue = beforeCursor + textToInsert + " " + afterCursor;
        newCursorPosition = cursorPosition + textToInsert.length + 1;
      }
    }
    // Normal insertion at cursor position
    else {
      const beforeCursor = inputValue.substring(0, cursorPosition);
      const afterCursor = inputValue.substring(cursorPosition);
      
      newValue = beforeCursor + textToInsert + " " + afterCursor;
      newCursorPosition = cursorPosition + textToInsert.length + 1;
    }
    
    // Update the textarea value
    setInputValue(newValue);
    
    // Set cursor position after the inserted text
    setTimeout(() => {
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
    
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
