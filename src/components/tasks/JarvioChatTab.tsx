
import React, { useRef, useEffect } from "react";
import { Subtask } from "@/pages/TaskWorkContainer";
import { JarvioFormatMenu } from "./JarvioFormatMenu";
import { JarvioMessageArea } from "./chat/JarvioMessageArea";
import { JarvioMessageInput } from "./chat/JarvioMessageInput";
import { useFormatMenuState } from "./hooks/useFormatMenuState";

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
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const {
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
  } = useFormatMenuState();

  // Focus input when loading completes
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading]);

  // Format selection handler
  const onFormatSelect = (formatText: string) => {
    handleFormatSelect(formatText, inputValue, setInputValue, inputRef);
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col relative overflow-hidden">
      {/* Messages container with scroll */}
      <JarvioMessageArea 
        messages={messages}
        subtasks={subtasks}
        activeSubtaskIdx={activeSubtaskIdx}
        onGenerateSteps={onGenerateSteps}
      />

      {/* Input area at bottom */}
      <div className="border-t bg-white shadow-md">
        {/* Format menu popover */}
        <JarvioFormatMenu
          open={formatMenuOpen}
          setOpen={setFormatMenuOpen}
          onFormatSelect={onFormatSelect}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          triggerRef={triggerRef}
          menuType={menuType}
        />
        
        <JarvioMessageInput 
          inputValue={inputValue}
          setInputValue={setInputValue}
          isLoading={isLoading}
          isTransitioning={isTransitioning}
          onSendMessage={onSendMessage}
          formatMenuOpen={formatMenuOpen}
          setFormatMenuOpen={setFormatMenuOpen}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          commandActive={commandActive}
          setCommandActive={setCommandActive}
          triggerRef={triggerRef}
          menuType={menuType}
          setMenuType={setMenuType}
          inputRef={inputRef}
        />
      </div>
    </div>
  );
}
