
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { InsightData } from "../tasks/InsightCard";
import { useToast } from "@/hooks/use-toast";
import { suggestTasks, SuggestedTask } from "@/lib/apiUtils";
import { useNavigate } from 'react-router-dom';
import { createTask } from "@/lib/supabaseTasks";

interface InsightDetailDialogProps {
  insight: InsightData | null;
  open: boolean;
  onClose: () => void;
  onCreateTask: (suggestedTasks?: SuggestedTask[]) => void;
}

export function InsightDetailDialog({
  insight,
  open,
  onClose,
  onCreateTask,
}: InsightDetailDialogProps) {
  const navigate = useNavigate();
  const [processingTask, setProcessingTask] = useState(false);
  const [taskCreated, setTaskCreated] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState<(SuggestedTask & { selected?: boolean })[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open && insight) {
      fetchSuggestedTasks(insight);
    } else {
      setSuggestedTasks([]);
    }
  }, [open, insight]);

  const fetchSuggestedTasks = async (insight: InsightData) => {
    setLoadingSuggestions(true);
    try {
      if (!localStorage.getItem('isAuthenticated')) {
        localStorage.setItem('isAuthenticated', 'true');
        console.log("Auto-authenticated user for demo in InsightDetailDialog");
      }

      const tasks = await suggestTasks(insight);

      setSuggestedTasks(tasks.map(task => ({
        ...task,
        selected: true,
      })));
    } catch (error) {
      console.error('Error fetching suggested tasks:', error);
      setSuggestedTasks([
        { id: '1', title: 'Review the insight', description: "Read through the insight details.", completed: false, selected: true },
        { id: '2', title: 'Plan next steps', description: "Develop a plan to address the insight.", completed: false, selected: true },
        { id: '3', title: 'Follow up', description: "Check for improvement or resolution.", completed: false, selected: true }
      ]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const toggleTaskSelection = (taskId: string) => {
    setSuggestedTasks(
      suggestedTasks.map(task => 
        task.id === taskId ? { ...task, selected: !task.selected } : task
      )
    );
  };

  const handleCreateTask = async () => {
    if (!insight) return;
    
    setProcessingTask(true);

    const selectedTasks = suggestedTasks.filter(task => task.selected);
    
    try {
      // Create the main task
      const taskData = await createTask({
        title: insight.title,
        description: insight.description || "",
        category: insight.category,
        priority: insight.severity === 'HIGH' ? 'HIGH' : 
                insight.severity === 'MEDIUM' ? 'MEDIUM' : 'LOW',
        status: "Not Started",
        insight_id: insight.id,
        data: { 
          insightType: insight.category,
          insightDate: insight.date,
          insightSeverity: insight.severity
        }
      });
      
      onCreateTask(selectedTasks);
      
      toast({
        title: "Task Created",
        description: `"${insight.title}" has been added to your tasks.`,
      });
      
      setTimeout(() => {
        setTaskCreated(false);
        onClose();
        navigate('/task-manager');
      }, 1000);
      
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error Creating Task",
        description: "There was a problem creating your task. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessingTask(false);
      setTaskCreated(true);
    }
  };

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
            <span className={`rounded-md px-2 py-1 text-xs font-medium ${categoryColors[insight.category as keyof typeof categoryColors] || 'bg-gray-100 text-gray-700'}`}>
              {insight.category}
            </span>
            {insight.title}
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm text-gray-600 mb-4">{insight.date}</div>
        <div className="mb-4 text-base">{insight.description}</div>
        <div className="mb-4">
          <Badge variant="secondary" className={severityColors[insight.severity as keyof typeof severityColors] || 'bg-gray-100 text-gray-700'}>
            {insight.severity}
          </Badge>
        </div>

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

        <div className="mb-4">
          <h3 className="font-medium text-sm mb-3">Suggested Tasks</h3>
          {loadingSuggestions ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              <span className="ml-2 text-sm text-muted-foreground">Loading suggestions...</span>
            </div>
          ) : (
            <div className="space-y-2">
              {suggestedTasks.map(task => (
                <div key={task.id} className="flex items-start space-x-2">
                  <Checkbox 
                    id={`task-${task.id}`}
                    checked={task.selected} 
                    onCheckedChange={() => toggleTaskSelection(task.id)}
                    className="mt-1"
                  />
                  <div>
                    <label 
                      htmlFor={`task-${task.id}`}
                      className="text-sm leading-tight font-semibold cursor-pointer"
                    >
                      {task.title}
                    </label>
                    {task.description && (
                      <div className="text-xs text-muted-foreground mt-0.5 pr-2">
                        {task.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
              disabled={processingTask || loadingSuggestions || suggestedTasks.filter(t => t.selected).length === 0}
            >
              {processingTask ? "Creating..." : `Create Task`}
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
