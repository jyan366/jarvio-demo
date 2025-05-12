
import React, { useState, useEffect } from "react";
import { AgentMessageArea } from "./AgentMessageArea";
import { AgentInputArea } from "./AgentInputArea";
import { AgentHeader } from "./AgentHeader";
import { AgentTabs } from "./AgentTabs";
import { AgentDataLogTab } from "./AgentDataLogTab";
import { useSampleMessages } from "./hooks/useSampleMessages";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isLoading?: boolean;
  isStepCompletion?: boolean;
  stepNumber?: number;
}

export interface Subtask {
  id: string;
  title: string;
  done: boolean;
}

type TabType = "chat" | "log";

export function AgentChatInterface() {
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const { messages, subtasks, currentSubtaskIndex, addUserMessage, executeNextStep } = useSampleMessages();

  // Handle user message submission
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    setIsLoading(true);
    
    // Add user message to the chat
    addUserMessage(inputValue);
    setInputValue("");
    
    // Simulate agent response after a delay
    setTimeout(() => {
      executeNextStep();
      setIsLoading(false);
    }, 1500);
  };

  // Handle flow execution
  const handleRunFlow = () => {
    setIsLoading(true);
    executeNextStep();
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };
  
  return (
    <div className="h-full flex flex-col bg-[#F9F8FF]">
      <AgentHeader 
        currentStep={currentSubtaskIndex + 1} 
        totalSteps={subtasks.length}
        stepTitle={subtasks[currentSubtaskIndex]?.title || ""}
      />
      
      <AgentTabs activeTab={activeTab} onTabChange={setActiveTab} />
      
      {activeTab === "chat" ? (
        <>
          <AgentMessageArea 
            messages={messages} 
            subtasks={subtasks}
            activeSubtaskIndex={currentSubtaskIndex}
          />
          
          <AgentInputArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSubmit={handleSendMessage}
            onRunFlow={handleRunFlow}
            disabled={isLoading}
          />
        </>
      ) : (
        <AgentDataLogTab 
          subtasks={subtasks}
          activeSubtaskIndex={currentSubtaskIndex}
        />
      )}
    </div>
  );
}
