import { useState, useEffect, useRef } from 'react';
import { Subtask } from "@/pages/TaskWorkContainer";
import { AgentMessageArea } from '../chat-test/AgentMessageArea';
import { AgentInputArea } from '../chat-test/AgentInputArea';
import { Message as AgentMessage } from '../chat-test/AgentChatInterface';
import { DataLogTab } from './DataLogTab';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

interface JarvioAssistantProps {
  taskId: string;
  taskTitle?: string;
  taskDescription?: string;
  subtasks?: Subtask[];
  currentSubtaskIndex?: number;
  onSubtaskComplete?: (idx: number) => Promise<void>;
  onSubtaskSelect?: (idx: number) => void;
  onGenerateSteps?: () => void;
  taskData?: {
    flowId?: string;
    flowTrigger?: string;
  };
  isFlowTask?: boolean;
}

interface StepData {
  title: string;
  summary: string;
  details: string;
  nextStepIntro?: string;
}

export function JarvioAssistant({ 
  taskId,
  taskTitle = "Task",
  taskDescription = "",
  subtasks = [],
  currentSubtaskIndex = 0,
  onSubtaskComplete = async () => {},
  onSubtaskSelect = () => {},
  onGenerateSteps,
  taskData,
  isFlowTask = false
}: JarvioAssistantProps) {
  // Demo mode state
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"chat" | "log">("chat");
  const [flowStarted, setFlowStarted] = useState<boolean>(false);
  const [autoRunning, setAutoRunning] = useState<boolean>(false);
  const [convertedSubtasks, setConvertedSubtasks] = useState<any[]>([]);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [greetingSent, setGreetingSent] = useState<boolean>(false);
  const [stepData, setStepData] = useState<Record<string, StepData>>({});
  const [waitingForUserFeedback, setWaitingForUserFeedback] = useState<boolean>(false);
  const [attemptedSteps, setAttemptedSteps] = useState<Set<string>>(new Set());
  const [lastUserMessage, setLastUserMessage] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // For tracking steps in retry loop to prevent infinite attempts
  const [stepRetryCount, setStepRetryCount] = useState<Record<string, number>>({});

  // Convert subtasks to the format expected by DataLogTab
  useEffect(() => {
    const newConvertedSubtasks = subtasks.map((subtask, idx) => {
      return {
        id: subtask.id || String(idx),
        title: subtask.title,
        done: subtask.done || false,
        data: stepData[subtask.id]?.details || null
      };
    });
    setConvertedSubtasks(newConvertedSubtasks);
  }, [subtasks, stepData]);

  // Set up initial greeting - simplified to ensure exactly one message
  useEffect(() => {
    // If already initialized, skip
    if (initialized) return;
    
    // Mark as initialized immediately
    setInitialized(true);
    
    // Create a single greeting with a short delay
    const timer = setTimeout(() => {
      // First clear any existing messages to guarantee no duplicates
      setMessages([]);
      
      // Add exactly one greeting
      const flowTitle = isFlowTask ? 
        (taskTitle.startsWith("Flow:") ? taskTitle : "Flow: " + taskTitle) : 
        taskTitle;
      const greetings = [
        `Hi, I'm Jarvio. Let me know when you're ready to get started with ${flowTitle}.`,
        `Hello! Let me know when you're ready to start our ${flowTitle} process.`,
        `I'm here to help with ${flowTitle}. Just let me know when you're ready to begin.`,
        `Ready whenever you are to work on ${flowTitle}. Let me know when to start.`,
        `Let me know when you'd like to get started with ${flowTitle}.`
      ];
      
      const greeting = greetings[Math.floor(Math.random() * greetings.length)];
      
      // Add exactly one message
      setMessages([{
        id: crypto.randomUUID(),
        text: greeting,
        isUser: false,
        timestamp: new Date()
      }]);
    }, 500);
    
    // Clean up timeout
    return () => clearTimeout(timer);
  }, []);

  // Auto-run next steps
  useEffect(() => {
    let timer: number;
    
    if (flowStarted && autoRunning && !isLoading && !waitingForUserFeedback) {
      // Find next undone subtask
      const nextSubtaskIndex = subtasks.findIndex(subtask => !subtask.done);
      
      if (nextSubtaskIndex >= 0 && nextSubtaskIndex < subtasks.length) {
        const subtaskId = subtasks[nextSubtaskIndex].id;
        
        // Only proceed if we haven't attempted this step yet
        if (!attemptedSteps.has(subtaskId)) {
          // First, if we've completed a previous step, show a transition message
          const previousStepIndex = nextSubtaskIndex - 1;
          
          if (previousStepIndex >= 0 && subtasks[previousStepIndex]?.done) {
            timer = window.setTimeout(async () => {
              try {
                const currentStepTitle = subtasks[previousStepIndex].title;
                const nextStepTitle = subtasks[nextSubtaskIndex].title;
                
                // Get details from previous step to inform the transition
                const prevStepData = stepData[subtasks[previousStepIndex].id];
                
                // If we already have a nextStepIntro from the previous step's data, use it
                if (prevStepData?.nextStepIntro) {
                  addAgentMessage(prevStepData.nextStepIntro);
                } else {
                  // Generate data directly, similar to data generation
                  const transitionMessage = await generateDummyTransition(currentStepTitle, nextStepTitle);
                  if (transitionMessage) {
                    addAgentMessage(transitionMessage);
                  }
                }
                
                // Proceed to the next step after a short delay
                setTimeout(() => {
                  setAttemptedSteps(prev => new Set(prev).add(subtaskId));
                  executeNextStep(nextSubtaskIndex, nextSubtaskIndex === 2);
                }, 1500);
              } catch (error) {
                // If anything fails, just move to the next step silently
                setAttemptedSteps(prev => new Set(prev).add(subtaskId));
                executeNextStep(nextSubtaskIndex, nextSubtaskIndex === 2);
              }
            }, 1500);
          } else {
            // If this is the first step, just execute it without transition
            timer = window.setTimeout(() => {
              setAttemptedSteps(prev => new Set(prev).add(subtaskId));
              executeNextStep(nextSubtaskIndex, nextSubtaskIndex === 2);
            }, 1500);
          }
        }
      } else {
        // Complete flow
        if (subtasks.every(subtask => subtask.done)) {
          timer = window.setTimeout(async () => {
            // Use simple completion message approach
            const completionMessage = await generateDummyCompletion(taskTitle);
            if (completionMessage) {
              addAgentMessage(completionMessage);
            }
            setAutoRunning(false);
          }, 1500);
        }
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [flowStarted, autoRunning, isLoading, subtasks, waitingForUserFeedback, attemptedSteps, stepData]);

  // Generate domain-specific mock data for each step
  const generateDummyContent = async (taskTitle: string, stepTitle: string): Promise<string> => {
    try {
      // Call a simple delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const stepTitleLower = stepTitle.toLowerCase();
      const taskTitleLower = taskTitle.toLowerCase();
      
      // For inventory-related steps
      if (stepTitleLower.includes("inventory") || stepTitleLower.includes("stock")) {
        const products = [
          { name: "Stainless Steel Water Bottle", sku: "WB-SS-001", stock: Math.floor(Math.random() * 150) + 10, reorderPoint: Math.floor(Math.random() * 30) + 5 },
          { name: "Organic Cotton T-Shirt", sku: "TS-OC-102", stock: Math.floor(Math.random() * 200) + 20, reorderPoint: Math.floor(Math.random() * 40) + 10 },
          { name: "Bamboo Cutting Board", sku: "KB-BC-054", stock: Math.floor(Math.random() * 80) + 5, reorderPoint: Math.floor(Math.random() * 20) + 5 },
          { name: "Ceramic Coffee Mug", sku: "CM-CR-033", stock: Math.floor(Math.random() * 120) + 15, reorderPoint: Math.floor(Math.random() * 25) + 10 },
          { name: "Wireless Earbuds", sku: "EA-WL-076", stock: Math.floor(Math.random() * 100) + 5, reorderPoint: Math.floor(Math.random() * 15) + 5 }
        ];
        
        // Randomly select which products are low in inventory
        const lowStockProducts = products.filter(p => Math.random() > 0.6);
        lowStockProducts.forEach(p => p.stock = Math.floor(Math.random() * p.reorderPoint));
        
        return `# Current Inventory Levels

## Inventory Summary
- **Total SKUs**: ${products.length}
- **Total Units**: ${products.reduce((sum, p) => sum + p.stock, 0)}
- **Low Stock Items**: ${lowStockProducts.length}
- **Out of Stock Items**: ${Math.floor(Math.random() * 2)}

## Low Stock Alerts
${lowStockProducts.map(p => `- **${p.name}** (${p.sku}): ${p.stock} units remaining (Reorder Point: ${p.reorderPoint})`).join('\n')}

## Inventory by Product
| Product | SKU | Current Stock | Reorder Point | Status |
|---------|-----|---------------|---------------|--------|
${products.map(p => `| ${p.name} | ${p.sku} | ${p.stock} | ${p.reorderPoint} | ${p.stock <= p.reorderPoint ? '⚠️ Low' : '✅ Good'} |`).join('\n')}

## Recommendations
- Immediate restock needed for ${lowStockProducts.map(p => p.name).join(', ')}
- Consider increasing reorder points for seasonal items
- Review lead times with suppliers for frequently low stock items`;
      }
      
      // For sales data analysis
      if (stepTitleLower.includes("sales")) {
        const months = ['January', 'February', 'March', 'April', 'May', 'June'];
        const salesData = months.map(month => ({
          month,
          revenue: Math.floor(Math.random() * 50000) + 10000,
          units: Math.floor(Math.random() * 500) + 100,
          avgOrderValue: Math.floor(Math.random() * 100) + 50
        }));
        
        // Calculate growth rates
        const totalRevenue = salesData.reduce((sum, m) => sum + m.revenue, 0);
        const totalUnits = salesData.reduce((sum, m) => sum + m.units, 0);
        const growthRate = Math.floor(Math.random() * 30) - 5; // Between -5% and 25%
        
        // Find top product
        const products = ["Stainless Steel Water Bottle", "Organic Cotton T-Shirt", "Bamboo Cutting Board", "Ceramic Coffee Mug", "Wireless Earbuds"];
        const topProduct = products[Math.floor(Math.random() * products.length)];
        const topProductPercentage = Math.floor(Math.random() * 30) + 15; // Between 15% and 45%
        
        return `# Monthly Sales Analysis

## Sales Overview (Last 6 Months)
- **Total Revenue**: $${totalRevenue.toLocaleString()}
- **Total Units Sold**: ${totalUnits.toLocaleString()}
- **Average Order Value**: $${Math.floor(totalRevenue/totalUnits)}
- **YoY Growth**: ${growthRate}%
- **Best Performing Month**: ${salesData.sort((a, b) => b.revenue - a.revenue)[0].month}

## Monthly Breakdown
| Month | Revenue | Units Sold | Avg Order Value |
|-------|---------|------------|-----------------|
${salesData.map(m => `| ${m.month} | $${m.revenue.toLocaleString()} | ${m.units} | $${m.avgOrderValue} |`).join('\n')}

## Product Performance
- **Top Selling Product**: ${topProduct} (${topProductPercentage}% of total revenue)
- **Fastest Growing**: ${products[Math.floor(Math.random() * products.length)]} (+${Math.floor(Math.random() * 40) + 10}%)
- **Declining Products**: ${Math.random() > 0.5 ? products[Math.floor(Math.random() * products.length)] : 'None'} (${Math.random() > 0.5 ? '-' + (Math.floor(Math.random() * 15) + 5) + '%' : 'N/A'})

## Recommendations
- ${Math.random() > 0.5 ? 'Consider bundling top sellers with slower moving inventory' : 'Increase inventory for top sellers before the holiday season'}
- ${Math.random() > 0.5 ? 'Review pricing strategy for declining products' : 'Implement targeted promotions for slower moving products'}
- ${Math.random() > 0.5 ? 'Optimize advertising spend toward best performing products' : 'Explore new marketing channels to diversify customer acquisition'}`;
      }
      
      // For turnover rate analysis
      if (stepTitleLower.includes("turnover")) {
        const categories = ["Apparel", "Electronics", "Home Goods", "Kitchen", "Accessories"];
        const turnoverData = categories.map(category => ({
          category,
          turnoverRate: (Math.random() * 10 + 2).toFixed(1),
          avgDaysInStock: Math.floor(Math.random() * 60) + 10,
          profit: (Math.random() * 0.4 + 0.2).toFixed(2) // 20% to 60% profit margin
        }));
        
        const overallTurnover = (turnoverData.reduce((sum, c) => sum + parseFloat(c.turnoverRate), 0) / turnoverData.length).toFixed(1);
        const industryAvg = (parseFloat(overallTurnover) + (Math.random() * 4 - 2)).toFixed(1);
        
        return `# Inventory Turnover Analysis

## Overall Performance
- **Average Turnover Rate**: ${overallTurnover} turns per year
- **Industry Average**: ${industryAvg} turns per year
- **Best Performing Category**: ${turnoverData.sort((a, b) => parseFloat(b.turnoverRate) - parseFloat(a.turnoverRate))[0].category}
- **Slowest Moving Category**: ${turnoverData.sort((a, b) => parseFloat(a.turnoverRate) - parseFloat(b.turnoverRate))[0].category}

## Category Breakdown
| Category | Turnover Rate | Avg Days in Stock | Profit Margin |
|----------|---------------|-------------------|---------------|
${turnoverData.map(c => `| ${c.category} | ${c.turnoverRate} | ${c.avgDaysInStock} days | ${c.profit}% |`).join('\n')}

## Efficiency Analysis
- **Cash Conversion Cycle**: ${Math.floor(Math.random() * 40) + 20} days
- **Inventory Carrying Cost**: ${(Math.random() * 0.2 + 0.1).toFixed(2)}% of inventory value
- **Dead Stock Percentage**: ${(Math.random() * 0.1 + 0.02).toFixed(2)}% of total inventory

## Recommendations
- Implement JIT ordering for ${turnoverData.sort((a, b) => parseFloat(b.turnoverRate) - parseFloat(a.turnoverRate))[0].category} to maintain optimal stock levels
- Review pricing and promotion strategy for ${turnoverData.sort((a, b) => parseFloat(a.turnoverRate) - parseFloat(b.turnoverRate))[0].category} to increase velocity
- Consider liquidation options for slow-moving inventory older than ${Math.floor(Math.random() * 60) + 90} days`;
      }
      
      // For demand forecasting
      if (stepTitleLower.includes("forecast") || stepTitleLower.includes("demand")) {
        const products = ["Stainless Steel Water Bottle", "Organic Cotton T-Shirt", "Bamboo Cutting Board", "Ceramic Coffee Mug", "Wireless Earbuds"];
        const months = ["July", "August", "September", "October", "November", "December"];
        
        const forecastData = products.map(product => ({
          product,
          forecast: months.map(month => Math.floor(Math.random() * 200) + 50),
          growth: (Math.random() * 0.3 - 0.05).toFixed(2), // -5% to 25% growth
          confidence: (Math.random() * 0.3 + 0.7).toFixed(2) // 70% to 100% confidence
        }));
        
        return `# Demand Forecast Analysis

## 6-Month Forecast Summary
- **Total Forecasted Units**: ${forecastData.reduce((sum, p) => sum + p.forecast.reduce((s, f) => s + f, 0), 0).toLocaleString()}
- **Highest Demand Month**: ${months[Math.floor(Math.random() * months.length)]}
- **Overall Growth Trend**: ${(Math.random() * 0.25 + 0.05).toFixed(2)}% increase expected

## Product-Level Forecasts
${forecastData.map(p => 
`### ${p.product}
- **6-Month Total**: ${p.forecast.reduce((sum, f) => sum + f, 0)} units
- **Monthly Average**: ${Math.floor(p.forecast.reduce((sum, f) => sum + f, 0) / months.length)} units
- **Growth Rate**: ${parseFloat(p.growth) > 0 ? '+' : ''}${(parseFloat(p.growth) * 100).toFixed(1)}%
- **Forecast Confidence**: ${(parseFloat(p.confidence) * 100).toFixed(1)}%
`).join('\n')}

## Monthly Breakdown
| Product | ${months.join(' | ')} |
|---------|${months.map(() => '--------|').join('')}
${forecastData.map(p => `| ${p.product} | ${p.forecast.join(' | ')} |`).join('\n')}

## Inventory Planning Recommendations
- Order ${Math.floor(Math.random() * 500) + 300} units of ${forecastData[0].product} for Q3
- Increase safety stock for seasonal products by ${Math.floor(Math.random() * 15) + 10}%
- Prepare contingency plans for ${forecastData[Math.floor(Math.random() * forecastData.length)].product} due to higher forecast volatility`;
      }
      
      // For Amazon-specific steps (if applicable)
      if (taskTitleLower.includes("amazon") && stepTitleLower.includes("collect")) {
        const products = [
          { name: "Stainless Steel Water Bottle", asin: "B07XYZ1234", rating: (Math.random() * 1 + 4).toFixed(1), reviews: Math.floor(Math.random() * 1000) + 100 },
          { name: "Organic Cotton T-Shirt", asin: "B07ABC5678", rating: (Math.random() * 1 + 4).toFixed(1), reviews: Math.floor(Math.random() * 800) + 50 },
          { name: "Bamboo Cutting Board", asin: "B07DEF9012", rating: (Math.random() * 1 + 4).toFixed(1), reviews: Math.floor(Math.random() * 500) + 30 },
          { name: "Ceramic Coffee Mug", asin: "B07GHI3456", rating: (Math.random() * 1 + 4).toFixed(1), reviews: Math.floor(Math.random() * 300) + 20 },
          { name: "Wireless Earbuds", asin: "B07JKL7890", rating: (Math.random() * 1 + 4).toFixed(1), reviews: Math.floor(Math.random() * 1200) + 150 }
        ];
        
        return `# Product Information from Amazon

## Listings Overview
- **Total Active Listings**: ${products.length}
- **Average Rating**: ${(products.reduce((sum, p) => sum + parseFloat(p.rating), 0) / products.length).toFixed(1)}★
- **Total Reviews**: ${products.reduce((sum, p) => sum + p.reviews, 0)}
- **Best Performer**: ${products.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))[0].name}

## Product Details
${products.map(p => 
`### ${p.name}
- **ASIN**: ${p.asin}
- **Rating**: ${p.rating}★ (${p.reviews} reviews)
- **BSR**: ${Math.floor(Math.random() * 10000) + 1000} in ${['Home & Kitchen', 'Sports & Outdoors', 'Electronics', 'Clothing', 'Kitchen & Dining'][Math.floor(Math.random() * 5)]}
- **Buy Box Status**: ${Math.random() > 0.2 ? '✅ Owned' : '❌ Lost to competitor'}
- **Pricing**: $${(Math.random() * 50 + 10).toFixed(2)} (${Math.random() > 0.5 ? '+' : '-'}${(Math.random() * 5).toFixed(2)}% vs. competition)
`).join('\n')}

## Optimization Opportunities
- ${Math.random() > 0.5 ? 'Title keyword optimization needed for 3 listings' : 'A+ content missing from 2 listings'}
- ${Math.random() > 0.5 ? 'Additional images recommended for better conversion' : 'Enhanced brand content opportunity for top performer'}
- ${Math.random() > 0.5 ? 'Review response rate below target (currently 35%)' : 'Consider adding video content to 3 listings'}`;
      }
      
      // Default content for other step types
      return `# ${stepTitle} Results

## Analysis
${Math.random() > 0.5 ? 'Our detailed analysis shows several key insights for ' + stepTitle.toLowerCase() + '.' : 'We\'ve collected and analyzed data for the ' + stepTitle.toLowerCase() + ' step.'}

## Key Findings
- ${Math.random() > 0.5 ? 'Current performance metrics are ' + (Math.random() > 0.5 ? 'above' : 'below') + ' industry benchmarks' : 'Identified ' + Math.floor(Math.random() * 3 + 2) + ' areas for immediate optimization'}
- ${Math.random() > 0.5 ? 'Historical data shows a ' + (Math.random() > 0.5 ? 'positive' : 'concerning') + ' trend in key metrics' : 'Competitor analysis reveals opportunity for differentiation'}
- ${Math.random() > 0.5 ? 'Cost efficiency can be improved by ' + Math.floor(Math.random() * 15 + 5) + '%' : 'Customer feedback indicates strong interest in new features'}

## Recommendations
${Math.random() > 0.5 ? 
  '1. Implement automated monitoring system\n2. Adjust procurement strategy based on findings\n3. Update forecasting models with new data' : 
  '1. Revise strategy for underperforming segments\n2. Allocate additional resources to high-growth areas\n3. Establish regular review process for key metrics'}`;
    } catch (err) {
      console.error("Failed to generate dummy content:", err);
      return `# ${stepTitle} Results\n\nPlaceholder content for ${stepTitle.toLowerCase()}.`;
    }
  };

  // Generate step data using AI
  const generateStepData = async (stepIndex: number) => {
    const subtask = subtasks[stepIndex];
    if (!subtask) return null;
    
    try {
      // Generate mock data content (keep this as is)
      const details = await generateDummyContent(taskTitle, subtask.title);
      
      // Generate a simple AI summary
      let summary = '';
      try {
        const { data } = await supabase.functions.invoke('chat-completion', {
          body: { 
            prompt: `Write ONE brief sentence (10-20 words) describing insights found in the "${subtask.title}" step of a business analysis. 
            Include specific business metrics. Avoid introductory phrases like "Our analysis shows" or "We found".`,
            max_tokens: 60,
            temperature: 0.7
          }
        });
        
        summary = data?.text?.trim() || '';
      } catch (error) {
        // No fallback if API fails
      }
      
      // Generate a simple transition if this isn't the last step
      let nextStepIntro = null;
      try {
        const nextStepIndex = stepIndex + 1;
        if (nextStepIndex < subtasks.length) {
          const nextStepTitle = subtasks[nextStepIndex].title;
          
          const { data } = await supabase.functions.invoke('chat-completion', {
            body: { 
              prompt: `Write one brief, conversational sentence (15-25 words) that transitions from "${subtask.title}" to "${nextStepTitle}" in a business analysis workflow. No introductory phrases like "Now let's" or "Next, we'll".`,
              max_tokens: 60,
              temperature: 0.7
            }
          });
          
          nextStepIntro = data?.text?.trim() || null;
        }
      } catch (error) {
        // No fallback if API fails
      }
      
      return {
        title: subtask.title,
        summary,
        details,
        nextStepIntro
      };
    } catch (err) {
      // If everything fails, return null and let the caller handle it
      return null;
    }
  };

  // Start the flow
  const startFlow = () => {
    setFlowStarted(true);
    setAutoRunning(true);
  };

  // Execute the next step in the flow
  const executeNextStep = async (stepIndex: number, pauseAfterExecution = false) => {
    if (stepIndex >= subtasks.length || isLoading) return;
    
    setIsLoading(true);
    
    // First show loading message
    addLoadingMessage(stepIndex, subtasks[stepIndex].title);
    
    try {
      // Generate step data using AI
      const stepResult = await generateStepData(stepIndex);
      
      if (stepResult) {
        // Store the step data
        setStepData(prev => ({
          ...prev,
          [subtasks[stepIndex].id]: stepResult
        }));
        
        // After a delay, show the completion message and update subtask state
        setTimeout(async () => {
          // Remove loading message
          setMessages(prev => prev.filter(msg => !msg.isLoading));
          
          // Add step completion notification
          addAgentMessage("", true, stepIndex + 1);
          
          // Get the summary - if we don't have one, don't display anything rather than using a fallback
          const summaryMessage = stepResult.summary;
          
          // Only add a summary message if we have one
          if (summaryMessage) {
            addAgentMessage(summaryMessage);
          }
          
          // Mark subtask as complete and trigger callback
          await onSubtaskComplete(stepIndex);
          
          // Update the local state for convertedSubtasks to reflect completion
          setConvertedSubtasks(prev => 
            prev.map((subtask, idx) => 
              idx === stepIndex ? { ...subtask, done: true, data: stepResult.details } : subtask
            )
          );
          
          // If this is step 3 (index 2), we need to pause and ask for user feedback
          if (pauseAfterExecution) {
            setTimeout(async () => {
              try {
                // Generate feedback prompt using same approach as other dummy content
                const feedbackMessages = [
                  `These results from ${subtasks[stepIndex].title.toLowerCase()} look promising. Would you like to continue with the analysis or should we refine anything?`,
                  `Now that we've analyzed ${subtasks[stepIndex].title.toLowerCase()}, would you like to proceed to the next step or adjust our approach?`,
                  `The ${subtasks[stepIndex].title.toLowerCase()} data shows several insights. Should we explore any specific aspect further before continuing?`,
                  `Based on these ${subtasks[stepIndex].title.toLowerCase()} findings, would you like to continue or refine our analysis in any way?`,
                  `We've completed the ${subtasks[stepIndex].title.toLowerCase()} step. Is there anything specific you'd like to focus on before we move forward?`
                ];
                
                const feedbackPrompt = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
                addAgentMessage(feedbackPrompt);
              } catch (error) {
                // No fallback needed
              }
              
              setWaitingForUserFeedback(true);
              setAutoRunning(false);
            }, 1000);
          }
          
          setIsLoading(false);
        }, 1500);
      } else {
        // Handle error by silently moving on
        setMessages(prev => prev.filter(msg => !msg.isLoading));
        setIsLoading(false);
      }
    } catch (error) {
      // Handle error by silently moving on
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      setIsLoading(false);
    }
  };

  // Generate a conversational, natural-sounding summary of a completed step
  const generateConversationalSummary = async (
    stepIndex: number,
    details: string,
    fallbackSummary: string
  ): Promise<string> => {
    try {
      const stepTitle = subtasks[stepIndex].title;
      
      // Extract the most relevant sections from the details
      // First 300 chars plus any section that has numbers, stats, or key findings
      const detailsLines = details.split('\n');
      const statsPattern = /\d+%|\$[\d,]+|(\d+[\.,]?\d*)/;
      const keyResultsPattern = /(key|top|main|primary|critical|essential|important).{0,20}(findings|results|insights|takeaways|issues|problems)/i;
      
      // Get the introduction part and any lines with statistics
      const intro = details.substring(0, 300);
      const statsLines = detailsLines
        .filter(line => statsPattern.test(line) || keyResultsPattern.test(line))
        .slice(0, 10) // Limit to 10 key stats/lines
        .join('\n');
        
      // Combine them for the context
      const extractedDetails = `${intro}\n\n${statsLines}`;
      
      // Send request to OpenAI API
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: { 
          prompt: `You're an AI assistant helping a user with a workflow. 
          You just finished step "${stepTitle}" in a ${taskTitle} workflow.
          
          The analysis results include the following key data:
          ${extractedDetails}
          
          Write a brief (2-3 sentences), conversational summary of what you found or accomplished in this step.
          
          Guidelines:
          - Reference specific numbers, metrics, or findings from the data
          - Mention exact percentages, dollar amounts, or counts when available
          - Start directly with the substance - don't use phrases like "I found" or "Analysis shows"
          - Make it sound like a knowledgeable colleague explaining what they discovered
          - Keep it concise but informative, focusing on the most important insights
          - Highlight anomalies, trends, or action items from the data
          - Use a confident, authoritative but friendly tone
          
          Example good summary:
          "Our inventory analysis revealed 4 products below reorder point, with Wireless Earbuds at critically low stock (1 unit). Overall turnover rate is 4.2x annually, which is 12% below industry average."`,
          max_tokens: 180,
          temperature: 0.7
        }
      });
      
      if (error || !data?.text) {
        console.log("Error generating conversational summary:", error);
        return fallbackSummary;
      }
      
      return data.text.trim();
    } catch (err) {
      console.error("Failed to generate conversational summary:", err);
      return fallbackSummary;
    }
  };
  
  // Generate a transition message between steps
  const generateTransitionMessage = async (
    completedStepIndex: number,
    nextStepIndex: number
  ): Promise<string> => {
    try {
      console.log(`Inside generateTransitionMessage: From step ${completedStepIndex} to ${nextStepIndex}`);
      const completedStep = subtasks[completedStepIndex];
      const nextStep = subtasks[nextStepIndex];
      
      if (!completedStep || !nextStep) {
        return '';
      }
      
      // Direct call to Supabase function
      const { data } = await supabase.functions.invoke('chat-completion', {
        body: { 
          prompt: `Write one brief, conversational sentence (15-25 words) that transitions from "${completedStep.title}" to "${nextStep.title}" in a business analysis workflow. No introductory phrases like "Now let's" or "Next, we'll".`,
          max_tokens: 60,
          temperature: 0.7
        }
      });
      
      // Return whatever we get, or empty string
      return data?.text?.trim() || '';
    } catch (err) {
      console.error("Failed to generate transition:", err);
      // Return empty string instead of fallback
      return '';
    }
  };
  
  // Generate feedback request after step 3
  const generateFeedbackPrompt = async (stepIndex: number): Promise<string> => {
    try {
      // Get data from the current and previous steps to reference
      const currentStepData = stepData[subtasks[stepIndex]?.id];
      const previousSteps = subtasks.slice(0, stepIndex + 1).filter(step => step.done);
      const completedStepTitles = previousSteps.map(step => step.title).join(", ");
      
      // Extract specific findings to reference in the prompt
      const currentStepSummary = currentStepData?.summary || "";
      const currentStepDetails = currentStepData?.details || "";
      
      // Send request to OpenAI API
      const { data, error } = await supabase.functions.invoke('chat-completion', {
        body: { 
          prompt: `You're an AI assistant helping with a ${taskTitle} workflow.
          
          We've just completed ${previousSteps.length} steps, including:
          ${completedStepTitles}
          
          The most recent step was "${subtasks[stepIndex].title}"
          
          Recent step analysis:
          ${currentStepSummary}
          
          Sample data from this step:
          ${currentStepDetails.substring(0, 500)}
          
          Write a message asking the user if they're happy with the results so far or if they'd like any adjustments.
          
          Guidelines:
          - Reference specific findings or data points from the completed steps
          - Ask if the user wants to refine any particular aspect of the analysis
          - Make it conversational and natural, like a colleague checking in
          - Keep it under 40 words
          - Avoid generic language like "How does this look?"
          - Be specific about what they might want to refine
          
          Example good check-in:
          "We've analyzed inventory levels and sales data, identifying 3 low-stock products and 2 high-growth categories. Would you like to adjust our turnover analysis or continue to the next step?"`,
          max_tokens: 120,
          temperature: 0.8
        }
      });
      
      if (error || !data?.text) {
        console.log("Error generating feedback prompt:", error);
        return `Looking at the results from ${subtasks[stepIndex].title}, do these insights meet your needs or would you like me to refine the analysis?`;
      }
      
      return data.text.trim();
    } catch (err) {
      console.error("Failed to generate feedback prompt:", err);
      return "How do these insights look so far? Would you like me to make any adjustments before continuing?";
    }
  };

  // Add agent message
  const addAgentMessage = (text: string, isStepCompletion = false, stepNumber?: number) => {
    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        isUser: false,
        timestamp: new Date(),
        isStepCompletion,
        stepNumber
      }
    ]);
  };

  // Add user message
  const addUserMessage = (text: string) => {
    // Prevent duplicate messages
    if (text === lastUserMessage) return;
    
    setLastUserMessage(text);
    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        isUser: true,
        timestamp: new Date()
      }
    ]);
  };

  // Add loading message
  const addLoadingMessage = (stepIndex: number, stepTitle: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: `${stepTitle}...`,
        isUser: false,
        timestamp: new Date(),
        isLoading: true,
        stepNumber: stepIndex + 1
      }
    ]);
  };

  // Handle user message submission
  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message to the chat
    addUserMessage(inputValue);
    const userInput = inputValue.toLowerCase();
    setInputValue("");
    
    setIsLoading(true);
    
    // Check if this is a flow-starting message
    const isStartCommand = userInput.includes("yes") || 
                           userInput.includes("start") || 
                           userInput.includes("begin") || 
                           userInput.includes("walk me through") ||
                           userInput.includes("go ahead");
    
    // Check if this is a redo request
    const isRedoRequest = userInput.includes("redo") ||
                          userInput.includes("try again") ||
                          userInput.includes("do it again") ||
                          userInput.includes("revise") ||
                          userInput.includes("change") ||
                          userInput.includes("adjust") ||
                          userInput.includes("fix");
    
    // Check if user wants to continue after pausing for feedback
    const isContinueRequest = userInput.includes("continue") ||
                              userInput.includes("next") ||
                              userInput.includes("move on") ||
                              userInput.includes("looks good") ||
                              userInput.includes("proceed") ||
                              userInput.includes("fine") ||
                              userInput.includes("great");
    
    setTimeout(() => {
      if (!flowStarted && isStartCommand) {
        // Start the flow if user is confirming they want to start
        setFlowStarted(true);
        addAgentMessage(`Great! Let me walk you through our ${taskTitle} process. I'll guide you through each step of the way.`);
        setAutoRunning(true);
      } else if (flowStarted && waitingForUserFeedback) {
        // Handle feedback after pausing (typically after step 3)
        if (isContinueRequest) {
          // Continue with the flow
          const currentStepIndex = subtasks.findIndex(subtask => !subtask.done) - 1;
          const currentStep = subtasks[currentStepIndex];
          const nextStep = subtasks[currentStepIndex + 1];
          
          let message = '';
          
          // Generate a custom continuation message based on the context
          if (currentStep && nextStep) {
            const responses = [
              `Perfect! We'll continue with ${nextStep.title.toLowerCase()} to build on our ${currentStep.title.toLowerCase()} findings.`,
              `Excellent. Moving forward with ${nextStep.title.toLowerCase()} will help us gain additional insights.`,
              `Great! Let's proceed with ${nextStep.title.toLowerCase()} to complete our analysis workflow.`,
              `Sounds good! The ${nextStep.title.toLowerCase()} step will complement what we found in ${currentStep.title.toLowerCase()}.`,
              `Perfect. We'll now move on to ${nextStep.title.toLowerCase()} to expand on these results.`
            ];
            message = responses[Math.floor(Math.random() * responses.length)];
          } else {
            message = "Great! Let's continue with the next steps in the process.";
          }
          
          addAgentMessage(message);
          setWaitingForUserFeedback(false);
          setAutoRunning(true);
        } else if (isRedoRequest) {
          // Redo the previous step (step 3 / index 2 if we're at the feedback point)
          const stepToRevise = subtasks.findIndex(subtask => !subtask.done) - 1;
          if (stepToRevise >= 0) {
            const stepTitle = subtasks[stepToRevise].title;
            const responses = [
              `I'll revise the ${stepTitle.toLowerCase()} analysis to better address your needs.`,
              `Let's take another look at ${stepTitle.toLowerCase()} with a different approach.`,
              `I'll update the ${stepTitle.toLowerCase()} data to provide more relevant insights.`,
              `No problem! I'll refine the ${stepTitle.toLowerCase()} analysis for you.`,
              `I'll rerun the ${stepTitle.toLowerCase()} step with adjusted parameters.`
            ];
            
            const message = responses[Math.floor(Math.random() * responses.length)];
            addAgentMessage(message);
            
            // Reset that step's completion status
            setConvertedSubtasks(prev => 
              prev.map((subtask, idx) => 
                idx === stepToRevise ? { ...subtask, done: false } : subtask
              )
            );
            
            // Remove from attempted steps so it can be retried
            setAttemptedSteps(prev => {
              const newSet = new Set(prev);
              newSet.delete(subtasks[stepToRevise].id);
              return newSet;
            });
            
            // Re-execute that step with the pause flag set to true (to ask for feedback again)
            setTimeout(() => {
              executeNextStep(stepToRevise, true);
            }, 1000);
          } else {
            // Fallback if we can't determine which step to revise
            addAgentMessage("I'm not sure which step you'd like me to revise. Let's continue with the next steps, and you can let me know if you'd like to make changes later.");
            setWaitingForUserFeedback(false);
            setAutoRunning(true);
          }
        } else {
          // For any other input during the feedback pause, ask for clarification
          const currentStepIndex = subtasks.findIndex(subtask => !subtask.done) - 1;
          const currentStep = subtasks[currentStepIndex];
          
          if (currentStep) {
            const responses = [
              `Would you like to continue to the next step, or should I revise the ${currentStep.title.toLowerCase()} analysis?`,
              `I'm waiting for your feedback on the ${currentStep.title.toLowerCase()} results. Should we proceed or make adjustments?`,
              `Do you want to continue with the workflow, or would you prefer I adjust the ${currentStep.title.toLowerCase()} results?`
            ];
            
            const message = responses[Math.floor(Math.random() * responses.length)];
            addAgentMessage(message);
          } else {
            addAgentMessage("Would you like to continue to the next steps, or should I revise any of the recommendations I've provided so far?");
          }
        }
      } else if (flowStarted && isRedoRequest) {
        // Find the last completed step or the current failing step
        const lastCompletedIndex = subtasks.findIndex(subtask => !subtask.done) - 1;
        const redoIndex = lastCompletedIndex >= 0 ? lastCompletedIndex : 0;
        
        if (redoIndex >= 0 && redoIndex < subtasks.length) {
          const responses = [
            `I'll revise the previous step to better suit your needs.`,
            `Let me recalculate that for you with a different approach.`,
            `I'll re-run the analysis on that step with adjusted parameters.`,
            `I'll update the previous analysis with more relevant data.`
          ];
          
          const message = responses[Math.floor(Math.random() * responses.length)];
          addAgentMessage(message);
          
          // Reset that step's completion status
          setConvertedSubtasks(prev => 
            prev.map((subtask, idx) => 
              idx === redoIndex ? { ...subtask, done: false } : subtask
            )
          );
          
          // Remove from attempted steps so it can be retried
          setAttemptedSteps(prev => {
            const newSet = new Set(prev);
            newSet.delete(subtasks[redoIndex].id);
            return newSet;
          });
          
          // Re-execute that step
          setTimeout(() => {
            executeNextStep(redoIndex, redoIndex === 2); // Set pause flag if this is step 3
          }, 1000);
        } else {
          addAgentMessage("There are no completed steps to revise yet. Let's start the process.");
          setAutoRunning(true);
        }
      } else if (flowStarted) {
        // Generic response if flow is already running but not at a feedback point
        const responses = [
          `I'll continue with the process. Let me help you with the next step.`,
          `Continuing with the analysis workflow now.`,
          `Moving forward with the next steps in our analysis.`,
          `I'll proceed with the remaining steps in our workflow.`
        ];
        
        const message = responses[Math.floor(Math.random() * responses.length)];
        addAgentMessage(message);
        
        // Resume auto-running if it was paused
        if (!autoRunning && !waitingForUserFeedback) {
          setAutoRunning(true);
        }
      } else {
        // Generic response if flow hasn't started yet
        const responses = [
          `I'm here to help with your ${taskTitle}. Just let me know when you're ready to begin.`,
          `When you're ready to start the ${taskTitle} process, just let me know.`,
          `I can help you with ${taskTitle} whenever you're ready to begin the analysis.`,
          `Let me know when you'd like to start the ${taskTitle} workflow, and we'll get right to it.`
        ];
        
        const message = responses[Math.floor(Math.random() * responses.length)];
        addAgentMessage(message);
      }
      
      setIsLoading(false);
    }, 1000);
  };
  
  // Handle clicking on a step to view its data
  const handleStepClick = (stepIndex: number) => {
    setActiveTab("log");
    onSubtaskSelect(stepIndex);
  };

  // Local solution for generating step summaries without API calls
  const getLocalStepSummary = (stepTitle: string): string => {
    const stepLower = stepTitle.toLowerCase();
    
    if (stepLower.includes("inventory")) {
      const summaries = [
        "Three products are below reorder threshold, with wireless earbuds critically low at 2 units remaining.",
        "Inventory turnover rate is 15% below industry average across all major categories.",
        "Seasonal items show 32% higher stockout rates than evergreen products.",
        "Five SKUs account for 68% of total inventory value, suggesting diversification opportunities.",
        "Safety stock levels for top sellers are 12% below optimal levels based on lead time analysis."
      ];
      return summaries[Math.floor(Math.random() * summaries.length)];
    }
    
    if (stepLower.includes("sales") || stepLower.includes("revenue")) {
      const summaries = [
        "Monthly revenue increased 18% over the past quarter, with accessories showing strongest growth at 27%.",
        "Customer acquisition cost dropped to $28.50, a 15% improvement from previous period.",
        "Conversion rate on high-margin products climbed to 3.8%, exceeding targets by 0.5%.",
        "Year-over-year sales growth reached 22.5% for core product lines.",
        "Top-performing SKUs experienced 34% higher basket value than catalog average."
      ];
      return summaries[Math.floor(Math.random() * summaries.length)];
    }
    
    if (stepLower.includes("turnover") || stepLower.includes("velocity")) {
      const summaries = [
        "Electronics category shows fastest turnover at 8.3x annually, 2.1x higher than company average.",
        "Slow-moving items represent 24% of catalog but only 8% of annual revenue.",
        "Product velocity varies 3.5x between top and bottom performing categories.",
        "Seasonal products achieve 5.2x higher turnover during peak months versus off-season.",
        "Inventory carrying costs average 11.3% of product value for low-velocity items."
      ];
      return summaries[Math.floor(Math.random() * summaries.length)];
    }
    
    if (stepLower.includes("forecast") || stepLower.includes("predict") || stepLower.includes("demand")) {
      const summaries = [
        "Q4 demand forecast shows 28% growth potential with 87% confidence interval.",
        "Predictive modeling suggests 15% potential stock reduction while maintaining service levels.",
        "Six-month trend analysis indicates 22% higher demand for eco-friendly product variants.",
        "Seasonal demand patterns show 40% amplitude between peak and trough periods.",
        "Machine learning forecasts predict 18% lower stockout risk with adjusted ordering patterns."
      ];
      return summaries[Math.floor(Math.random() * summaries.length)];
    }
    
    // Generic summaries for other step types
    const genericSummaries = [
      "Analysis revealed three critical insights with potential for 15% efficiency improvement.",
      "Key metrics show 22% variance from benchmarks with clear optimization opportunities.",
      "Data patterns highlight 5 high-priority areas for immediate action.",
      "Comparative analysis shows 18% performance gap against top industry benchmarks.",
      "Identified 3 quick wins that could yield 12% performance improvement within 30 days."
    ];
    
    return genericSummaries[Math.floor(Math.random() * genericSummaries.length)];
  };

  // Generate transition messages
  const generateDummyTransition = async (fromStep: string, toStep: string): Promise<string> => {
    // Use same approach as existing dummy content generation
    try {
      // Simulate a brief processing delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Transitions for inventory/sales workflows
      const stepFromLower = fromStep.toLowerCase();
      const stepToLower = toStep.toLowerCase();
      
      if (stepFromLower.includes("inventory") && stepToLower.includes("sales")) {
        const transitions = [
          `With our inventory levels mapped out and ${Math.floor(Math.random() * 5) + 2} products needing attention, analyzing sales data will help us prioritize restocking efforts.`,
          `The inventory analysis reveals ${Math.floor(Math.random() * 10) + 5} SKUs with suboptimal levels - sales data will show which ones need immediate attention.`,
          `Our inventory turnover rate of ${(Math.random() * 5 + 2).toFixed(1)}x requires deeper sales analysis to understand seasonal demand patterns.`
        ];
        return transitions[Math.floor(Math.random() * transitions.length)];
      }
      
      if (stepFromLower.includes("sales") && stepToLower.includes("turnover")) {
        const transitions = [
          `With sales data showing ${Math.floor(Math.random() * 20) + 10}% growth in the top category, calculating turnover rates will reveal inventory efficiency opportunities.`,
          `The ${Math.floor(Math.random() * 15) + 5} best-selling products identified need targeted turnover analysis to optimize stock levels.`,
          `Sales growth of ${Math.floor(Math.random() * 25) + 5}% suggests we need to examine turnover rates to ensure inventory can meet increasing demand.`
        ];
        return transitions[Math.floor(Math.random() * transitions.length)];
      }
      
      if (stepFromLower.includes("turnover") && stepToLower.includes("forecast")) {
        const transitions = [
          `Turnover analysis shows ${(Math.random() * 3 + 2).toFixed(1)}x higher velocity in top categories, making accurate forecasting crucial for maintaining optimal stock.`,
          `With turnover rates varying ${Math.floor(Math.random() * 40) + 20}% across categories, accurate forecasting will help us balance inventory levels.`,
          `The slow-moving items with ${(Math.random() + 1).toFixed(1)}x turnover rate require special attention in our demand forecasts.`
        ];
        return transitions[Math.floor(Math.random() * transitions.length)];
      }
      
      // Generic transitions for other combinations
      const genericTransitions = [
        `${fromStep} data shows key patterns that will influence our ${toStep.toLowerCase()} analysis.`,
        `The insights from ${fromStep.toLowerCase()} provide essential context for understanding ${toStep.toLowerCase()}.`,
        `With ${fromStep.toLowerCase()} complete, ${toStep.toLowerCase()} will help us develop a more comprehensive strategy.`,
        `${fromStep} revealed ${Math.floor(Math.random() * 3) + 2} critical factors that ${toStep.toLowerCase()} will help us address.`,
        `Our ${fromStep.toLowerCase()} metrics suggest several areas to focus on during ${toStep.toLowerCase()}.`
      ];
      
      return genericTransitions[Math.floor(Math.random() * genericTransitions.length)];
    } catch (err) {
      console.error("Failed to generate transition:", err);
      return "";
    }
  };
  
  // Generate completion messages
  const generateDummyCompletion = async (taskTitle: string): Promise<string> => {
    try {
      // Simulate a brief processing delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const completions = [
        `That completes our ${taskTitle.toLowerCase()} process! We've analyzed data across all steps and identified several key insights. Would you like me to focus on any specific area?`,
        `We've finished the ${taskTitle.toLowerCase()} workflow and found several optimization opportunities. What aspect would you like to discuss in more detail?`,
        `The ${taskTitle.toLowerCase()} analysis is complete with actionable insights ready for implementation. Any questions about our findings?`,
        `Our ${taskTitle.toLowerCase()} process is finished, revealing several high-impact opportunities. Would you like to explore any area further?`,
        `That wraps up our ${taskTitle.toLowerCase()} analysis! We've identified the key metrics and trends. What specific aspects would you like me to explain?`
      ];
      
      return completions[Math.floor(Math.random() * completions.length)];
    } catch (err) {
      console.error("Failed to generate completion:", err);
      return "";
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#fcfbf8] overflow-hidden max-h-screen">
      <div className="py-2 px-3 border-b bg-white flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-800">Jarvio Assistant</h2>
        
        <div className="mt-1 pt-1 border-t">
          <Tabs defaultValue="chat" value={activeTab} onValueChange={(value) => setActiveTab(value as "chat" | "log")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="chat">Chat</TabsTrigger>
              <TabsTrigger value="log">Data Log</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {activeTab === "chat" ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          <AgentMessageArea 
              messages={messages}
            subtasks={convertedSubtasks}
            activeSubtaskIndex={currentSubtaskIndex}
            onStepClick={handleStepClick}
          />
          
          <AgentInputArea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSubmit={handleSendMessage}
            disabled={isLoading}
          />
        </div>
      ) : (
        <DataLogTab 
          subtasks={convertedSubtasks}
          activeSubtaskIndex={currentSubtaskIndex}
        />
      )}
    </div>
  );
}
