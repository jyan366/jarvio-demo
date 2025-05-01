import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, ChevronLeft } from "lucide-react";
import { Agent, Message } from "./types";
import { AgentMessage } from "./AgentMessage";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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
    
    // Check if the message is better suited for a different agent
    const isForDifferentAgent = checkIfForDifferentAgent(inputValue, agent);
    
    if (isForDifferentAgent.shouldRedirect) {
      // Have Jarvio step in to redirect
      setTimeout(() => {
        const jarvioResponse: Message = {
          id: `jarvio-${Date.now()}`,
          sender: "Jarvio",
          content: `I noticed that your question might be better answered by ${isForDifferentAgent.recommendedAgent?.name}, our ${isForDifferentAgent.recommendedAgent?.domain} specialist. Would you like me to redirect you to chat with them? In the meantime, ${agent.name} will try to help.`,
          timestamp: new Date(),
          isUser: false,
          agentColor: "#9b87f5" // Jarvio purple
        };
        
        setMessages(prev => [...prev, jarvioResponse]);
        
        // Regular agent still tries to answer
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
        }, 1500);
      }, 1000);
    } else {
      // Regular response flow
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
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) {
        handleSendMessage();
      }
    }
  };

  // Check if the message is better suited for a different agent
  const checkIfForDifferentAgent = (message: string, currentAgent: Agent): { 
    shouldRedirect: boolean, 
    recommendedAgent: Agent | null 
  } => {
    const lowerMessage = message.toLowerCase();
    
    // Skip this check for short messages
    if (message.length < 15) {
      return { shouldRedirect: false, recommendedAgent: null };
    }
    
    // Define keywords for each domain
    const domainKeywords: {[key: string]: string[]} = {
      "Analytics": ["trend", "data", "metric", "analytic", "report", "performance"],
      "Inventory": ["stock", "inventory", "restock", "supply", "product", "item"],
      "Listings": ["list", "product page", "description", "title", "bullet", "content"],
      "Customer Insights": ["customer", "review", "feedback", "sentiment", "rating", "buyer"],
      "Competitor Insights": ["competitor", "competition", "market", "rival", "similar product", "other seller"],
      "Advertising": ["ad", "ppc", "campaign", "advertising", "sponsor", "keyword"]
    };
    
    // Skip if current agent's domain matches message keywords
    const currentAgentKeywords = domainKeywords[currentAgent.domain] || [];
    for (const keyword of currentAgentKeywords) {
      if (lowerMessage.includes(keyword)) {
        return { shouldRedirect: false, recommendedAgent: null };
      }
    }
    
    // Check for other domains' keywords
    for (const domain in domainKeywords) {
      if (domain !== currentAgent.domain) {
        const keywords = domainKeywords[domain];
        for (const keyword of keywords) {
          if (lowerMessage.includes(keyword)) {
            // Find the agent for this domain
            const agentForDomain = agentsFromData.find(a => a.domain === domain);
            // Only redirect 25% of the time to not be annoying
            const shouldRedirect = Math.random() < 0.25;
            return { 
              shouldRedirect: shouldRedirect, 
              recommendedAgent: agentForDomain || null 
            };
          }
        }
      }
    }
    
    return { shouldRedirect: false, recommendedAgent: null };
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

  // Import agents data from the shared file
  const agentsFromData = require("@/data/agentsData").agentsData;

  return (
    <div className="h-full flex flex-col relative">
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
        <div className="flex-1">
          <h2 className="font-semibold">{agent.name}</h2>
          <p className="text-xs text-muted-foreground">{agent.domain} Specialist</p>
        </div>
        
        {/* Jarvio is helping indicator */}
        <Avatar className="h-6 w-6">
          <AvatarFallback style={{ backgroundColor: "#9b87f5" }} className="text-[10px] text-white">
            J
          </AvatarFallback>
        </Avatar>
      </div>
      
      {/* Messages container with scroll */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pb-[76px]">
          <div className="p-4 max-w-full">
            {messages.map(message => (
              <AgentMessage 
                key={message.id} 
                message={message} 
                agentColor={!message.isUser ? message.agentColor || agent.avatarColor : undefined}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Fixed input at bottom */}
      <div className="border-t bg-white shadow-md">
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
