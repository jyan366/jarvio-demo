
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, CheckCircle, ArrowRight, Loader2 } from "lucide-react";
import { InsightData } from "../tasks/InsightCard";
import { useToast } from "@/hooks/use-toast";
import { suggestTasks } from "@/lib/apiUtils";

interface InsightDetailDialogProps {
  insight: InsightData | null;
  open: boolean;
  onClose: () => void;
  onCreateTask: (suggestedTasks?: any[]) => void;
}

interface SuggestedTask {
  id: string;
  name: string;
  completed: false;
  selected?: boolean;
}

export function InsightDetailDialog({
  insight,
  open,
  onClose,
  onCreateTask,
}: InsightDetailDialogProps) {
  const [processingTask, setProcessingTask] = useState(false);
  const [taskCreated, setTaskCreated] = useState(false);
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const { toast } = useToast();

  // Fetch suggested tasks when dialog opens with an insight
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
      // First check if we're authenticated
      if (!localStorage.getItem('isAuthenticated')) {
        localStorage.setItem('isAuthenticated', 'true');
        console.log("Auto-authenticated user for demo in InsightDetailDialog");
      }
      
      // Use our apiUtils function to get task suggestions
      const tasks = await suggestTasks(insight);
      
      // Set all tasks as selected by default
      setSuggestedTasks(tasks.map(task => ({ 
        ...task, 
        selected: true 
      })));
    } catch (error) {
      console.error('Error fetching suggested tasks:', error);
      // Set generic fallback tasks as a last resort
      setSuggestedTasks([
        { id: '1', name: 'Review the detailed insight information', completed: false, selected: true },
        { id: '2', name: 'Create an action plan addressing the key points', completed: false, selected: true },
        { id: '3', name: 'Schedule follow-up to verify issue resolution', completed: false, selected: true }
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

  const handleCreateTask = () => {
    setProcessingTask(true);
    
    // Filter only selected tasks
    const selectedTasks = suggestedTasks.filter(task => task.selected);
    
    setTimeout(() => {
      onCreateTask(selectedTasks);
      setProcessingTask(false);
      setTaskCreated(true);
      
      toast({
        title: "Task Created",
        description: `"${insight?.title}" has been added to your tasks with ${selectedTasks.length} subtasks.`,
      });
      
      // Reset state for next time dialog is opened
      setTimeout(() => {
        setTaskCreated(false);
      }, 2000);
    }, 600);
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

        {/* Suggested Tasks Section */}
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
                  <label 
                    htmlFor={`task-${task.id}`}
                    className="text-sm leading-tight cursor-pointer"
                  >
                    {task.name}
                  </label>
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
              {processingTask ? "Creating..." : `Create Task with ${suggestedTasks.filter(t => t.selected).length} Subtasks`}
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
