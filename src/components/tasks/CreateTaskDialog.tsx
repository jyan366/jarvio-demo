
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createUnifiedTask } from '@/lib/unifiedTasks';
import { useToast } from '@/hooks/use-toast';

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTask: () => void;
  disableAutoStepGeneration?: boolean;
}

export function CreateTaskDialog({ 
  open, 
  onOpenChange, 
  onCreateTask, 
  disableAutoStepGeneration = false 
}: CreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('LISTINGS');
  const [priority, setPriority] = useState('MEDIUM');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
      
      // Create task without auto-generating steps when flag is set
      await createUnifiedTask({
        title: title.trim(),
        description: description.trim(),
        category,
        priority: priority as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
        status: "Not Started",
        task_type: 'task',
        data: disableAutoStepGeneration ? { skipAutoStepGeneration: true } : null
      });
      
      toast({
        title: "Task Created",
        description: "Your task has been created successfully"
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setCategory('LISTINGS');
      setPriority('MEDIUM');
      
      onCreateTask();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating task:', error);
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
          <DialogTitle>Create New Task</DialogTitle>
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
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
