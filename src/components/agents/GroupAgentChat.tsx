
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, ChevronLeft, Users } from "lucide-react";
import { Agent, Message } from "./types";
import { AgentMessage } from "./AgentMessage";
import { agentsData } from "@/data/agentsData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface GroupAgentChatProps {
  onBack: () => void;
}

export function GroupAgentChat({ onBack }: GroupAgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "Jarvio",
      content: "Welcome to the group chat! I'm Jarvio, your team manager. Tell me about your problem, and I'll identify which specialist agent can help you best.",
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
    
    // Simulate Jarvio analyzing and selecting the appropriate agent
    setTimeout(() => {
      // First Jarvio responds by identifying which agent is best suited
      const jarvioResponse: Message = {
        id: `jarvio-${Date.now()}`,
        sender: "Jarvio",
        content: identifyRelevantAgent(inputValue),
        timestamp: new Date(),
        isUser: false,
        agentColor: "#9b87f5" // Jarvio purple
      };
      
      setMessages(prev => [...prev, jarvioResponse]);
      
      // Then have the selected agent respond
      setTimeout(() => {
        const relevantAgentIndex = determineRelevantAgentIndex(inputValue);
        const respondingAgent = agentsData[relevantAgentIndex];
        
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
      }, 1500);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) {
        handleSendMessage();
      }
    }
  };

  // Determine which agent's domain is most relevant to the message
  const determineRelevantAgentIndex = (message: string): number => {
    const lowerMessage = message.toLowerCase();
    
    // Simple keyword matching to determine agent relevance
    const relevanceScores = agentsData.map(agent => {
      let score = 0;
      
      // Check for domain-specific keywords
      if (agent.domain === "Analytics" && 
          (lowerMessage.includes("trend") || lowerMessage.includes("data") || 
           lowerMessage.includes("metric") || lowerMessage.includes("analytic") || 
           lowerMessage.includes("report") || lowerMessage.includes("performance"))) {
        score += 2;
      }
      
      if (agent.domain === "Inventory" && 
          (lowerMessage.includes("stock") || lowerMessage.includes("inventory") || 
           lowerMessage.includes("restock") || lowerMessage.includes("supply") || 
           lowerMessage.includes("product") || lowerMessage.includes("item"))) {
        score += 2;
      }
      
      if (agent.domain === "Listings" && 
          (lowerMessage.includes("list") || lowerMessage.includes("product page") || 
           lowerMessage.includes("description") || lowerMessage.includes("title") || 
           lowerMessage.includes("bullet") || lowerMessage.includes("content"))) {
        score += 2;
      }
      
      if (agent.domain === "Customer Insights" && 
          (lowerMessage.includes("customer") || lowerMessage.includes("review") || 
           lowerMessage.includes("feedback") || lowerMessage.includes("sentiment") || 
           lowerMessage.includes("rating") || lowerMessage.includes("buyer"))) {
        score += 2;
      }
      
      if (agent.domain === "Competitor Insights" && 
          (lowerMessage.includes("competitor") || lowerMessage.includes("competition") || 
           lowerMessage.includes("market") || lowerMessage.includes("rival") || 
           lowerMessage.includes("similar product") || lowerMessage.includes("other seller"))) {
        score += 2;
      }
      
      if (agent.domain === "Advertising" && 
          (lowerMessage.includes("ad") || lowerMessage.includes("ppc") || 
           lowerMessage.includes("campaign") || lowerMessage.includes("advertising") || 
           lowerMessage.includes("sponsor") || lowerMessage.includes("keyword"))) {
        score += 2;
      }
      
      return score;
    });
    
    // Find the index of the agent with the highest relevance score
    let maxScore = 0;
    let maxIndex = 0;
    
    relevanceScores.forEach((score, index) => {
      if (score > maxScore) {
        maxScore = score;
        maxIndex = index;
      }
    });
    
    // If no clear winner, default to a random agent
    if (maxScore === 0) {
      return Math.floor(Math.random() * agentsData.length);
    }
    
    return maxIndex;
  };

  // Jarvio identifies which agent should respond
  const identifyRelevantAgent = (message: string): string => {
    const agentIndex = determineRelevantAgentIndex(message);
    const agent = agentsData[agentIndex];
    
    return `I think this is a question for ${agent.name}, our ${agent.domain} specialist. Let me bring them in to help.`;
  };

  // Agent response based on their domain
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
    <div className="h-full flex flex-col relative">
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
        <div className="flex-1">
          <h2 className="font-semibold">Agent Group Chat</h2>
          <p className="text-xs text-muted-foreground">All specialists in one conversation</p>
        </div>
        
        {/* Group members avatars */}
        <div className="flex -space-x-2">
          {[...agentsData].slice(0, 3).map((agent) => (
            <Avatar key={agent.id} className="border-2 border-white h-6 w-6">
              <AvatarFallback style={{ backgroundColor: agent.avatarColor }} className="text-[10px] text-white">
                {agent.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ))}
          <div className="bg-muted h-6 w-6 rounded-full border-2 border-white flex items-center justify-center">
            <span className="text-[10px] font-medium">+{agentsData.length - 3}</span>
          </div>
        </div>
      </div>
      
      {/* Messages container with scroll */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pb-[76px]">
          <div className="p-4 max-w-full">
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
      <div className="border-t bg-white shadow-md">
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
