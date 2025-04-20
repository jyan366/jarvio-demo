
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { InsightSection } from "../tasks/InsightSection";

interface InsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (insight: any) => void;
  productNames?: string[];
  insights?: any[];
}

export function InsightsDialog({
  open,
  onOpenChange,
  onCreateTask,
  productNames,
  insights
}: InsightsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Recent Insights</DialogTitle>
          <DialogDescription>
            Actionable insights from your account
            {productNames && productNames.length > 0
              ? ` for ${productNames.join(", ")}`
              : ""}. Click "Create Task" to add to your workflow.
          </DialogDescription>
        </DialogHeader>
        <InsightSection
          onCreateTask={onCreateTask}
          hideHeader
          hideActions
          insights={insights}
        />
      </DialogContent>
    </Dialog>
  );
}
