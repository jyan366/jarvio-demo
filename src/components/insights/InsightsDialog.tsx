
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { InsightSection } from "../tasks/InsightSection";

interface InsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: (insight: any) => void;
  productNames?: string[]; // Added this prop to match usage in CustomerInsights.tsx
}

export function InsightsDialog({ open, onOpenChange, onCreateTask, productNames }: InsightsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full">
        <DialogHeader>
          <DialogTitle>Recent Insights</DialogTitle>
          <DialogDescription>
            Actionable insights from your account{productNames && productNames.length > 0 ? ` for ${productNames.join(', ')}` : ''}. Click "Create Task" to add to your workflow.
          </DialogDescription>
        </DialogHeader>
        <InsightSection onCreateTask={onCreateTask} hideHeader hideActions />
      </DialogContent>
    </Dialog>
  );
}
