
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InsightData } from "../tasks/InsightCard";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Star, TrendingDown, Flag, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface InsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (insight: InsightData, suggestedTasks?: any[]) => void;
  insights?: InsightData[];
  productNames?: string[];
  onInsightClick?: (insight: InsightData) => void;
}

interface InsightGroup {
  title: string;
  insights: InsightData[];
  suggestedTask: {
    title: string;
    description: string;
  };
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
  const [currentGroupIndex, setCurrentGroupIndex] = React.useState(0);
  
  const dialogTitle = productNames?.length === 1 
    ? `Insights for ${productNames[0]}`
    : productNames?.length > 1
    ? `Insights for ${productNames.length} Products`
    : "Customer Insights Assistant";

  // Default insights grouped by theme with suggested tasks
  const defaultInsightGroups: InsightGroup[] = [
    {
      title: "Product Enhancement Opportunities",
      insights: [
        {
          id: "1",
          title: "Unmet Feature Expectations",
          description: "Customers frequently mention certain functionalities they expected but didn't find.",
          category: "REVIEW",
          severity: "HIGH",
          date: "2025-04-20"
        },
        {
          id: "2",
          title: "Missing Integration Options",
          description: "Reviews indicate demand for integration with popular third-party services.",
          category: "REVIEW",
          severity: "MEDIUM",
          date: "2025-04-19"
        }
      ],
      suggestedTask: {
        title: "Feature Enhancement Initiative",
        description: "Develop roadmap for implementing most requested features and integrations based on customer feedback analysis."
      }
    },
    {
      title: "Quality and Performance",
      insights: [
        {
          id: "3",
          title: "Consistent Quality Concerns",
          description: "Reviews show patterns questioning product durability and performance.",
          category: "REVIEW",
          severity: "HIGH",
          date: "2025-04-18"
        },
        {
          id: "4",
          title: "Performance Issues",
          description: "Multiple reports of performance degradation under specific conditions.",
          category: "REVIEW",
          severity: "MEDIUM",
          date: "2025-04-17"
        }
      ],
      suggestedTask: {
        title: "Quality Improvement Program",
        description: "Implement comprehensive quality control measures and performance optimization plan."
      }
    }
  ];

  const insightGroups = providedInsights?.length 
    ? [{ 
        title: "Custom Insights", 
        insights: providedInsights,
        suggestedTask: {
          title: "Review Custom Insights",
          description: "Analyze and create action items based on provided insights."
        }
      }] 
    : defaultInsightGroups;

  const currentGroup = insightGroups[currentGroupIndex];

  const nextGroup = () => {
    setCurrentGroupIndex(prev => (prev + 1) % insightGroups.length);
  };

  const previousGroup = () => {
    setCurrentGroupIndex(prev => (prev - 1 + insightGroups.length) % insightGroups.length);
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
            Review grouped insights for your products.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6 p-6 bg-white rounded-xl border">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">{currentGroup.title}</h3>
                <span className="text-sm text-muted-foreground">
                  {currentGroupIndex + 1} of {insightGroups.length}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                {currentGroup.insights.map((insight, index) => (
                  <div key={insight.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Insight {index + 1}
                      </Badge>
                      <Badge variant="secondary" className={
                        insight.severity === "HIGH" 
                          ? "bg-red-100 text-red-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }>
                        {insight.severity}
                      </Badge>
                    </div>
                    <h4 className="font-medium mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-primary/5 p-4 rounded-lg mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-primary" />
                  <h4 className="font-medium">Suggested Task</h4>
                </div>
                <h5 className="font-medium mb-1">{currentGroup.suggestedTask.title}</h5>
                <p className="text-sm text-gray-600">{currentGroup.suggestedTask.description}</p>
              </div>
              
              <div className="flex items-center justify-center mt-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={previousGroup}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextGroup}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
