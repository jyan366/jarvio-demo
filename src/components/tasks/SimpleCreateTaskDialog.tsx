
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createUnifiedTask } from '@/lib/unifiedTasks';
import { useToast } from '@/hooks/use-toast';
import { X, Loader2 } from 'lucide-react';

interface SimpleCreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function SimpleCreateTaskDialog({ open, onOpenChange, onSuccess }: SimpleCreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('LISTINGS');
  const [priority, setPriority] = useState('MEDIUM');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("=== SIMPLE CREATE TASK DEBUG START ===");
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("About to call createUnifiedTask with skipAutoStepGeneration: true");
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      
      if (!localStorage.getItem('isAuthenticated')) {
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      // Create simple task with explicit flags to prevent any step generation
      const taskData = {
        title: title.trim(),
        description: description.trim(),
        category,
        priority: priority as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
        status: "Not Started" as const,
        task_type: 'task' as const,
        data: { 
          skipAutoStepGeneration: true,
          isSimpleTask: true,
          preventStepGeneration: true
        }
      };
      
      console.log("Task data being sent:", taskData);
      
      await createUnifiedTask(taskData);
      
      console.log("=== SIMPLE CREATE TASK DEBUG END - SUCCESS ===");
      
      toast({
        title: "Task Created",
        description: "Your task has been created successfully"
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('LISTINGS');
      setPriority('MEDIUM');
      
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating simple task:', error);
      console.log("=== SIMPLE CREATE TASK DEBUG END - ERROR ===");
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Create New Task</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LISTINGS">Listings</SelectItem>
                <SelectItem value="INVENTORY">Inventory</SelectItem>
                <SelectItem value="MARKETING">Marketing</SelectItem>
                <SelectItem value="CUSTOMER_SERVICE">Customer Service</SelectItem>
                <SelectItem value="ANALYTICS">Analytics</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
