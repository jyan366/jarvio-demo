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
      content: "Welcome to the group chat! I'm Jarvio, your team manager. Tell me about your problem, and I'll identify which specialist agents can help you solve it.",
      timestamp: new Date(),
      isUser: false,
      agentColor: "#9b87f5" // Jarvio purple
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [problemContext, setProblemContext] = useState<{
    description: string;
    relevantDomains: string[];
    assignedAgents: Agent[];
    currentRound: number;
    collectedData: Record<string, any>;
    isSolved: boolean;
  }>({
    description: "",
    relevantDomains: [],
    assignedAgents: [],
    currentRound: 0,
    collectedData: {},
    isSolved: false
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
    
    // Handling the first message from user (problem statement)
    if (problemContext.description === "") {
      handleInitialProblem(inputValue);
    } else {
      // Handling follow-up messages
      handleFollowUp(inputValue);
    }
  };

  // Handle initial problem statement from user
  const handleInitialProblem = (problem: string) => {
    // Analyze the problem to determine relevant agents
    const analysis = analyzeInitialProblem(problem);
    const relevantAgents = analysis.relevantDomains
      .map(domain => agentsData.find(agent => agent.domain === domain))
      .filter(Boolean) as Agent[];
    
    // Update problem context
    setProblemContext({
      description: problem,
      relevantDomains: analysis.relevantDomains,
      assignedAgents: relevantAgents,
      currentRound: 0,
      collectedData: {},
      isSolved: false
    });
    
    setTimeout(() => {
      // Jarvio introduces the problem and identifies all relevant agents
      const agentNames = relevantAgents.map(agent => `${agent.name} (${agent.domain})`).join(", ");
      const domainExplanations = relevantAgents.map(agent => 
        `• ${agent.name} (${agent.domain}): ${agent.description}`
      ).join("\n");
      
      const jarvioResponse: Message = {
        id: `jarvio-intro-${Date.now()}`,
        sender: "Jarvio",
        content: `I've analyzed your problem, and I'll bring in our specialists to help solve it. Based on your issue, these agents will collaborate on your solution:\n\n${domainExplanations}\n\nI'll coordinate them to address your problem step-by-step.`,
        timestamp: new Date(),
        isUser: false,
        agentColor: "#9b87f5" // Jarvio purple
      };
      
      setMessages(prev => [...prev, jarvioResponse]);
      
      // First agent responds
      setTimeout(() => {
        const primaryAgent = relevantAgents[0];
        const primaryAgentResponse = generateAgentResponse(primaryAgent, problem);
        
        const agentMessage: Message = {
          id: `agent-${Date.now()}`,
          sender: primaryAgent.name,
          content: primaryAgentResponse.content,
          timestamp: new Date(),
          isUser: false,
          agentColor: primaryAgent.avatarColor
        };
        
        setMessages(prev => [...prev, agentMessage]);
        
        // Update collected data
        setProblemContext(prev => ({
          ...prev,
          collectedData: {
            ...prev.collectedData,
            [primaryAgent.domain]: primaryAgentResponse.data
          },
          currentRound: 1
        }));
        
        // If there are other agents to contribute
        if (relevantAgents.length > 1) {
          handleAgentChain(relevantAgents, problem, 1, { [primaryAgent.domain]: primaryAgentResponse.data });
        } else {
          setIsLoading(false);
        }
      }, 1200);
    }, 1000);
  };

  // Recursively have each relevant agent contribute to the solution
  const handleAgentChain = (
    agents: Agent[], 
    problem: string, 
    currentIndex: number,
    accumulatedData: Record<string, any>
  ) => {
    if (currentIndex >= agents.length) {
      // All agents have contributed, add Jarvio's summary
      const jarvioSummary: Message = {
        id: `jarvio-summary-${Date.now()}`,
        sender: "Jarvio",
        content: `Now that all specialists have provided their perspectives, is there anything specific about this problem you'd like to explore further? Or would you like me to guide the team toward developing a concrete solution plan?`,
        timestamp: new Date(),
        isUser: false,
        agentColor: "#9b87f5" // Jarvio purple
      };
      
      setMessages(prev => [...prev, jarvioSummary]);
      setIsLoading(false);
      return;
    }
    
    const currentAgent = agents[currentIndex];
    
    setTimeout(() => {
      const agentResponse = generateAgentResponse(
        currentAgent, 
        problem, 
        accumulatedData
      );
      
      const agentMessage: Message = {
        id: `agent-${currentIndex}-${Date.now()}`,
        sender: currentAgent.name,
        content: agentResponse.content,
        timestamp: new Date(),
        isUser: false,
        agentColor: currentAgent.avatarColor
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // Update collected data
      const updatedData = {
        ...accumulatedData,
        [currentAgent.domain]: agentResponse.data
      };
      
      setProblemContext(prev => ({
        ...prev,
        collectedData: updatedData
      }));
      
      // Proceed to next agent
      handleAgentChain(agents, problem, currentIndex + 1, updatedData);
    }, 1500);
  };

  // Handle follow-up messages from the user
  const handleFollowUp = (message: string) => {
    const { assignedAgents, collectedData } = problemContext;
    
    // Determine which agent should respond to this follow-up
    const respondingAgent = determineFollowUpAgent(message, problemContext);
    
    setTimeout(() => {
      // First, have Jarvio direct the question to the relevant agent
      const jarvioDirection: Message = {
        id: `jarvio-direction-${Date.now()}`,
        sender: "Jarvio",
        content: `I'll have ${respondingAgent.name} from ${respondingAgent.domain} address this question.`,
        timestamp: new Date(),
        isUser: false,
        agentColor: "#9b87f5" // Jarvio purple
      };
      
      setMessages(prev => [...prev, jarvioDirection]);
      
      // Then have the agent respond
      setTimeout(() => {
        const agentResponse = generateFollowUpResponse(respondingAgent, message, problemContext);
        
        const agentMessage: Message = {
          id: `agent-followup-${Date.now()}`,
          sender: respondingAgent.name,
          content: agentResponse.content,
          timestamp: new Date(),
          isUser: false,
          agentColor: respondingAgent.avatarColor
        };
        
        setMessages(prev => [...prev, agentMessage]);
        
        // Update collected data
        setProblemContext(prev => ({
          ...prev,
          collectedData: {
            ...prev.collectedData,
            [respondingAgent.domain]: {
              ...prev.collectedData[respondingAgent.domain],
              ...agentResponse.data
            }
          }
        }));
        
        // Check if another agent should add additional insights
        const hasInsight = Math.random() < 0.7; // 70% chance another agent contributes
        if (hasInsight && assignedAgents.length > 1) {
          const otherAgents = assignedAgents.filter(a => a.id !== respondingAgent.id);
          const contributingAgent = otherAgents[Math.floor(Math.random() * otherAgents.length)];
          
          setTimeout(() => {
            const contribution = generateSupportingResponse(contributingAgent, message, problemContext);
            
            const contributionMessage: Message = {
              id: `agent-contribution-${Date.now()}`,
              sender: contributingAgent.name,
              content: `I'd like to add to what ${respondingAgent.name} said. ${contribution}`,
              timestamp: new Date(),
              isUser: false,
              agentColor: contributingAgent.avatarColor
            };
            
            setMessages(prev => [...prev, contributionMessage]);
            setIsLoading(false);
          }, 1500);
        } else {
          setIsLoading(false);
        }
      }, 1200);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isLoading) {
        handleSendMessage();
      }
    }
  };

  // Analyze the initial problem to identify relevant domains
  const analyzeInitialProblem = (message: string): {
    relevantDomains: string[];
  } => {
    const lowerMessage = message.toLowerCase();
    const domainScores: Record<string, number> = {};
    
    // Define keywords for each domain with greater weights for strong indicators
    const domainKeywords: Record<string, { term: string, weight: number }[]> = {
      "Analytics": [
        { term: "trend", weight: 2 }, 
        { term: "data", weight: 1.5 }, 
        { term: "metric", weight: 2 },
        { term: "analytic", weight: 3 }, 
        { term: "report", weight: 1.5 }, 
        { term: "performance", weight: 1.5 }
      ],
      "Inventory": [
        { term: "stock", weight: 3 }, 
        { term: "inventory", weight: 3 }, 
        { term: "restock", weight: 2.5 },
        { term: "supply", weight: 1.5 }, 
        { term: "product availability", weight: 2 }, 
        { term: "warehouse", weight: 1.5 }
      ],
      "Listings": [
        { term: "list", weight: 1.5 }, 
        { term: "product page", weight: 2 }, 
        { term: "description", weight: 2 },
        { term: "title", weight: 1.5 }, 
        { term: "bullet", weight: 1.5 }, 
        { term: "content", weight: 1.5 }
      ],
      "Customer Insights": [
        { term: "customer", weight: 2 }, 
        { term: "review", weight: 2.5 }, 
        { term: "feedback", weight: 2.5 },
        { term: "sentiment", weight: 1.5 }, 
        { term: "rating", weight: 2 }, 
        { term: "buyer", weight: 1.5 }
      ],
      "Competitor Insights": [
        { term: "competitor", weight: 3 }, 
        { term: "competition", weight: 2.5 }, 
        { term: "market", weight: 1.5 },
        { term: "rival", weight: 2 }, 
        { term: "similar product", weight: 1.5 }, 
        { term: "other seller", weight: 1.5 }
      ],
      "Advertising": [
        { term: "ad", weight: 2 }, 
        { term: "ppc", weight: 3 }, 
        { term: "campaign", weight: 2.5 },
        { term: "advertising", weight: 3 }, 
        { term: "sponsor", weight: 2 }, 
        { term: "keyword", weight: 1.5 }
      ]
    };
    
    // Calculate scores for each domain
    for (const domain in domainKeywords) {
      domainScores[domain] = 0;
      
      for (const keywordObj of domainKeywords[domain]) {
        if (lowerMessage.includes(keywordObj.term)) {
          domainScores[domain] += keywordObj.weight;
        }
      }
      
      // Context-based analysis for more nuanced understanding
      if (domain === "Analytics" && 
         (lowerMessage.includes("how is") || lowerMessage.includes("performing") || lowerMessage.includes("sales data"))) {
        domainScores[domain] += 2;
      }
      
      if (domain === "Listings" && 
         (lowerMessage.includes("optimize") || lowerMessage.includes("improve") || lowerMessage.includes("convert"))) {
        domainScores[domain] += 2;
      }
      
      if (domain === "Advertising" && 
         (lowerMessage.includes("spend") || lowerMessage.includes("conversion") || lowerMessage.includes("click"))) {
        domainScores[domain] += 2;
      }
    }
    
    // More sophisticated heuristics for common problem types that span multiple domains
    const problemPatterns = [
      {
        pattern: /sales.*declining|revenue.*drop|conversion.*decreasing/i,
        domains: ["Analytics", "Advertising", "Listings"]
      },
      {
        pattern: /negative.*reviews|customer.*complaints|feedback.*issue/i,
        domains: ["Customer Insights", "Listings", "Inventory"]
      },
      {
        pattern: /lost.*buy box|competitor.*taking|market share/i,
        domains: ["Competitor Insights", "Pricing", "Inventory"]
      },
      {
        pattern: /advertising.*not.*profitable|ads.*losing money|high acos/i,
        domains: ["Advertising", "Listings", "Analytics"]
      }
    ];
    
    for (const pattern of problemPatterns) {
      if (pattern.pattern.test(message)) {
        for (const domain of pattern.domains) {
          if (domainScores[domain] !== undefined) {
            domainScores[domain] += 3; // Significant boost for pattern match
          }
        }
      }
    }
    
    // Sort domains by score and get top scoring domains
    const scoredDomains = Object.entries(domainScores)
      .filter(([_, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([domain, _]) => domain);
    
    // For complex problems with no clear pattern match, include multiple domains
    if (lowerMessage.length > 100 && scoredDomains.length < 3) {
      // Complex question but not many domain matches - probably spans multiple areas
      return { relevantDomains: ["Analytics", "Listings", "Advertising"].slice(0, 3) };
    }
    
    // If no clear matches, default to a reasonable set of domains
    if (scoredDomains.length === 0) {
      return { relevantDomains: ["Listings", "Customer Insights"] };
    }
    
    // Return top domains (up to 3) that have scores
    return { relevantDomains: scoredDomains.slice(0, 3) };
  };

  // Determine which agent should handle a follow-up question  
  const determineFollowUpAgent = (message: string, context: typeof problemContext): Agent => {
    const lowerMessage = message.toLowerCase();
    const { assignedAgents } = context;
    
    // Check if explicitly mentioning an agent or their domain
    for (const agent of assignedAgents) {
      if (lowerMessage.includes(agent.name.toLowerCase()) || 
          lowerMessage.includes(agent.domain.toLowerCase())) {
        return agent;
      }
    }
    
    // Otherwise, do keyword analysis
    const domainScores: Record<string, number> = {};
    
    for (const agent of assignedAgents) {
      domainScores[agent.domain] = 0;
    }
    
    // Add scores based on keyword presence
    const domainKeywords: {[key: string]: string[]} = {
      "Analytics": ["trend", "data", "metric", "analytic", "report", "performance"],
      "Inventory": ["stock", "inventory", "restock", "supply", "product", "item"],
      "Listings": ["list", "product page", "description", "title", "bullet", "content"],
      "Customer Insights": ["customer", "review", "feedback", "sentiment", "rating", "buyer"],
      "Competitor Insights": ["competitor", "competition", "market", "rival", "similar product", "other seller"],
      "Advertising": ["ad", "ppc", "campaign", "advertising", "sponsor", "keyword"]
    };
    
    for (const agent of assignedAgents) {
      const domain = agent.domain;
      if (domainKeywords[domain]) {
        for (const keyword of domainKeywords[domain]) {
          if (lowerMessage.includes(keyword)) {
            domainScores[domain] += 1;
          }
        }
      }
    }
    
    // Sort by score
    const sortedAgents = [...assignedAgents].sort((a, b) => {
      return (domainScores[b.domain] || 0) - (domainScores[a.domain] || 0);
    });
    
    // Return best match or default to first agent
    return sortedAgents[0] || assignedAgents[0];
  };

  // Generate responses for the first agent addressing the problem
  const generateAgentResponse = (
    agent: Agent, 
    message: string,
    previousData: Record<string, any> = {}
  ): { content: string, data: any } => {
    // Mock collected data based on the agent's domain
    const mockData: Record<string, any> = {
      "Analytics": {
        recentTrends: [
          "Mobile traffic up 24% month-over-month",
          "Conversion rate improved from 3.2% to 3.8%",
          "Average session duration increased by 18 seconds"
        ],
        topPerformingProducts: [
          "Product A: 246 units sold, $12,450 revenue",
          "Product B: 189 units sold, $9,640 revenue",
          "Product C: 134 units sold, $8,770 revenue"
        ]
      },
      "Inventory": {
        stockStatus: [
          "5 products with low stock (<10 units remaining)",
          "2 products completely out of stock",
          "8 products overstocked (>60 days of inventory)"
        ],
        restockRecommendations: [
          "Reorder Product A within 3 days (high demand)",
          "Consider clearance for Product F (slow-moving)",
          "Increase buffer stock for Product C (seasonal trend detected)"
        ]
      },
      "Listings": {
        optimizationOpportunities: [
          "3 listings missing enhanced brand content",
          "5 listings with suboptimal keyword density",
          "2 listings with inadequate image quality"
        ],
        competitorComparison: [
          "Your average listing has 4.2 images vs competitor average of 5.8",
          "Bullet point count: yours 4.2 vs competitor 5.1",
          "Description length: yours 320 words vs competitor 450 words"
        ]
      },
      "Customer Insights": {
        recentReviews: [
          "12 new 5-star reviews in past week",
          "3 negative reviews mentioning shipping speed",
          "Common praise: product quality and packaging"
        ],
        customerConcerns: [
          "Sizing accuracy mentioned in 7% of reviews",
          "Shipping speed concerns in 12% of reviews",
          "Product durability questions in 3% of reviews"
        ]
      },
      "Competitor Insights": {
        competitorActivities: [
          "Main competitor reduced prices by 7% on average",
          "New competitor entered market with similar products",
          "Competitor A launched bundle deal promotion yesterday"
        ],
        marketTrends: [
          "Increasing demand for eco-friendly packaging",
          "Price sensitivity increasing in this category",
          "Rising interest in premium features"
        ]
      },
      "Advertising": {
        campaignPerformance: [
          "Average CTR across campaigns: 0.42% (industry avg: 0.35%)",
          "ROAS for main campaign: 4.2 (target: 3.5)",
          "Branded search conversions up 18% week-over-week"
        ],
        optimizationInsights: [
          "3 keywords with high spend but low conversion",
          "Mobile conversion rate 32% lower than desktop",
          "Evening hours (6-9pm) showing highest conversion rate"
        ]
      }
    };
    
    // Create contextual awareness of other agents' contributions
    let contextualPrefix = "";
    if (Object.keys(previousData).length > 0) {
      const domainsWithData = Object.keys(previousData);
      if (domainsWithData.length > 0) {
        contextualPrefix = `After reviewing the ${domainsWithData.join(" and ")} data, I can add my perspective from the ${agent.domain} angle. `;
      }
    }
    
    // Generate domain-specific insights tailored to the problem
    let domainInsights = "";
    
    if (agent.domain === "Analytics") {
      domainInsights = `Based on your analytics data, I've identified some key trends that relate to your problem. Your conversion rate has ${Math.random() > 0.5 ? "improved by 12%" : "declined by 8%"} this month, and there's a notable ${Math.random() > 0.5 ? "uptick" : "decrease"} in mobile traffic. Looking at your product performance, I can see opportunities to optimize your top sellers.`;
    } else if (agent.domain === "Inventory") {
      domainInsights = `I've analyzed your inventory status and found that ${Math.random() > 0.5 ? "5 products are running low on stock" : "8 products are overstocked"}. This could be impacting your ${Object.keys(previousData).includes("Advertising") ? "advertising efficiency" : "overall performance"}. Based on historical sales data and seasonal trends, I recommend adjusting your inventory planning strategy.`;
    } else if (agent.domain === "Listings") {
      domainInsights = `After reviewing your product listings, I've identified several optimization opportunities. ${Object.keys(previousData).includes("Customer Insights") ? "Taking into account the customer feedback mentioned earlier, " : ""}Your main listings could benefit from more persuasive bullet points, better keyword integration, and improved image quality.`;
    } else if (agent.domain === "Customer Insights") {
      domainInsights = `I've analyzed your recent customer reviews and feedback patterns. Customers consistently ${Math.random() > 0.5 ? "praise your product quality" : "appreciate your fast shipping"} but mention concerns about ${Math.random() > 0.5 ? "sizing accuracy" : "durability"}. This represents an opportunity to improve your product descriptions and set better expectations.`;
    } else if (agent.domain === "Competitor Insights") {
      domainInsights = `I've been monitoring your main competitors. ${Object.keys(previousData).includes("Analytics") ? "Given the performance trends we observed, " : ""}They've recently ${Math.random() > 0.5 ? "adjusted their pricing strategy" : "expanded their product selection"}, which might be impacting your market position. I've identified ways you can differentiate and maintain your competitive edge.`;
    } else if (agent.domain === "Advertising") {
      domainInsights = `Looking at your advertising campaigns, I see that your ${Math.random() > 0.5 ? "CTR is above industry average" : "ROAS could be improved"}. ${Object.keys(previousData).includes("Listings") ? "With the listing improvements we discussed, " : ""}I've identified specific opportunities to optimize your targeting and keyword strategy to improve performance.`;
    }
    
    // Create concrete, actionable recommendations
    let recommendations = "\n\nBased on this data, here are my specific recommendations:\n";
    recommendations += `1. ${agent.domain === "Listings" ? "Enhance your main product images with better lighting and white backgrounds" : agent.domain === "Advertising" ? "Pause underperforming keywords and reallocate budget" : "Focus on your top-performing products and optimize their visibility"}\n`;
    recommendations += `2. ${agent.domain === "Customer Insights" ? "Address the common customer concerns in your product descriptions" : agent.domain === "Inventory" ? "Adjust restock quantities based on seasonal demand patterns" : "Implement A/B testing to optimize conversion rates"}\n`;
    recommendations += `3. ${agent.domain === "Analytics" ? "Set up custom alerts for key performance metrics" : agent.domain === "Competitor Insights" ? "Differentiate your offerings based on your unique value proposition" : "Create a more consistent cross-platform customer experience"}`;
    
    // Add collaborative element
    let handoff = "";
    if (Object.keys(previousData).length < 1) {
      handoff = `\n\nI think my colleagues can provide additional insights on this problem from their specialized perspectives.`;
    }
    
    // Combine all elements into comprehensive response
    const finalResponse = `${contextualPrefix}${domainInsights}${recommendations}${handoff}`;
    
    return { 
      content: finalResponse, 
      data: mockData[agent.domain as keyof typeof mockData] || {}
    };
  };

  // Generate follow-up responses that build on previous context
  const generateFollowUpResponse = (
    agent: Agent, 
    message: string, 
    context: typeof problemContext
  ): { content: string, data: any } => {
    const lowerMessage = message.toLowerCase();
    
    // Check for specific follow-up question types
    const isHowQuestion = lowerMessage.includes("how") || lowerMessage.includes("steps") || lowerMessage.includes("guide");
    const isWhyQuestion = lowerMessage.includes("why") || lowerMessage.includes("reason");
    const isComparisonQuestion = lowerMessage.includes("compare") || lowerMessage.includes("versus") || lowerMessage.includes(" vs ");
    
    // Generate data based on the agent's domain and question type
    let responseContent = "";
    let responseData = {};
    
    if (isHowQuestion) {
      if (agent.domain === "Listings") {
        responseContent = "Here's my step-by-step approach to optimize your listings:\n\n1. Start by analyzing your current conversion rates per listing\n2. Identify your highest and lowest performing product pages\n3. Compare the content structure and keyword usage between them\n4. Enhance your product images with better lighting and multiple angles\n5. Rewrite bullet points to focus on benefits first, features second\n\nI've compared your current listings against top performers in your category and found that increasing your image count from 4 to 6 could improve conversion rates by approximately 8-12%.";
        responseData = {
          conversionImpactByElement: [
            "Images: +8-12% conversion impact",
            "Bullet points: +5-7% conversion impact",
            "Enhanced A+ content: +15-25% conversion impact"
          ]
        };
      } else if (agent.domain === "Advertising") {
        responseContent = "To improve your advertising ROI, follow these steps:\n\n1. Conduct a full keyword performance audit\n2. Identify and pause keywords with high spend but low conversion\n3. Increase bids on your highest-converting keywords by 10-15%\n4. Implement negative keywords for irrelevant search terms\n5. Create product-specific ad groups for more targeted messaging\n\nBased on your account data, implementing these changes could improve your ROAS from 3.8 to approximately 4.5-5.0 within 30 days.";
        responseData = {
          optimizationOpportunities: [
            "Keyword cleanup: potential 12% reduction in wasted ad spend",
            "Bid optimization: potential 8% improvement in ROAS",
            "Ad copy testing: potential 15% improvement in CTR"
          ]
        };
      } else if (agent.domain === "Analytics") {
        responseContent = "To identify the root cause of this performance issue, follow this analytical approach:\n\n1. Compare year-over-year and month-over-month trends to isolate seasonal factors\n2. Segment your traffic by source to identify which channels are underperforming\n3. Analyze device performance to spot mobile vs. desktop discrepancies\n4. Track conversion path to identify where drop-offs are occurring\n5. Correlate performance changes with any listing or advertising changes\n\nI've already started this analysis and found that your mobile conversion rate has dropped 18% while desktop remains steady, suggesting a potential mobile usability issue.";
        responseData = {
          keyMetricsBreakdown: [
            "Mobile conversion: -18% month-over-month",
            "Desktop conversion: +2% month-over-month",
            "Organic traffic quality: -7% engagement rate"
          ]
        };
      }
    } else if (isWhyQuestion) {
      if (agent.domain === "Customer Insights") {
        responseContent = "The reason we're seeing these customer feedback patterns is multifaceted:\n\n1. Your product quality is excellent (consistently mentioned in 78% of positive reviews)\n2. However, shipping expectations are misaligned with reality (mentioned in 42% of negative reviews)\n3. Your competitors are setting more conservative delivery estimates\n\nThis creates a perception gap between expectation and reality. By addressing the shipping communication on your product pages and setting more realistic timeframes, you could significantly improve customer satisfaction scores.";
        responseData = {
          reviewAnalysis: [
            "Positive mentions: Quality (78%), Value (45%), Design (32%)",
            "Negative mentions: Shipping (42%), Size accuracy (18%), Packaging (8%)",
            "Sentiment trend: Improving +0.2 points month-over-month"
          ]
        };
      } else if (agent.domain === "Analytics") {
        responseContent = "The performance changes we're seeing are driven by several factors:\n\n1. Your recent site speed improvements have reduced bounce rates by 14%\n2. The product category expansion has attracted a new customer segment\n3. Seasonal trends are amplifying your core product performance\n\nThese factors combined explain the 24% growth in transactions. However, there's an opportunity to further capitalize on this by enhancing cross-sell recommendations, which could increase average order value by an estimated 15-20%.";
        responseData = {
          performanceDrivers: [
            "Site speed improvement: +14% reduction in bounce rate",
            "Category expansion: +18% new visitors",
            "Seasonal trends: +22% category demand increase"
          ]
        };
      } else if (agent.domain === "Competitor Insights") {
        responseContent = "Your market share is being affected by several competitor movements:\n\n1. Your main competitor has reduced prices by an average of 7% across their catalog\n2. They've expanded their product selection with 12 new complementary products\n3. They've increased their advertising spend by approximately 30%\n\nThese aggressive moves are designed to capture market share, but their strategy has weaknesses. Their customer ratings have declined slightly, suggesting potential quality issues with their expanded product line, which creates an opportunity for you to emphasize quality in your marketing.";
        responseData = {
          competitorWeaknesses: [
            "Customer satisfaction: -0.3 stars since expansion",
            "Product quality: Increasing complaints (18% growth)",
            "Thin inventory: 42% of new products show limited stock"
          ]
        };
      }
    } else if (isComparisonQuestion) {
      if (agent.domain === "Competitor Insights") {
        responseContent = "Comparing your offerings to your main competitor:\n\n1. Price point: Your average price is 12% higher, but your quality perception is also 18% higher\n2. Selection: They offer 58 products in this category versus your 42\n3. Shipping: Your average delivery time is 3.2 days versus their 2.8 days\n4. Reviews: Your average rating is 4.6 stars versus their 4.2 stars\n\nYour competitive advantage lies in quality and customer satisfaction, while theirs is in price and selection breadth. I recommend leveraging your quality advantage more prominently in your marketing materials while working to streamline your logistics for faster delivery.";
        responseData = {
          competitiveAnalysis: [
            "Price comparison: Your avg: $42.80, Competitor avg: $38.20",
            "Shipping comparison: Your avg: 3.2 days, Competitor avg: 2.8 days",
            "Rating comparison: Your avg: 4.6 stars, Competitor avg: 4.2 stars"
          ]
        };
      } else if (agent.domain === "Listings") {
        responseContent = "When comparing your listings to top performers in your category:\n\n1. Image count: You average 4.2 images per listing vs. 5.8 for top performers\n2. Bullet points: You average 4.2 bullets vs. 5.1 for top performers\n3. Description length: Your descriptions average 320 words vs. 450 for top performers\n4. Enhanced content: 60% of your listings have A+ content vs. 85% for top performers\n\nThe most significant opportunity is in your visual content. Adding more lifestyle images and infographics could help close the conversion gap between your listings and category leaders.";
        responseData = {
          listingGaps: [
            "Image gap: -1.6 images per listing vs. top performers",
            "Content gap: -130 words per description vs. top performers",
            "Enhanced content gap: -25% A+ content coverage vs. top performers"
          ]
        };
      }
    }
    
    // Default response if no specific pattern matched
    if (!responseContent) {
      if (agent.domain === "Inventory") {
        responseContent = "Based on your inventory data, I've identified some key insights related to your question. Your inventory turnover rate for the past 30 days is 4.2, which is slightly below the category average of 5.1. There are 5 products that are at risk of stockout in the next 14 days, and 8 products that have excess inventory (over 60 days of stock). By optimizing your restock quantities and timing, we could improve your capital efficiency while ensuring product availability.";
        responseData = {
          inventoryHealth: [
            "Turnover rate: 4.2 (category avg: 5.1)",
            "At-risk products: 5 SKUs (potential revenue impact: $24,500)",
            "Excess inventory: 8 SKUs (tied-up capital: $32,800)"
          ]
        };
      } else if (agent.domain === "Analytics") {
        responseContent = "Looking at your performance data, I see that your conversion funnel shows a significant drop-off between cart addition and checkout initiation (32% abandonment). This is higher than the category benchmark of 24%. Your top-performing products have a 15% higher conversion rate than your catalog average, suggesting an opportunity to optimize the visibility of these items. By implementing targeted improvements to your checkout process and product visibility, we could recover approximately 15-20% of these lost sales.";
        responseData = {
          funnelAnalysis: [
            "Cart abandonment: 32% (benchmark: 24%)",
            "Product page to cart: 18% conversion (benchmark: 22%)",
            "Checkout completion: 76% (benchmark: 82%)"
          ]
        };
      }
    }
    
    // Add collaboration element referring to other agents
    const otherRelevantAgents = context.assignedAgents
      .filter(a => a.domain !== agent.domain);
    
    if (otherRelevantAgents.length > 0) {
      const collaboratingAgent = otherRelevantAgents[0];
      responseContent += `\n\nThis insight connects with what ${collaboratingAgent.name} from ${collaboratingAgent.domain} could tell you about how this affects their area. Would you like their perspective on this as well?`;
    }
    
    return {
      content: responseContent || `Let me analyze that question from a ${agent.domain} perspective and provide you with actionable insights.`,
      data: responseData
    };
  };

  // Generate supporting responses from other agents
  const generateSupportingResponse = (
    agent: Agent,
    message: string,
    context: typeof problemContext
  ): string => {
    // Create domain-specific supporting insights
    switch (agent.domain) {
      case "Advertising":
        return "Based on your advertising data, I recommend adjusting your keyword targeting to better capitalize on the high-converting traffic segments we've identified. Your current campaigns are performing above category average, but there's potential to optimize further by aligning ad copy with the product strengths mentioned in your positive reviews.";
        
      case "Listings":
        return "I notice opportunities to enhance your product listings by incorporating the performance insights we've discussed. Updating your product titles and bullets to highlight the specific benefits customers mention in positive reviews could improve your click-through and conversion rates significantly.";
        
      case "Analytics":
        return "The data shows some interesting patterns in how customers interact with your products. Your mobile conversion rate is 28% lower than desktop, but mobile traffic is increasing by 4% month-over-month. Optimizing the mobile experience should be a priority based on these trends.";
        
      case "Customer Insights":
        return "Customer feedback shows strong satisfaction with your product quality, but there are concerns about clarity of use instructions. Adding clearer guidance in your product listings and possibly creating tutorial content could address this gap and improve overall customer experience.";
        
      case "Inventory":
        return "Looking at your inventory data alongside these insights, I'd recommend adjusting your restock quantities for your fastest-moving SKUs. You currently have 3 products at risk of stockout in the next 14 days, which could impact the performance improvements we're targeting.";
        
      case "Competitor Insights":
        return "Your main competitor recently adjusted their pricing strategy in response to similar market conditions. You have an opportunity to differentiate by highlighting your superior product features and customer satisfaction scores rather than competing solely on price.";
        
      default:
        return "I have some additional insights that could help address this challenge from a different angle. Let me know if you'd like me to elaborate on any specific aspect.";
    }
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
        <ScrollArea className="h-full">
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
