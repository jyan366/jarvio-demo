
import { InsightData } from "@/components/tasks/InsightCard";
import { InsightsDialog } from "@/components/insights/InsightsDialog";
import { InsightDetailDialog } from "@/components/insights/InsightDetailDialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";

interface ReviewInsightsProps {
  insights: InsightData[];
  onCreateTask: (insight: InsightData) => void;
}

export function ReviewInsights({ insights, onCreateTask }: ReviewInsightsProps) {
  const [insightsDialogOpen, setInsightsDialogOpen] = useState(false);
  const [detailInsight, setDetailInsight] = useState<InsightData | null>(null);

  const handleInsightClick = (insight: InsightData) => {
    setDetailInsight(insight);
  };

  return (
    <>
      <Button 
        onClick={() => setInsightsDialogOpen(true)}
        className="flex items-center gap-2"
      >
        <BarChart2 className="w-4 h-4" />
        View Insights
      </Button>

      <InsightsDialog
        open={insightsDialogOpen}
        onOpenChange={setInsightsDialogOpen}
        onCreateTask={onCreateTask}
        insights={insights}
        onInsightClick={handleInsightClick}
      />

      <InsightDetailDialog
        insight={detailInsight}
        open={!!detailInsight}
        onClose={() => setDetailInsight(null)}
        onCreateTask={() => {
          if (detailInsight) {
            onCreateTask(detailInsight);
            setDetailInsight(null);
          }
        }}
      />
    </>
  );
}
