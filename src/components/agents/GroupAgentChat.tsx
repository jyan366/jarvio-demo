
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, ChevronLeft, Users } from "lucide-react";
import { Agent, Message } from "./types";
import { AgentMessage } from "./AgentMessage";
import { agentsData } from "@/data/agentsData";

interface GroupAgentChatProps {
  onBack: () => void;
}

export function GroupAgentChat({ onBack }: GroupAgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "Jarvio",
      content: "Welcome to the group chat! All our specialist agents are here to help. What would you like to discuss today?",
      timestamp: new Date(),
      isUser: false
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: "You",
      content: inputValue,
      timestamp: new Date(),
      isUser: true
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    // Simulate response - choose a random agent to respond
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * agentsData.length);
      const respondingAgent = agentsData[randomIndex];
      
      const agentResponse: Message = {
        id: `agent-${Date.now()}`,
        sender: respondingAgent.name,
        content: generateAgentResponse(respondingAgent, inputValue),
        timestamp: new Date(),
        isUser: false,
        agentColor: respondingAgent.avatarColor
      };
      
      setMessages(prev => [...prev, agentResponse]);
      setIsLoading(false);
      
      // Sometimes add a follow-up from another agent
      if (Math.random() > 0.5) {
        setTimeout(() => {
          let secondAgentIndex = Math.floor(Math.random() * agentsData.length);
          // Make sure it's a different agent
          while (secondAgentIndex === randomIndex) {
            secondAgentIndex = Math.floor(Math.random() * agentsData.length);
          }
          const secondAgent = agentsData[secondAgentIndex];
          
          const followUpResponse: Message = {
            id: `agent-followup-${Date.now()}`,
            sender: secondAgent.name,
            content: generateFollowUpResponse(secondAgent, respondingAgent),
            timestamp: new Date(),
            isUser: false,
            agentColor: secondAgent.avatarColor
          };
          
          setMessages(prev => [...prev, followUpResponse]);
        }, 2000);
      }
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) {
        handleSendMessage();
      }
    }
  };

  // Simple response generator based on agent's domain
  const generateAgentResponse = (agent: Agent, message: string): string => {
    const domains = {
      "Analytics": "Looking at your analytics data, I can see some interesting trends related to this question.",
      "Inventory": "From an inventory perspective, I can offer some insights on this topic.",
      "Listings": "Let me help optimize how you present this in your listings.",
      "Customer Insights": "Based on customer feedback patterns, I can tell you that...",
      "Competitor Insights": "I've been monitoring the competitive landscape and can share that...",
      "Advertising": "From an advertising point of view, here's what I recommend..."
    };
    
    return `${domains[agent.domain as keyof typeof domains] || `As your ${agent.domain} specialist, I can help with this.`} ${agent.description.split('.')[0]}.`;
  };
  
  // Generate a follow-up response from another agent
  const generateFollowUpResponse = (followUpAgent: Agent, firstAgent: Agent): string => {
    return `Building on what ${firstAgent.name} said, I can add some ${followUpAgent.domain.toLowerCase()} perspective. ${followUpAgent.description.split('.')[0]}.`;
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <div className="py-3 px-4 border-b flex items-center gap-3 bg-white">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-1">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold bg-[#9b87f5]"
        >
          <Users className="h-4 w-4" />
        </div>
        <div>
          <h2 className="font-semibold">Agent Group Chat</h2>
          <p className="text-xs text-muted-foreground">All specialists in one conversation</p>
        </div>
      </div>
      
      {/* Messages container with scroll */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pb-[76px]">
          <div className="p-4">
            {messages.map(message => (
              <AgentMessage 
                key={message.id} 
                message={message} 
                agentColor={!message.isUser ? message.agentColor : undefined}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Fixed input at bottom */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white shadow-md" style={{ width: 'inherit' }}>
        <form 
          onSubmit={handleSendMessage}
          className="flex gap-2 items-end p-3"
        >
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isLoading ? "Agents are thinking..." : "Message the agent team..."}
            className="flex-1 min-h-[36px] max-h-24 resize-none"
            disabled={isLoading}
            ref={inputRef}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <Button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
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
