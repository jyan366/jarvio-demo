
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, ChevronLeft } from "lucide-react";
import { Agent, Message } from "./types";
import { AgentMessage } from "./AgentMessage";

interface AgentChatProps {
  agent: Agent;
  onBack: () => void;
}

export function AgentChat({ agent, onBack }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: agent.name,
      content: `Hello! I'm ${agent.name}, your ${agent.domain.toLowerCase()} specialist. ${agent.description} How can I help you today?`,
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
    
    // Simulate agent response
    setTimeout(() => {
      const agentResponse: Message = {
        id: `agent-${Date.now()}`,
        sender: agent.name,
        content: generateAgentResponse(agent, inputValue),
        timestamp: new Date(),
        isUser: false
      };
      
      setMessages(prev => [...prev, agentResponse]);
      setIsLoading(false);
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
      "Analytics": "Based on your analytics data, I can see some interesting trends. Your conversion rate has improved by 12% this month, and there's a notable uptick in mobile traffic. Would you like me to prepare a detailed analysis?",
      "Inventory": "I've checked your inventory status. You currently have 5 products that are running low on stock. Based on historical sales data, I recommend restocking them within the next 2 weeks to avoid stockouts.",
      "Listings": "I've reviewed your product listings and identified several optimization opportunities. Your main product could benefit from more persuasive bullet points and better keyword integration. Would you like me to suggest specific improvements?",
      "Customer Insights": "After analyzing your recent reviews, I notice that customers consistently praise your product quality but mention concerns about shipping time. This represents an opportunity to set clearer expectations around delivery times.",
      "Competitor Insights": "I've been monitoring your main competitor. They've adjusted their pricing strategy last week and are now offering bundle deals. This might impact your sales in the premium segment. Would you like recommendations on how to respond?",
      "Advertising": "Your current ad campaigns are performing well with a 3.2% CTR, but I see opportunities to optimize your targeting. By refining your audience parameters, we could potentially reduce your cost per acquisition by 15-20%."
    };
    
    return domains[agent.domain as keyof typeof domains] || 
      "I understand your question and I'm analyzing the relevant data. Would you like me to provide more specific insights on this topic?";
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <div className="py-3 px-4 border-b flex items-center gap-3 bg-white">
        <Button variant="ghost" size="icon" onClick={onBack} className="mr-1">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div 
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
          style={{ backgroundColor: agent.avatarColor }}
        >
          {agent.name.charAt(0)}
        </div>
        <div>
          <h2 className="font-semibold">{agent.name}</h2>
          <p className="text-xs text-muted-foreground">{agent.domain} Specialist</p>
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
                agentColor={!message.isUser ? agent.avatarColor : undefined}
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
            placeholder={isLoading ? `${agent.name} is thinking...` : `Message ${agent.name}...`}
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
