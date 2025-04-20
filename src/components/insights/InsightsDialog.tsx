
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InsightData, InsightCard } from "../tasks/InsightCard";

interface InsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (insight: InsightData) => void;
  insights?: InsightData[];
  // NEW
  onInsightClick?: (insight: InsightData) => void;
}

export function InsightsDialog({
  open,
  onOpenChange,
  onCreateTask,
  insights,
  onInsightClick,
}: InsightsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Recent Insights</DialogTitle>
          <DialogDescription>
            Actionable insights from your account. Click on an insight card for full details, or "Create Task" to add to your workflow.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {insights?.length
            ? insights.map((insight) => (
                <button
                  key={insight.id}
                  onClick={() => onInsightClick?.(insight)}
                  type="button"
                  className="relative p-0 text-left hover:scale-[1.02] transition-transform focus:outline-none rounded-xl"
                  style={{ background: 'none', border: 'none' }}
                >
                  <InsightCard
                    {...insight}
                    onCreateTask={onCreateTask}
                  />
                </button>
              ))
            : <div className="col-span-2 text-center py-8 text-muted-foreground">No insights available.</div>
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
