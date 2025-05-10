
import { useState } from 'react';
import { Flow, FlowBlock } from '@/components/jarvi-flows/FlowsGrid';
import { ToolConfig } from '@/components/agents/tools/toolConfigs';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface FlowExecutionProps {
  flow: Flow;
  taskId: string;
  onComplete?: () => void;
  onBlockComplete?: (blockIndex: number, result: any) => void;
  onError?: (error: Error, blockIndex: number) => void;
}

export function useFlowExecution({
  flow,
  taskId,
  onComplete,
  onBlockComplete,
  onError
}: FlowExecutionProps) {
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [blockResults, setBlockResults] = useState<Record<string, any>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const startExecution = async () => {
    if (isExecuting || isCompleted || !flow || !flow.blocks || flow.blocks.length === 0) return;
    
    setIsExecuting(true);
    toast({
      title: "Flow started",
      description: `Starting execution of flow "${flow.name}"`,
    });

    try {
      await executeCurrentBlock();
    } catch (error) {
      handleError(error as Error);
    }
  };

  const executeCurrentBlock = async () => {
    if (!flow.blocks || currentBlockIndex >= flow.blocks.length) {
      completeFlow();
      return;
    }

    const block = flow.blocks[currentBlockIndex];
    if (!block) {
      moveToNextBlock();
      return;
    }

    try {
      toast({
        title: "Executing block",
        description: `${block.name || `Block ${currentBlockIndex + 1}`}`,
      });

      const result = await executeBlock(block);
      
      // Save result
      setBlockResults(prev => ({
        ...prev,
        [block.id]: result
      }));
      
      // Save result to subtask in Supabase
      try {
        await saveBlockResult(block.id, result);
      } catch (saveError) {
        console.error("Error saving block result:", saveError);
      }

      if (onBlockComplete) {
        onBlockComplete(currentBlockIndex, result);
      }

      // Successfully completed block, move to next
      moveToNextBlock();
    } catch (error) {
      handleError(error as Error);
    }
  };

  const saveBlockResult = async (blockId: string, result: any) => {
    try {
      // Find the appropriate subtask ID based on the block index
      const { data: subtasks } = await supabase
        .from('subtasks')
        .select('id')
        .eq('task_id', taskId)
        .order('id', { ascending: true });
      
      if (subtasks && subtasks[currentBlockIndex]) {
        const subtaskId = subtasks[currentBlockIndex].id;
        
        // Update the subtask with the result
        await supabase.functions.invoke('update-task-state', {
          body: {
            action: 'saveSubtaskResult',
            taskId,
            subtaskId,
            data: { result: JSON.stringify(result) }
          }
        });
      }
    } catch (error) {
      console.error("Failed to save subtask result:", error);
    }
  };

  const moveToNextBlock = () => {
    if (currentBlockIndex < flow.blocks.length - 1) {
      // Move to next block
      setCurrentBlockIndex(prev => prev + 1);
      // Execute the next block
      setTimeout(() => executeCurrentBlock(), 500);
    } else {
      // All blocks completed
      completeFlow();
    }
  };

  const completeFlow = () => {
    setIsExecuting(false);
    setIsCompleted(true);
    toast({
      title: "Flow completed",
      description: `Successfully completed flow "${flow.name}"`,
    });
    if (onComplete) onComplete();
  };

  const handleError = (error: Error, customMessage?: string) => {
    console.error("Flow execution error:", error);
    
    const block = flow.blocks[currentBlockIndex];
    const blockName = block?.name || `Block ${currentBlockIndex + 1}`;
    
    toast({
      title: "Error executing flow",
      description: customMessage || `Error in ${blockName}: ${error.message}`,
      variant: "destructive"
    });
    
    setIsExecuting(false);
    
    if (onError) onError(error, currentBlockIndex);
  };

  const executeBlock = async (block: FlowBlock): Promise<any> => {
    const blockHandlers = {
      collect: handleCollectBlock,
      think: handleThinkBlock,
      act: handleActBlock,
      agent: handleAgentBlock
    };

    const handler = blockHandlers[block.type as keyof typeof blockHandlers];
    if (!handler) {
      throw new Error(`Unknown block type: ${block.type}`);
    }

    // Pass previous results for context
    return handler(block, blockResults);
  };

  // Block type handlers
  const handleCollectBlock = async (block: FlowBlock, context: Record<string, any>): Promise<any> => {
    console.log("Executing collect block:", block.option, block);
    
    switch (block.option) {
      case "User Text":
        // In a real implementation, this might pause execution and wait for user input
        // For demo, we'll simulate data collection
        return { 
          userInput: "Simulated user text data for " + block.name,
          timestamp: new Date().toISOString()
        };
      
      case "Upload Sheet":
        return { 
          sheetData: "Simulated uploaded spreadsheet data",
          rows: 15,
          columns: 5,
          timestamp: new Date().toISOString()
        };
        
      case "All Listing Info":
        return {
          listings: [
            { asin: "B07X123456", title: "Premium Product", price: 29.99, rating: 4.5, reviews: 128 },
            { asin: "B07X789012", title: "Basic Product", price: 19.99, rating: 4.2, reviews: 86 }
          ],
          totalListings: 2,
          timestamp: new Date().toISOString()
        };
        
      case "Get Keywords":
        return {
          keywords: ["best product", "premium quality", "affordable", "high-rated"],
          searchVolume: [1200, 980, 2300, 750],
          competitiveness: [0.7, 0.6, 0.8, 0.4],
          timestamp: new Date().toISOString()
        };
        
      case "Estimate Sales":
        return {
          products: [
            { asin: "B07X123456", estimatedSales: 1500, trend: "up", confidence: 0.85 },
            { asin: "B07X789012", estimatedSales: 800, trend: "stable", confidence: 0.72 }
          ],
          period: "30 days",
          timestamp: new Date().toISOString()
        };
        
      case "Review Information":
        return {
          reviewStats: {
            totalReviews: 214,
            averageRating: 4.3,
            sentimentPositive: 0.72,
            sentimentNegative: 0.18,
            sentimentNeutral: 0.1,
            topKeywords: ["quality", "price", "durability", "shipping"]
          },
          recentReviews: [
            { rating: 5, title: "Great product", verified: true },
            { rating: 2, title: "Disappointed with quality", verified: true }
          ],
          timestamp: new Date().toISOString()
        };
        
      case "Scrape Sheet":
        return {
          sheetData: "Simulated scraped data from external sheet",
          source: "External URL",
          fields: ["Product", "Price", "Inventory", "Sales"],
          records: 42,
          timestamp: new Date().toISOString()
        };
        
      case "Seller Account Feedback":
        return {
          accountHealth: {
            sellerRating: 98,
            feedbackCount: 156,
            orderDefectRate: 0.015,
            lateShipmentRate: 0.02,
            customerServicePerformance: "Excellent"
          },
          recentFeedback: [
            { rating: 5, comment: "Fast delivery and excellent product" },
            { rating: 4, comment: "Good value for money" }
          ],
          timestamp: new Date().toISOString()
        };
        
      case "Email Parsing":
        return {
          emails: [
            { subject: "Order Confirmation", sender: "supplier@example.com", date: "2023-05-01", extracted: { orderNumber: "PO-12345", total: 1250.00, items: 5 } },
            { subject: "Shipping Notification", sender: "logistics@example.com", date: "2023-05-03", extracted: { trackingNumber: "TRK8734092", carrier: "FedEx", estimatedDelivery: "2023-05-07" } }
          ],
          timestamp: new Date().toISOString()
        };
        
      default:
        throw new Error(`Unknown collect option: ${block.option}`);
    }
  };

  const handleThinkBlock = async (block: FlowBlock, context: Record<string, any>): Promise<any> => {
    console.log("Executing think block:", block.option, block);

    // Simulate AI processing time with a short delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    switch (block.option) {
      case "Basic AI Analysis":
        return {
          analysisResults: "Simulated AI analysis of collected data",
          insights: [
            "Products in Category X show higher conversion rates",
            "Customer reviews mention packaging issues",
            "Competitors have lower prices for similar products"
          ],
          suggestions: [
            "Consider adjusting pricing strategy",
            "Improve product packaging",
            "Focus marketing on quality differentiators"
          ],
          timestamp: new Date().toISOString()
        };
        
      case "Listing Analysis":
        return {
          listingQuality: {
            titleScore: 85,
            descriptionScore: 72,
            imageQuality: 90,
            keywordOptimization: 68,
            conversionPotential: 77
          },
          opportunities: [
            "Add more searchable keywords to title",
            "Improve bullet points clarity",
            "Add more lifestyle images"
          ],
          timestamp: new Date().toISOString()
        };
        
      case "Insights Generation":
        return {
          marketTrends: [
            "Increasing demand for eco-friendly options",
            "Price sensitivity in lower-tier products",
            "Seasonal fluctuation affecting conversion rates"
          ],
          competitorAnalysis: {
            pricePosition: "10% above market average",
            qualityPerception: "Above average",
            marketShareTrend: "Steady growth"
          },
          actionableInsights: [
            "Emphasize eco-friendly aspects in marketing",
            "Bundle products to increase average order value",
            "Prepare inventory for seasonal peak in Q3"
          ],
          timestamp: new Date().toISOString()
        };
        
      case "Review Analysis":
        return {
          sentimentBreakdown: {
            positive: 68,
            neutral: 22,
            negative: 10
          },
          topIssues: [
            { issue: "Shipping delays", frequency: 35, sentiment: -0.75 },
            { issue: "Product size", frequency: 28, sentiment: -0.6 },
            { issue: "Packaging", frequency: 22, sentiment: -0.5 }
          ],
          topPraises: [
            { feature: "Product quality", frequency: 87, sentiment: 0.9 },
            { feature: "Value for money", frequency: 65, sentiment: 0.85 },
            { feature: "Customer service", frequency: 41, sentiment: 0.7 }
          ],
          timestamp: new Date().toISOString()
        };
        
      default:
        throw new Error(`Unknown think option: ${block.option}`);
    }
  };

  const handleActBlock = async (block: FlowBlock, context: Record<string, any>): Promise<any> => {
    console.log("Executing act block:", block.option, block);
    
    // For demonstration, we'll simulate successful actions
    switch (block.option) {
      case "AI Summary":
        return {
          summary: "Simulated AI-generated summary of analysis",
          keyPoints: [
            "Sales performance shows positive trend",
            "Customer feedback highlights product quality",
            "Pricing strategy should be reviewed",
            "Inventory levels are optimal"
          ],
          recommendations: [
            { priority: "High", action: "Update product descriptions with keyword-rich content" },
            { priority: "Medium", action: "Adjust pricing for top 5 products" },
            { priority: "Low", action: "Expand product line with complementary items" }
          ],
          timestamp: new Date().toISOString()
        };
        
      case "Push to Amazon":
        return {
          operationResults: {
            successful: true,
            itemsUpdated: 5,
            errors: 0,
            warnings: 1
          },
          changesApplied: [
            { type: "Title", status: "Updated" },
            { type: "Bullets", status: "Updated" },
            { type: "Description", status: "Updated" },
            { type: "Keywords", status: "Updated" },
            { type: "Images", status: "Warning: 1 image too small" }
          ],
          timestamp: new Date().toISOString()
        };
        
      case "Send Email":
        return {
          emailStatus: {
            sent: true,
            recipients: 3,
            subject: "Weekly Performance Report",
            deliveredAt: new Date().toISOString()
          },
          emailContent: {
            type: "Report",
            attachments: 1,
            template: "Weekly Summary",
            customFields: 5
          },
          timestamp: new Date().toISOString()
        };
        
      case "Human in the Loop":
        // This would typically wait for human approval before proceeding
        // For this demo, we'll simulate immediate approval
        return {
          approvalStatus: "Auto-approved for demo",
          requestType: "Review and approve changes",
          submittedTo: "Demo Manager",
          approvedBy: "System (demo mode)",
          notes: "Approval simulated for demo purposes",
          timestamp: new Date().toISOString()
        };
        
      case "Agent":
        // Simulate agent handling the task
        return {
          agent: block.agentName || "General Agent",
          taskPerformance: "Completed successfully",
          actionsTaken: [
            "Data analysis",
            "Report generation",
            "Notification delivery"
          ],
          timestamp: new Date().toISOString()
        };
        
      default:
        throw new Error(`Unknown act option: ${block.option}`);
    }
  };

  const handleAgentBlock = async (block: FlowBlock, context: Record<string, any>): Promise<any> => {
    console.log("Executing agent block:", block);
    
    // Currently agent blocks are similar to "Agent" option in act blocks
    return {
      agentName: block.agentName || "Specialized Agent",
      domain: "Task Automation",
      actions: [
        "Specialized domain analysis",
        "Custom workflow execution",
        "Intelligent decision making"
      ],
      result: "Successfully completed specialized task",
      timestamp: new Date().toISOString()
    };
  };

  return {
    startExecution,
    isExecuting,
    isCompleted,
    currentBlockIndex,
    blockResults,
  };
}
