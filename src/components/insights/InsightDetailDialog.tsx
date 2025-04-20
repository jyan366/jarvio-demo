
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InsightData } from "../tasks/InsightCard";

interface InsightDetailDialogProps {
  insight: InsightData | null;
  open: boolean;
  onClose: () => void;
  onCreateTask: () => void;
}

export function InsightDetailDialog({
  insight,
  open,
  onClose,
  onCreateTask,
}: InsightDetailDialogProps) {
  if (!insight) return null;

  const categoryColors = {
    'REVIEW': 'bg-[#FFF1D6] text-[#EEAF57]',
    'LISTING': 'bg-[#F0F9F5] text-[#27B36B]',
    'PRICING': 'bg-[#FDF6ED] text-[#EEAF57]',
    'COMPETITION': 'bg-[#F0F4FF] text-[#6271F3]',
  };

  const severityColors = {
    'HIGH': 'bg-[#FEF2E3] text-[#FFA833] font-medium',
    'MEDIUM': 'bg-yellow-50 text-yellow-700',
    'LOW': 'bg-blue-50 text-blue-700'
  };

  return (
    <Dialog open={open} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-lg flex items-center gap-2">
            <span className={`rounded-md px-2 py-1 text-xs font-medium ${categoryColors[insight.category]}`}>
              {insight.category}
            </span>
            {insight.title}
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-600 mb-4">{insight.date}</div>
        <div className="mb-4 text-base">{insight.description}</div>
        <div className="mb-4">
          <Badge variant="secondary" className={severityColors[insight.severity]}>
            {insight.severity}
          </Badge>
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={onCreateTask} variant="default">Create Task</Button>
          <DialogClose asChild>
            <Button variant="outline" type="button">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
