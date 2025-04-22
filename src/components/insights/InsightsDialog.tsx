
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InsightData, InsightCard } from "../tasks/InsightCard";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Star, TrendingDown, Flag } from "lucide-react";

interface InsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (insight: InsightData, suggestedTasks?: any[]) => void;
  insights?: InsightData[];
  // For product-specific insights
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
  
  // Create title based on whether product names are provided
  const dialogTitle = productNames?.length === 1 
    ? `Insights for ${productNames[0]}`
    : productNames?.length > 1
    ? `Insights for ${productNames.length} Products`
    : "Recent Insights";

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>
            Actionable insights from your account. Click on an insight card for full details, or "Create Task" to add to your workflow.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {insights.length > 0 ? (
            insights.map((insight) => (
              <button
                key={insight.id}
                onClick={() => onInsightClick?.(insight)}
                type="button"
                className="relative p-0 text-left hover:scale-[1.02] transition-transform focus:outline-none rounded-xl"
                style={{ background: 'none', border: 'none' }}
              >
                <InsightCard
                  {...insight}
                  onCreateTask={handleCreateTask}
                />
              </button>
            ))
          ) : (
            <div className="col-span-2 text-center py-8 text-muted-foreground">No insights available.</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
