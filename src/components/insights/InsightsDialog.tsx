
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InsightData, InsightCard } from "../tasks/InsightCard";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, DollarSign, ThumbsUp, Zap } from "lucide-react";

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
      icon: AlertCircle,
      preview: "27% of customers expected additional features",
      color: "bg-blue-50 text-blue-700 border-blue-200",
      details: "Customers frequently mention certain functionalities they expected but didn't find, highlighting missed opportunities for product enhancements."
    },
    {
      id: "2",
      title: "Consistent Quality Concerns",
      icon: Zap,
      preview: "Quality mentioned in 42% of recent reviews",
      color: "bg-amber-50 text-amber-700 border-amber-200",
      details: "Reviews show patterns questioning product durability and performance, indicating potential quality control improvements needed."
    },
    {
      id: "3",
      title: "Value vs. Price Perception",
      icon: DollarSign,
      preview: "68% consider the product fairly priced",
      color: "bg-green-50 text-green-700 border-green-200",
      details: "Customer reviews consistently comment on price-value relationship, providing insights for pricing strategy optimization."
    },
    {
      id: "4",
      title: "Positive Differentiators",
      icon: ThumbsUp,
      preview: "Packaging praised in 89% of reviews",
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
      details: "Specific product elements like packaging and setup receive consistent praise, offering potential marketing advantages."
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
