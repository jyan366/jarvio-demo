
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InsightData, InsightCard } from "../tasks/InsightCard";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Star, TrendingDown, Flag, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

interface InsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (insight: InsightData, suggestedTasks?: any[]) => void;
  insights?: InsightData[];
  productNames?: string[];
  onInsightClick?: (insight: InsightData) => void;
}

export function InsightsDialog({
  open,
  onOpenChange,
  onCreateTask,
  insights: providedInsights,
  productNames,
  onInsightClick,
}: InsightsDialogProps) {
  const { toast } = useToast();
  const [currentInsightIndex, setCurrentInsightIndex] = React.useState(0);
  
  // Create title based on whether product names are provided
  const dialogTitle = productNames?.length === 1 
    ? `Insights for ${productNames[0]}`
    : productNames?.length > 1
    ? `Insights for ${productNames.length} Products`
    : "Customer Insights Assistant";

  const handleCreateTask = (insight: InsightData) => {
    onCreateTask(insight);
    toast({
      title: "Task Created",
      description: `"${insight.title}" has been added to your tasks.`,
    });
  };

  // Default insights to show when none are provided
  const defaultInsights: InsightData[] = [
    {
      id: "1",
      title: "Unmet Feature Expectations",
      description: "Customers frequently mention certain functionalities they expected but didn't find, highlighting missed opportunities for product enhancements.",
      category: "REVIEW",
      severity: "HIGH",
      date: "2025-04-20"
    },
    {
      id: "2",
      title: "Consistent Quality Concerns",
      description: "Reviews show patterns questioning product durability and performance, indicating potential quality control improvements needed.",
      category: "REVIEW",
      severity: "MEDIUM",
      date: "2025-04-19"
    },
    {
      id: "3",
      title: "Value vs. Price Perception",
      description: "Customer reviews consistently comment on price-value relationship, providing insights for pricing strategy optimization.",
      category: "PRICING",
      severity: "LOW",
      date: "2025-04-18"
    },
    {
      id: "4",
      title: "Positive Differentiators",
      description: "Specific product elements like packaging and setup receive consistent praise, offering potential marketing advantages.",
      category: "LISTING",
      severity: "LOW",
      date: "2025-04-17"
    }
  ];

  // Use provided insights or default insights
  const insights = providedInsights?.length ? providedInsights : defaultInsights;
  const currentInsight = insights[currentInsightIndex];

  const nextInsight = () => {
    setCurrentInsightIndex(prev => (prev + 1) % insights.length);
  };

  const previousInsight = () => {
    setCurrentInsightIndex(prev => (prev - 1 + insights.length) % insights.length);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            {dialogTitle}
          </DialogTitle>
          <DialogDescription>
            Review insights and create actionable tasks for your workflow.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 p-6 bg-white rounded-xl border">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{currentInsight.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {currentInsightIndex + 1} of {insights.length}
                </span>
              </div>
              <p className="text-gray-600 mb-6">{currentInsight.description}</p>
              
              <div className="flex items-center justify-between mt-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={previousInsight}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextInsight}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={() => onInsightClick?.(currentInsight)}
                  className="ml-auto"
                >
                  Create Task
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
