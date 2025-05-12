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
  const [flowStarted, setFlowStarted] = useState<boolean>(false);
  const [autoRunning, setAutoRunning] = useState<boolean>(false);
  const { 
    messages, 
    subtasks, 
    currentSubtaskIndex, 
    addUserMessage, 
    addAgentMessage, 
    executeNextStep 
  } = useSampleMessages();

  // Set up initial greeting
  useEffect(() => {
    if (!flowStarted && messages.length === 0) {
      setTimeout(() => {
        addAgentMessage(
          "Hi there! I'm Jarvio, your AI assistant. I can help you with your Listing Launch Strategy for Amazon products. Would you like me to walk you through the process?"
        );
      }, 500);
    }
  }, [flowStarted, messages, addAgentMessage]);
  
  // Auto-run next steps
  useEffect(() => {
    let timer: number;
    
    if (flowStarted && autoRunning && !isLoading) {
      // Check if we have more steps to execute
      if (currentSubtaskIndex < subtasks.length && !subtasks[currentSubtaskIndex].done) {
        timer = window.setTimeout(() => {
          executeNextStep();
        }, 2000);
      } else {
        setAutoRunning(false);
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [flowStarted, autoRunning, isLoading, currentSubtaskIndex, subtasks, executeNextStep]);

  // Handle user message submission
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    setIsLoading(true);
    
    // Add user message to the chat
    addUserMessage(inputValue);
    
    // Check for flow start trigger
    const userInput = inputValue.toLowerCase();
    setInputValue("");
    
    // Respond based on user's message
    setTimeout(() => {
      if (!flowStarted && (userInput.includes("yes") || userInput.includes("start") || userInput.includes("begin") || 
                          userInput.includes("go") || userInput.includes("do it"))) {
        setFlowStarted(true);
        setAutoRunning(true);  // Start automatic progression
        addAgentMessage("Great! Let me walk you through our Listing Launch Strategy flow. I'll analyze your market, optimize your listing, set up pricing, configure advertising, and create a launch schedule.");
        
        setTimeout(() => {
          executeNextStep();
        }, 1500);
      } else if (flowStarted) {
        // Continue with flow if already started
        setTimeout(() => {
          executeNextStep();
          setAutoRunning(true);  // Resume auto-run if it was paused
        }, 1500);
      } else {
        // Generic response for other inputs
        addAgentMessage("I'm here to help with your Listing Launch Strategy. Just let me know when you're ready to begin, and we'll get started with the process.");
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  // Navigate between chat and log tabs
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };
  
  // Handle clicking on a step to view its data
  const handleStepClick = (stepIndex: number) => {
    setActiveTab("log");
  };
  
  return (
    <div className="h-full flex flex-col bg-[#fcfbf8]">
      <AgentHeader 
        currentStep={currentSubtaskIndex + 1} 
        totalSteps={subtasks.length}
        stepTitle={subtasks[currentSubtaskIndex]?.title || ""}
      />
      
      <AgentTabs activeTab={activeTab} onTabChange={handleTabChange} />
      
      {activeTab === "chat" ? (
        <>
          <AgentMessageArea 
            messages={messages} 
            subtasks={subtasks}
            activeSubtaskIndex={currentSubtaskIndex}
            onStepClick={handleStepClick}
          />
          
          <AgentInputArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSubmit={handleSendMessage}
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
