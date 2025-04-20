
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X } from 'lucide-react';

interface InsightToTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insight: any;
  onCreateTask: (task: any) => void;
}

export function InsightToTaskDialog({
  open,
  onOpenChange,
  insight,
  onCreateTask,
}: InsightToTaskDialogProps) {
  const [taskData, setTaskData] = useState({
    title: insight?.title || '',
    description: insight?.description || '',
    priority: mapSeverityToPriority(insight?.severity),
    status: 'Not Started',
    category: mapInsightCategoryToTaskCategory(insight?.category),
  });

  function mapSeverityToPriority(severity: string) {
    switch (severity) {
      case 'HIGH':
        return 'HIGH';
      case 'MEDIUM':
        return 'MEDIUM';
      default:
        return 'LOW';
    }
  }

  function mapInsightCategoryToTaskCategory(category: string) {
    switch (category) {
      case 'REVIEW':
        return 'REVIEWS';
      case 'PRICING':
        return 'PRICING';
      case 'COMPETITION':
        return 'SUPPORT';
      default:
        return 'LISTINGS';
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      status: 'Not Started',
      priority: taskData.priority,
      category: taskData.category,
      date: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    
    onCreateTask(newTask);
    onOpenChange(false);
  };

  if (!insight) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Create Task from Insight</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <Alert className="bg-blue-50 border-blue-200 text-blue-800 my-4">
          <AlertDescription>
            Converting insight "{insight?.title}" to a new task
          </AlertDescription>
        </Alert>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Task Title</label>
            <Input
              value={taskData.title}
              onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={taskData.description}
              onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Priority</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={taskData.priority}
              onChange={(e) => setTaskData({ ...taskData, priority: e.target.value as any })}
            >
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={taskData.category}
              onChange={(e) => setTaskData({ ...taskData, category: e.target.value as any })}
            >
              <option value="LISTINGS">Listings</option>
              <option value="SUPPORT">Support</option>
              <option value="REVIEWS">Reviews</option>
              <option value="KEYWORDS">Keywords</option>
              <option value="PRICING">Pricing</option>
              <option value="INVENTORY">Inventory</option>
            </select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
