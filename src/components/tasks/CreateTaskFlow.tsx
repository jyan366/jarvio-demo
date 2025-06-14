
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createUnifiedTask } from "@/lib/unifiedTasks";
import { useToast } from "@/hooks/use-toast";
import { X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreateTaskStepOne } from "./steps/CreateTaskStepOne";
import { CreateTaskStepTwo } from "./steps/CreateTaskStepTwo";
import { CreateTaskStepThree } from "./steps/CreateTaskStepThree";
import { TaskFormData } from "./types/createTask";

interface CreateTaskFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialData?: Partial<TaskFormData>;
}

type CreateTaskStep = 1 | 2 | 3;

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
  const [taskData, setTaskData] = useState<TaskFormData>({
    title: initialData.title || "",
    description: initialData.description || "",
    category: initialData.category || "LISTINGS",
    priority: initialData.priority || "MEDIUM",
    status: "Not Started",
    source: initialData.source || 'manual',
    sourceData: initialData.sourceData || null
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

  const handleNext = () => {
    if (validateStep(step)) {
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
      
      // Remove sourceData from the task data before sending to API
      const { sourceData, ...taskDataToSend } = taskData;
      
      // Create unified task with proper task_type
      const finalTaskData = {
        ...taskDataToSend,
        task_type: 'task' as const,
        data: sourceData ? { sourceData } : null
      };
      
      const createdTask = await createUnifiedTask(finalTaskData);
      
      if (createdTask?.id) {
        toast({
          title: "Task Created Successfully",
          description: "Your new task has been created and added to your tasks.",
        });
        
        onOpenChange(false);
        
        if (onSuccess) {
          onSuccess();
        }
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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <CreateTaskStepOne
            taskData={taskData}
            setTaskData={setTaskData}
            errors={errors}
            setErrors={setErrors}
            isSuggesting={isSuggesting}
          />
        );
      case 2:
        return (
          <CreateTaskStepTwo
            taskData={taskData}
            setTaskData={setTaskData}
            errors={errors}
            setErrors={setErrors}
          />
        );
      case 3:
        return (
          <CreateTaskStepThree
            taskData={taskData}
            setTaskData={setTaskData}
            errors={errors}
            setErrors={setErrors}
          />
        );
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

        {renderStepContent()}

        <div className="flex justify-between mt-6">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack} disabled={isLoading}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {step < 3 ? (
            <Button onClick={handleNext} disabled={isSuggesting}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
