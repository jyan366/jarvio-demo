
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle, ArrowRight } from "lucide-react";
import { InsightData } from "../tasks/InsightCard";
import { useToast } from "@/hooks/use-toast";

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
  const [processingTask, setProcessingTask] = useState(false);
  const [taskCreated, setTaskCreated] = useState(false);
  const { toast } = useToast();

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

  const handleCreateTask = () => {
    setProcessingTask(true);
    setTimeout(() => {
      onCreateTask();
      setProcessingTask(false);
      setTaskCreated(true);
      toast({
        title: "Task Created",
        description: `"${insight.title}" has been added to your tasks.`,
      });
      
      // Reset state for next time dialog is opened
      setTimeout(() => {
        setTaskCreated(false);
      }, 2000);
    }, 600);
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

        {/* Recommended Actions Section */}
        <Card className="p-4 bg-blue-50 border-blue-100 mb-4">
          <h3 className="font-medium text-sm mb-2">Recommended Actions</h3>
          <ul className="text-sm space-y-1.5">
            <li className="flex items-start">
              <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-amber-500" />
              <span>Review the insight details</span>
            </li>
            <li className="flex items-start">
              <ArrowRight className="h-4 w-4 mr-2 mt-0.5 text-blue-500" />
              <span>Create a task to address this insight</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 mr-2 mt-0.5 text-green-500" />
              <span>Track completion in the Task Manager</span>
            </li>
          </ul>
        </Card>

        <div className="flex justify-end gap-2">
          {taskCreated ? (
            <Button variant="default" className="bg-green-600" disabled>
              <CheckCircle className="h-4 w-4 mr-2" />
              Task Created
            </Button>
          ) : (
            <Button 
              onClick={handleCreateTask} 
              variant="default" 
              disabled={processingTask}
            >
              {processingTask ? "Creating..." : "Create Task"}
            </Button>
          )}
          <DialogClose asChild>
            <Button variant="outline" type="button">Close</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
