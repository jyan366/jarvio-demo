import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, ChevronLeft } from "lucide-react";
import { Agent, Message } from "./types";
import { AgentMessage } from "./AgentMessage";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { agentsData } from "@/data/agentsData";

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
  const [problemContext, setProblemContext] = useState<{
    solved: boolean;
    stage: 'initial' | 'understanding' | 'solving' | 'resolved';
    relevantData: Record<string, any>;
  }>({
    solved: false,
    stage: 'initial',
    relevantData: {}
  });
  
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
          const responseData = generateAgentResponse(agent, inputValue, problemContext);
          
          // Update problem context
          setProblemContext(prev => ({
            ...prev,
            stage: determineNextStage(prev.stage, inputValue),
            relevantData: {
              ...prev.relevantData,
              ...responseData.data
            }
          }));
          
          const agentResponse: Message = {
            id: `agent-${Date.now()}`,
            sender: agent.name,
            content: responseData.content,
            timestamp: new Date(),
            isUser: false
          };
          
          setMessages(prev => [...prev, agentResponse]);
          setIsLoading(false);
        }, 1500);
      }, 1000);
    } else {
      // Regular response flow with problem-solving approach
      setTimeout(() => {
        const responseData = generateAgentResponse(agent, inputValue, problemContext);
        
        // Update problem context
        setProblemContext(prev => ({
          ...prev,
          stage: determineNextStage(prev.stage, inputValue),
          relevantData: {
            ...prev.relevantData,
            ...responseData.data
          }
        }));
        
        const agentResponse: Message = {
          id: `agent-${Date.now()}`,
          sender: agent.name,
          content: responseData.content,
          timestamp: new Date(),
          isUser: false
        };
        
        setMessages(prev => [...prev, agentResponse]);
        
        // Potentially bring in another agent when appropriate
        const shouldBringColleague = Math.random() < 0.3 && inputValue.length > 30;
        
        if (shouldBringColleague) {
          // Find a complementary agent that might have relevant input
          const complementaryAgents = agentsData.filter(a => a.id !== agent.id);
          const colleagueAgent = findComplementaryAgent(inputValue, complementaryAgents, agent.domain);
          
          setTimeout(() => {
            const colleagueResponse: Message = {
              id: `colleague-${Date.now()}`,
              sender: colleagueAgent.name,
              content: generateColleagueResponse(colleagueAgent, agent, inputValue),
              timestamp: new Date(),
              isUser: false,
              agentColor: colleagueAgent.avatarColor
            };
            
            setMessages(prev => [...prev, colleagueResponse]);
            setIsLoading(false);
          }, 1500);
        } else {
          setIsLoading(false);
        }
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

  // Find a complementary agent based on the message content
  const findComplementaryAgent = (message: string, availableAgents: Agent[], currentDomain: string): Agent => {
    const lowerMessage = message.toLowerCase();
    
    // Domain pairs that work well together
    const domainPairs: Record<string, string[]> = {
      "Listings": ["Advertising", "Customer Insights"],
      "Advertising": ["Listings", "Analytics"],
      "Analytics": ["Advertising", "Inventory"],
      "Inventory": ["Analytics", "Sales"],
      "Customer Insights": ["Listings", "Competitor Insights"],
      "Competitor Insights": ["Advertising", "Customer Insights"]
    };
    
    // First try to find an agent from a complementary domain
    const complementaryDomains = domainPairs[currentDomain] || [];
    const domainMatch = availableAgents.find(a => complementaryDomains.includes(a.domain));
    if (domainMatch) {
      return domainMatch;
    }
    
    // If no good domain match, do keyword matching
    const domainKeywords: {[key: string]: string[]} = {
      "Analytics": ["trend", "data", "metric", "analytic", "report", "performance"],
      "Inventory": ["stock", "inventory", "restock", "supply", "product", "item"],
      "Listings": ["list", "product page", "description", "title", "bullet", "content"],
      "Customer Insights": ["customer", "review", "feedback", "sentiment", "rating", "buyer"],
      "Competitor Insights": ["competitor", "competition", "market", "rival", "similar product", "other seller"],
      "Advertising": ["ad", "ppc", "campaign", "advertising", "sponsor", "keyword"]
    };
    
    for (const agent of availableAgents) {
      const keywords = domainKeywords[agent.domain] || [];
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          return agent;
        }
      }
    }
    
    // Default to random selection if no good match
    return availableAgents[Math.floor(Math.random() * availableAgents.length)];
  };

  // Generate colleague response that builds on the current agent's insights
  const generateColleagueResponse = (colleague: Agent, currentAgent: Agent, message: string): string => {
    const baseResponses = {
      "Analytics": `From an analytics perspective, I can build on what ${currentAgent.name} said. Looking at your performance data, there's a clear correlation between the points mentioned and your overall metrics. The data shows that implementing these suggestions could improve your conversion rate by approximately 14-18%.`,
      
      "Inventory": `Adding to ${currentAgent.name}'s insights, I've checked your inventory position. Based on your current stock levels and sales velocity, you should prioritize rebalancing your inventory to support the recommendations. I'm seeing 3 SKUs that will need attention within the next 10 days.`,
      
      "Listings": `Building on those points, I can help optimize your product listings to better implement ${currentAgent.name}'s suggestions. Your current listing content could be restructured to highlight the key benefits more effectively, which would reinforce the strategy outlined.`,
      
      "Customer Insights": `I've analyzed your recent customer feedback, and it strongly supports what ${currentAgent.name} mentioned. Customers are consistently highlighting these exact points in their reviews. Addressing these elements could improve your average rating from 4.2 to potentially 4.5-4.6 stars.`,
      
      "Competitor Insights": `To add a competitive perspective to ${currentAgent.name}'s advice, I've been tracking your main competitors' activities. They haven't yet capitalized on these opportunities, giving you a potential first-mover advantage if you implement these recommendations quickly.`,
      
      "Advertising": `From an advertising standpoint, I can complement ${currentAgent.name}'s approach. By aligning your PPC strategy with these recommendations, you could see a 15-20% improvement in campaign efficiency. I'm seeing opportunities to target high-intent keywords that directly relate to the points discussed.`
    };
    
    return baseResponses[colleague.domain] || `I agree with ${currentAgent.name}'s assessment and can offer additional support from the ${colleague.domain.toLowerCase()} side to help implement these recommendations effectively.`;
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
            const agentForDomain = agentsData.find(a => a.domain === domain);
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

  // Determine the next stage in the problem-solving process
  const determineNextStage = (
    currentStage: 'initial' | 'understanding' | 'solving' | 'resolved',
    message: string
  ): 'initial' | 'understanding' | 'solving' | 'resolved' => {
    // Progress through stages as the conversation continues
    switch (currentStage) {
      case 'initial':
        return 'understanding';
      case 'understanding':
        return 'solving';
      case 'solving':
        // Check if this might be a follow-up question that indicates resolution
        if (message.toLowerCase().includes("thank") || 
            message.toLowerCase().includes("that helps") ||
            message.toLowerCase().includes("great")) {
          return 'resolved';
        }
        return 'solving';
      case 'resolved':
        // New complex question might restart the process
        if (message.length > 50) {
          return 'understanding';
        }
        return 'resolved';
      default:
        return currentStage;
    }
  };

  // Generate detailed agent responses with "data findings"
  const generateAgentResponse = (
    agent: Agent, 
    message: string,
    context: typeof problemContext
  ): { content: string; data: any } => {
    // Base response templates customized to the problem-solving stage
    const stageResponses = {
      initial: {
        "Analytics": "I'd be happy to help you with that. Let me analyze your analytics data to give you some insights.",
        "Inventory": "I'll help you with that inventory question. Let me check your current stock levels and sales velocity.",
        "Listings": "I can definitely help optimize your listings. Let me review them and identify improvement opportunities.",
        "Customer Insights": "I'll help you understand your customer feedback. Let me analyze the recent reviews and sentiment data.",
        "Competitor Insights": "I'd be happy to provide competitor insights. Let me check what your main competitors are doing in this space.",
        "Advertising": "I can help with your advertising strategy. Let me look at your campaign performance data."
      },
      understanding: {
        "Analytics": "Based on your analytics data, I can see some interesting trends. Your conversion rate has improved by 12% this month, and there's a notable uptick in mobile traffic. I've identified several key metrics that we should focus on:",
        "Inventory": "I've analyzed your inventory status. You currently have 5 products that are running low on stock, and 3 items that are overstocked. Here's what I'm seeing:",
        "Listings": "I've reviewed your product listings and found several optimization opportunities. Your main product images are good, but there are some content improvements that could boost conversion:",
        "Customer Insights": "After analyzing your customer feedback, I notice several consistent patterns. Customers love your product quality but mention concerns about shipping time. Here's what the data shows:",
        "Competitor Insights": "I've been monitoring your main competitors and noticed some recent changes. Your primary competitor has adjusted their pricing strategy last week. Here's the competitive landscape:",
        "Advertising": "Looking at your advertising performance, I see several opportunities for improvement. Your campaigns are performing well with a 3.2% CTR, but we can optimize further. Here's what stands out:"
      },
      solving: {
        "Analytics": "Based on the data patterns we've identified, here are my recommendations to improve your performance metrics:",
        "Inventory": "To optimize your inventory and prevent both stockouts and overstock situations, here's what I recommend:",
        "Listings": "To enhance your product listings and increase conversion rates, here are the specific changes I suggest implementing:",
        "Customer Insights": "To address the customer feedback patterns we've identified and improve satisfaction, I recommend these actions:",
        "Competitor Insights": "Given what we've learned about your competitors' strategies, here's how you can position your offerings for maximum advantage:",
        "Advertising": "To improve your advertising ROI and campaign performance, here's the optimization strategy I'd recommend:"
      },
      resolved: {
        "Analytics": "I'm glad we could identify those performance opportunities. If you implement the recommended changes, you should see improvement in your key metrics within about 2-3 weeks. Is there anything else you'd like me to analyze?",
        "Inventory": "Perfect! With these inventory adjustments, you should be able to maintain optimal stock levels while improving your capital efficiency. Let me know if you need any help implementing these changes.",
        "Listings": "Great! These listing optimizations should help improve your visibility and conversion rates. The most impactful changes are the title restructuring and enhanced bullet points. Would you like me to help with anything else?",
        "Customer Insights": "I'm happy we could uncover these customer sentiment patterns. Addressing the shipping expectations should have a significant positive impact on your reviews and ratings. Is there anything else you'd like me to look into?",
        "Competitor Insights": "Excellent! This competitive positioning strategy should help you differentiate effectively in the market. I'll continue monitoring your competitors for any significant changes. Anything else you'd like insights on?",
        "Advertising": "Perfect! These campaign optimizations should help improve your ROAS over the next 30 days. The keyword refinements will be particularly impactful. Is there anything else about your advertising you'd like help with?"
      }
    };
    
    // Mock data findings customized by domain
    const mockFindings: Record<string, any> = {
      "Analytics": {
        performanceMetrics: [
          "Conversion rate: 3.8% (up 12% month-over-month)",
          "Average order value: $42.50 (up 5% month-over-month)",
          "Cart abandonment: 68% (industry average: 70%)"
        ],
        trafficInsights: [
          "Mobile traffic: 62% (up 8% month-over-month)",
          "Desktop traffic: 32% (down 6% month-over-month)",
          "Tablet traffic: 6% (down 2% month-over-month)"
        ],
        recommendations: [
          "Optimize mobile checkout flow (potential 15% improvement)",
          "Implement cart abandonment emails (potential recovery: 12%)",
          "A/B test product page layouts (focus on mobile optimization)"
        ]
      },
      "Inventory": {
        stockStatus: [
          "Low stock alerts: 5 products below 15% stock threshold",
          "Overstock alerts: 3 products with >90 days inventory",
          "Healthy stock levels: 24 products (60-85% of target)"
        ],
        salesVelocity: [
          "Fastest moving SKU: Product B (14.2 units/day)",
          "Slowest moving SKU: Product F (0.8 units/day)",
          "Average sell-through rate: 4.2% daily"
        ],
        recommendations: [
          "Restock Products A, B, and D within 10 days",
          "Consider clearance for Products F, H, and K",
          "Adjust reorder quantity for Product C (↑20%)"
        ]
      },
      "Listings": {
        contentAnalysis: [
          "Title keyword density: 2.1% (below optimal 3-5%)",
          "Bullet points: average 42 words (optimal: 60-80)",
          "Description: Missing key benefit statements"
        ],
        imageQuality: [
          "Main image resolution: Good (2000x2000px)",
          "Number of images: 4 (competitor average: 6)",
          "Lifestyle images: 1 (recommended: 3-4)"
        ],
        recommendations: [
          "Revise titles to include top 3 search keywords",
          "Expand bullet points with benefit-focused language",
          "Add 2 additional lifestyle images showing product in use"
        ]
      },
      "Customer Insights": {
        reviewAnalysis: [
          "Average rating: 4.3 stars (category average: 4.1)",
          "Review velocity: 3.2 reviews/day (up 15% month-over-month)",
          "Negative reviews mention: shipping delays (42%), packaging (18%)"
        ],
        sentimentPatterns: [
          "Positive sentiment: product quality (76%), value (54%)",
          "Neutral sentiment: customer service (32%), packaging (28%)",
          "Negative sentiment: shipping speed (42%), size accuracy (15%)"
        ],
        recommendations: [
          "Update product pages with clear shipping expectations",
          "Create size guide with detailed measurements",
          "Respond to negative reviews addressing shipping concerns"
        ]
      },
      "Competitor Insights": {
        competitorActivity: [
          "Competitor A: Price decrease on 4 competing products (avg. -8%)",
          "Competitor B: New bundle offers launched last week",
          "Competitor C: Expanded color/size options for bestseller"
        ],
        marketPosition: [
          "Your price point: 12% higher than category average",
          "Your review count: 24% higher than closest competitor",
          "Your shipping time: 0.8 days slower than fastest competitor"
        ],
        recommendations: [
          "Create value-based bundles to counter Competitor B",
          "Highlight quality advantage in product titles and bullets",
          "Consider expedited shipping option to match Competitor C"
        ]
      },
      "Advertising": {
        campaignPerformance: [
          "CTR: 0.42% (industry average: 0.35%)",
          "ROAS: 3.8 (target: 4.5)",
          "CPC: $0.68 (up 12% month-over-month)"
        ],
        keywordInsights: [
          "Top converting keyword: 'organic sauerkraut' (12.4% conv. rate)",
          "Highest spend: 'fermented foods' ($428/month, 2.8% conv. rate)",
          "Underperforming: 'probiotic food' ($245/month, 0.8% conv. rate)"
        ],
        recommendations: [
          "Pause or reduce bid on 'probiotic food' keyword",
          "Increase bid on 'organic sauerkraut' by 15%",
          "Implement dayparting to focus budget during peak hours (6-9pm)"
        ]
      }
    };
    
    // Generate response based on current stage and domain
    const stageResponse = stageResponses[context.stage]?.[agent.domain] || 
      `As your ${agent.domain} specialist, I've analyzed your question and have some insights to share.`;
    
    const domainData = mockFindings[agent.domain];
    
    // Detailed data-driven response with findings and action steps
    let detailedResponse = stageResponse;
    
    // Add data findings based on the stage
    if (context.stage === 'understanding' || context.stage === 'solving') {
      // Add relevant data points based on domain
      if (agent.domain === "Analytics") {
        detailedResponse += "\n\n• " + domainData.performanceMetrics.join("\n• ");
        detailedResponse += "\n\n• " + domainData.trafficInsights[0];
        detailedResponse += "\n• " + domainData.trafficInsights[1];
      } else if (agent.domain === "Listings") {
        detailedResponse += "\n\n• " + domainData.contentAnalysis.join("\n• ");
        detailedResponse += "\n\n• " + domainData.imageQuality[1];
      } else if (agent.domain === "Advertising") {
        detailedResponse += "\n\n• " + domainData.campaignPerformance.join("\n• ");
        detailedResponse += "\n\n• " + domainData.keywordInsights[0];
        detailedResponse += "\n• " + domainData.keywordInsights[1];
      }
    }
    
    // Add recommendations for solving stage
    if (context.stage === 'solving') {
      detailedResponse += "\n\nHere are my specific recommendations:\n\n1. " + domainData.recommendations[0];
      detailedResponse += "\n2. " + domainData.recommendations[1];
      detailedResponse += "\n3. " + domainData.recommendations[2];
      
      detailedResponse += "\n\nWould you like me to elaborate on any of these recommendations?";
    }
    
    // For resolved stage, keep it simpler
    if (context.stage === 'resolved') {
      detailedResponse = stageResponses.resolved[agent.domain];
    }
    
    return {
      content: detailedResponse,
      data: domainData
    };
  };

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
        <ScrollArea className="h-full">
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
