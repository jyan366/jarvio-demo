
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InsightData, InsightCard } from "../tasks/InsightCard";

interface InsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (insight: InsightData) => void;
  insights?: InsightData[];
}

export function InsightsDialog({
  open,
  onOpenChange,
  onCreateTask,
  insights
}: InsightsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Recent Insights</DialogTitle>
          <DialogDescription>
            Actionable insights from your account. Click "Create Task" to add to your workflow.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          {insights?.length
            ? insights.map((insight) => (
                <InsightCard
                  key={insight.id}
                  {...insight}
                  onCreateTask={onCreateTask}
                />
              ))
            : <div className="col-span-2 text-center py-8 text-muted-foreground">No insights available.</div>
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
