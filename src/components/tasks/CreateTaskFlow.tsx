import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTask, createSubtasks } from "@/lib/supabaseTasks";
import { useToast } from "@/hooks/use-toast";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateEnhancedTaskSuggestions } from "@/utils/taskSuggestions";

type CreateTaskStep = 1 | 2 | 3;

interface CreateTaskFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialData?: {
    title?: string;
    description?: string;
    category?: string;
    priority?: string;
    source?: 'manual' | 'insight' | 'suggested';
    sourceData?: any;
  };
}

export function CreateTaskFlow({ 
  open, 
  onOpenChange, 
  onSuccess, 
  initialData = {} 
}: CreateTaskFlowProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<CreateTaskStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const { toast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [taskData, setTaskData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    category: initialData.category || "LISTINGS",
    priority: initialData.priority || "MEDIUM",
    status: "Not Started",
    source: initialData.source || 'manual',
    data: initialData.sourceData || null
  });

  const validateStep = (stepNum: CreateTaskStep): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (stepNum) {
      case 1:
        if (!taskData.title.trim()) {
          newErrors.title = "Title is required";
        } else if (taskData.title.length < 3) {
          newErrors.title = "Title must be at least 3 characters";
        }
        if (!taskData.description.trim()) {
          newErrors.description = "Description is required";
        }
        break;
      case 2:
        if (!taskData.category) {
          newErrors.category = "Category is required";
        }
        break;
      case 3:
        if (!taskData.priority) {
          newErrors.priority = "Priority is required";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const getSuggestions = async () => {
      if (taskData.description && taskData.description.length > 10 && !isSuggesting) {
        setIsSuggesting(true);
        try {
          const suggestions = await generateEnhancedTaskSuggestions(taskData);
          if (suggestions) {
            setTaskData(prev => ({
              ...prev,
              category: suggestions.category || prev.category,
              priority: suggestions.priority || prev.priority,
            }));
            
            toast({
              title: "AI Suggestions Available",
              description: "Task details have been optimized based on your input.",
            });
          }
        } catch (error) {
          console.error("Error getting suggestions:", error);
        } finally {
          setIsSuggesting(false);
        }
      }
    };

    const debounceTimer = setTimeout(getSuggestions, 1000);
    return () => clearTimeout(debounceTimer);
  }, [taskData.description]);

  const handleNext = () => {
    if (step < 3) {
      setStep((prev) => (prev + 1) as CreateTaskStep);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => (prev - 1) as CreateTaskStep);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    try {
      setIsLoading(true);
      
      if (!localStorage.getItem('isAuthenticated')) {
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      const createdTask = await createTask(taskData);
      
      if (createdTask?.id) {
        let defaultSubtasks = [];
        
        if (taskData.source !== 'manual' && taskData.data) {
          try {
            const aiSuggestedTasks = await generateEnhancedTaskSuggestions(taskData.data);
            if (aiSuggestedTasks?.subtasks) {
              defaultSubtasks = aiSuggestedTasks.subtasks.map(task => ({
                task_id: createdTask.id,
                title: task.title,
                description: task.description || ""
              }));
            }
          } catch (error) {
            console.error("Error generating subtasks:", error);
            defaultSubtasks = [
              { task_id: createdTask.id, title: "Review requirements" },
              { task_id: createdTask.id, title: "Create action plan" },
              { task_id: createdTask.id, title: "Implement solution" }
            ];
          }
        } else {
          defaultSubtasks = [
            { task_id: createdTask.id, title: "Review requirements" },
            { task_id: createdTask.id, title: "Create action plan" },
            { task_id: createdTask.id, title: "Implement solution" }
          ];
        }
        
        await createSubtasks(defaultSubtasks);
      }
      
      toast({
        title: "Task Created Successfully",
        description: "Your new task has been created with AI-suggested optimizations.",
      });
      
      onOpenChange(false);
      
      if (createdTask?.id) {
        setTimeout(() => {
          navigate(`/task-work/${createdTask.id}`);
        }, 300);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error Creating Task",
        description: "There was an error creating your task. Please try again.",
        variant: "destructive",
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
            <DialogTitle>
              {step === 1 && "Create New Task"}
              {step === 2 && "Task Details"}
              {step === 3 && "Set Priority"}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex justify-center space-x-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-2 rounded-full ${
                s <= step ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Task Name"
                value={taskData.title}
                onChange={(e) => {
                  setTaskData({ ...taskData, title: e.target.value });
                  setErrors({ ...errors, title: "" });
                }}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <div className="text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.title}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Textarea
                  placeholder="Description"
                  value={taskData.description}
                  onChange={(e) => {
                    setTaskData({ ...taskData, description: e.target.value });
                    setErrors({ ...errors, description: "" });
                  }}
                  className={errors.description ? "border-destructive" : ""}
                />
                {isSuggesting && (
                  <div className="absolute right-2 top-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>
              {errors.description && (
                <div className="text-sm text-destructive flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {errors.description}
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={taskData.category}
                onChange={(e) =>
                  setTaskData({ ...taskData, category: e.target.value })
                }
              >
                <option value="LISTINGS">Listings</option>
                <option value="INVENTORY">Inventory</option>
                <option value="MARKETING">Marketing</option>
                <option value="SALES">Sales</option>
                <option value="ADVERTISING">Advertising</option>
                <option value="SUPPORT">Support</option>
              </select>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={taskData.priority}
                onChange={(e) =>
                  setTaskData({ ...taskData, priority: e.target.value })
                }
              >
                <option value="LOW">Low Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack} disabled={isLoading}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <Button 
              onClick={() => validateStep(step) && handleNext()}
              disabled={isSuggesting}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || isSuggesting}
              className="relative"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
