
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
      isUser: false,
      agentColor: "#9b87f5" // Jarvio purple
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [problemContext, setProblemContext] = useState<{
    description: string;
    relevantDomains: string[];
    currentDomainIndex: number;
    collectedData: Record<string, any>;
  }>({
    description: "",
    relevantDomains: [],
    currentDomainIndex: 0,
    collectedData: {}
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
    
    // Identify problem domains and relevant agents when the problem is initially presented
    if (problemContext.description === "") {
      const initialProblemAnalysis = analyzeInitialProblem(inputValue);
      
      setProblemContext({
        description: inputValue,
        relevantDomains: initialProblemAnalysis.relevantDomains,
        currentDomainIndex: 0,
        collectedData: {}
      });
      
      // Have Jarvio introduce the problem-solving approach
      setTimeout(() => {
        const primaryAgent = agentsData.find(agent => agent.domain === initialProblemAnalysis.relevantDomains[0]);
        
        const jarvioResponse: Message = {
          id: `jarvio-${Date.now()}`,
          sender: "Jarvio",
          content: `I think this is a question for ${primaryAgent?.name}, our ${primaryAgent?.domain} specialist. Let me bring them in to help.`,
          timestamp: new Date(),
          isUser: false,
          agentColor: "#9b87f5" // Jarvio purple
        };
        
        setMessages(prev => [...prev, jarvioResponse]);
        
        // Primary agent response
        setTimeout(() => {
          const primaryAgentResponse = generateAgentResponse(primaryAgent!, inputValue);
          
          const agentResponse: Message = {
            id: `agent-${Date.now()}`,
            sender: primaryAgent!.name,
            content: primaryAgentResponse.content,
            timestamp: new Date(),
            isUser: false,
            agentColor: primaryAgent!.avatarColor
          };
          
          setMessages(prev => [...prev, agentResponse]);
          
          // Check if we need secondary agent input
          if (initialProblemAnalysis.relevantDomains.length > 1) {
            const secondaryDomain = initialProblemAnalysis.relevantDomains[1];
            const secondaryAgent = agentsData.find(agent => agent.domain === secondaryDomain);
            
            // Update collected data with primary agent's findings
            setProblemContext(prev => ({
              ...prev,
              collectedData: {
                ...prev.collectedData,
                [primaryAgent!.domain]: primaryAgentResponse.data
              },
              currentDomainIndex: 1
            }));
            
            // Secondary agent jumps in with additional insights
            setTimeout(() => {
              const secondaryAgentResponse = generateAgentResponse(
                secondaryAgent!, 
                inputValue, 
                { [primaryAgent!.domain]: primaryAgentResponse.data }
              );
              
              const secondAgentResponse: Message = {
                id: `agent2-${Date.now()}`,
                sender: secondaryAgent!.name,
                content: secondaryAgentResponse.content,
                timestamp: new Date(),
                isUser: false,
                agentColor: secondaryAgent!.avatarColor
              };
              
              setMessages(prev => [...prev, secondAgentResponse]);
              setIsLoading(false);
            }, 1500);
          } else {
            setIsLoading(false);
          }
        }, 1000);
      }, 1000);
    } else {
      // Continuing conversation flow with context
      setTimeout(() => {
        // Determine which agent should respond to the follow-up
        const relevantAgent = determineFollowUpAgent(inputValue, problemContext);
        
        const agentResponse: Message = {
          id: `agent-${Date.now()}`,
          sender: relevantAgent.name,
          content: generateFollowUpResponse(relevantAgent, inputValue, problemContext).content,
          timestamp: new Date(),
          isUser: false,
          agentColor: relevantAgent.avatarColor
        };
        
        setMessages(prev => [...prev, agentResponse]);
        
        // Check if we need to bring in another agent for additional assistance
        if (Math.random() < 0.4) { // 40% chance of bringing in another agent
          const availableAgents = agentsData.filter(a => a.domain !== relevantAgent.domain);
          const supportAgent = availableAgents[Math.floor(Math.random() * availableAgents.length)];
          
          setTimeout(() => {
            const supportResponse: Message = {
              id: `support-${Date.now()}`,
              sender: supportAgent.name,
              content: `Building on what ${relevantAgent.name} said, I can add some perspective from the ${supportAgent.domain.toLowerCase()} side. ${generateSupportingResponse(supportAgent, inputValue, problemContext)}`,
              timestamp: new Date(),
              isUser: false,
              agentColor: supportAgent.avatarColor
            };
            
            setMessages(prev => [...prev, supportResponse]);
            setIsLoading(false);
          }, 1200);
        } else {
          setIsLoading(false);
        }
      }, 1500);
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
    
    // Generic query analysis for "what should I do today" type questions
    const isGeneralQuery = 
      lowerMessage.includes("what should i do") || 
      lowerMessage.includes("help me with") || 
      lowerMessage.includes("how to get started");
      
    if (isGeneralQuery) {
      // For general queries, default to Listings + Advertising
      domainScores["Listings"] += 1;
      domainScores["Advertising"] += 1;
    }
    
    // Sort domains by score and get top scoring domains
    const scoredDomains = Object.entries(domainScores)
      .filter(([_, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([domain, _]) => domain);
    
    // If no clear matches, default to a reasonable domain
    if (scoredDomains.length === 0) {
      return { relevantDomains: ["Listings"] };
    }
    
    // Return top domains (up to 3) that have scores
    return { relevantDomains: scoredDomains.slice(0, 3) };
  };

  // Determine which agent should handle a follow-up question  
  const determineFollowUpAgent = (message: string, context: typeof problemContext): Agent => {
    const lowerMessage = message.toLowerCase();
    
    // Check if explicitly mentioning an agent or their domain
    for (const agent of agentsData) {
      if (lowerMessage.includes(agent.name.toLowerCase()) || 
          lowerMessage.includes(agent.domain.toLowerCase())) {
        return agent;
      }
    }
    
    // Otherwise, do keyword analysis similar to initial problem
    const domainScores: Record<string, number> = {};
    
    for (const domain of context.relevantDomains) {
      domainScores[domain] = 0;
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
    
    for (const domain in domainKeywords) {
      if (context.relevantDomains.includes(domain)) {
        for (const keyword of domainKeywords[domain]) {
          if (lowerMessage.includes(keyword)) {
            domainScores[domain] += 1;
          }
        }
      }
    }
    
    // Sort domains by score
    const topDomain = Object.entries(domainScores)
      .sort((a, b) => b[1] - a[1])
      .map(([domain, _]) => domain)[0] || context.relevantDomains[0];
    
    // Find the agent for this domain
    return agentsData.find(agent => agent.domain === topDomain) || 
           agentsData.find(agent => agent.domain === context.relevantDomains[0])!;
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
    
    // Base response templates for each domain
    const responseTemplates = {
      "Analytics": `Based on your analytics data, I can see some interesting trends. ${previousData["Advertising"] ? "Building on the advertising insights already shared, " : ""}Your conversion rate has improved by 12% this month, and there's a notable uptick in mobile traffic. I've analyzed your performance metrics and found several opportunities for optimization.`,
      
      "Inventory": `I've checked your inventory status. ${previousData["Listings"] ? "Now that we've identified your top-performing listings, " : ""}You currently have 5 products that are running low on stock. Based on historical sales data, I recommend restocking them within the next 2 weeks to avoid stockouts and capitalize on current demand.`,
      
      "Listings": `I've reviewed your product listings and identified several optimization opportunities. ${previousData["Customer Insights"] ? "Taking into account the customer feedback mentioned earlier, " : ""}Your main product could benefit from more persuasive bullet points and better keyword integration. I've analyzed top-performing listings in your category and found specific areas to improve.`,
      
      "Customer Insights": `After analyzing your recent reviews, I notice that customers consistently praise your product quality but mention concerns about shipping time. ${previousData["Competitor Insights"] ? "This aligns with the competitive analysis we saw earlier showing that " : ""}This represents an opportunity to set clearer expectations around delivery times and potentially improve your fulfillment process.`,
      
      "Competitor Insights": `I've been monitoring your main competitor. ${previousData["Analytics"] ? "Given the performance trends we observed, " : ""}They've adjusted their pricing strategy last week and are now offering bundle deals. This might impact your sales in the premium segment, but I've identified ways you can differentiate and maintain your market position.`,
      
      "Advertising": `Your current ad campaigns are performing well with a 3.2% CTR, but I see opportunities to optimize your targeting. ${previousData["Listings"] ? "With the listing improvements we discussed, " : ""}By refining your audience parameters and keyword strategy, we could potentially reduce your cost per acquisition by 15-20% while maintaining or improving conversion rates.`
    };
    
    // Generate a detailed, data-driven response for the specific domain
    const baseResponse = responseTemplates[agent.domain as keyof typeof responseTemplates];
    const detailedFindings = mockData[agent.domain as keyof typeof mockData];
    
    // Add specific, actionable steps based on domain
    let actionSteps = "";
    
    if (agent.domain === "Listings") {
      actionSteps = "\n\nI recommend focusing on these three key improvements:\n1. Enhance your main product image with better lighting and a clean white background\n2. Restructure your bullet points to lead with benefits rather than features\n3. Integrate more relevant keywords naturally throughout your description";
    } else if (agent.domain === "Advertising") {
      actionSteps = "\n\nHere are three targeted actions to improve your ad performance:\n1. Pause these 3 underperforming keywords and reallocate budget to your top converters\n2. Implement dayparting to increase bids during your highest-converting hours (6-9pm)\n3. Create mobile-specific ad copy to improve your mobile conversion rate";
    } else if (agent.domain === "Analytics") {
      actionSteps = "\n\nBased on these insights, I recommend these action items:\n1. Optimize your mobile checkout flow to capitalize on increased mobile traffic\n2. Expand product bundles for your top 3 performing products\n3. Investigate and improve the user journey for pages with high exit rates";
    }
    
    // Combine everything into a comprehensive, solution-oriented response
    const finalResponse = `${baseResponse}${actionSteps} Would you like me to explore any of these recommendations in more detail?`;
    
    return { 
      content: finalResponse, 
      data: detailedFindings 
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
        responseContent = "Here's a step-by-step approach to optimize your listings:\n\n1. Start by analyzing your current conversion rates per listing\n2. Identify your highest and lowest performing product pages\n3. Compare the content structure and keyword usage between them\n4. Enhance your product images with better lighting and multiple angles\n5. Rewrite bullet points to focus on benefits first, features second\n\nI've compared your current listings against top performers in your category and found that increasing your image count from 4 to 6 could improve conversion rates by approximately 8-12%.";
        responseData = {
          conversionImpactByElement: [
            "Images: +8-12% conversion impact",
            "Bullet points: +5-7% conversion impact",
            "Enhanced A+ content: +15-25% conversion impact"
          ]
        };
      } else if (agent.domain === "Advertising") {
        responseContent = "To improve your advertising ROI, follow these steps:\n\n1. Conduct a full keyword performance audit (I can help with this)\n2. Identify and pause keywords with high spend but low conversion\n3. Increase bids on your highest-converting keywords by 10-15%\n4. Implement negative keywords for irrelevant search terms\n5. Create product-specific ad groups for more targeted messaging\n\nBased on your account data, implementing these changes could improve your ROAS from 3.8 to approximately 4.5-5.0 within 30 days.";
        responseData = {
          optimizationOpportunities: [
            "Keyword cleanup: potential 12% reduction in wasted ad spend",
            "Bid optimization: potential 8% improvement in ROAS",
            "Ad copy testing: potential 15% improvement in CTR"
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
      }
    }
    
    // Default response if no specific pattern matched
    if (!responseContent) {
      responseContent = `Based on the ${agent.domain.toLowerCase()} data I've analyzed, I can see several opportunities for improvement. Let me provide you with some specific insights and actionable recommendations that address your question.`;
      
      // Add domain-specific insights
      if (agent.domain === "Inventory") {
        responseContent += "\n\nYour inventory turnover rate for the past 30 days is 4.2, which is slightly below the category average of 5.1. I recommend adjusting your restock quantities for these specific products to improve capital efficiency while maintaining optimal in-stock rates.";
      } else if (agent.domain === "Analytics") {
        responseContent += "\n\nYour conversion funnel shows a significant drop-off between cart addition and checkout initiation (32% abandonment). This is higher than the category benchmark of 24%. By implementing abandoned cart recovery emails and optimizing your checkout page, we could recover approximately 15-20% of these lost sales.";
      }
    }
    
    // Add collaboration suggestion with another relevant agent
    const otherRelevantAgents = context.relevantDomains
      .filter(domain => domain !== agent.domain)
      .map(domain => agentsData.find(a => a.domain === domain))
      .filter(Boolean) as Agent[];
    
    if (otherRelevantAgents.length > 0) {
      const collaboratingAgent = otherRelevantAgents[0];
      responseContent += `\n\nI think ${collaboratingAgent.name} might have additional insights on this from a ${collaboratingAgent.domain.toLowerCase()} perspective. Would you like their input as well?`;
    }
    
    return {
      content: responseContent,
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
