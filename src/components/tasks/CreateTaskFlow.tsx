
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createUnifiedTask, updateUnifiedTask } from "@/lib/unifiedTasks";
import { useToast } from "@/hooks/use-toast";
import { X, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreateTaskStepOne } from "./steps/CreateTaskStepOne";
import { CreateTaskStepTwo } from "./steps/CreateTaskStepTwo";
import { CreateTaskStepThree } from "./steps/CreateTaskStepThree";
import { TaskFormData } from "./types/createTask";
import { supabase } from "@/integrations/supabase/client";

interface CreateTaskFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  initialData?: Partial<TaskFormData>;
  disableAutoStepGeneration?: boolean;
}

type CreateTaskStep = 1 | 2 | 3;

export function CreateTaskFlow({ 
  open, 
  onOpenChange, 
  onSuccess, 
  initialData = {},
  disableAutoStepGeneration = false
}: CreateTaskFlowProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<CreateTaskStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isGeneratingSteps, setIsGeneratingSteps] = useState(false);
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

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const shouldAutoGenerateSteps = (data: TaskFormData): boolean => {
    // If auto generation is disabled, never generate steps
    if (disableAutoStepGeneration) {
      return false;
    }
    
    // Always auto-generate steps for new tasks unless they explicitly seem like they have predefined steps
    // Only skip if the description already contains numbered steps or bullet points
    const hasStepsInDescription = data.description && (
      data.description.includes('1.') || 
      data.description.includes('2.') ||
      data.description.includes('•') ||
      data.description.includes('-') ||
      data.description.includes('Step 1') ||
      data.description.includes('First,') ||
      data.description.includes('Then,') ||
      data.description.includes('Finally,')
    );
    
    return !hasStepsInDescription;
  };

  const generateStepsWithAI = async (taskId: string, prompt: string) => {
    try {
      setIsGeneratingSteps(true);
      
      console.log("Generating steps for task:", taskId, "with prompt:", prompt);
      
      const response = await supabase.functions.invoke('generate-flow', {
        body: {
          prompt: prompt,
          blockOptions: {
            collect: ['User Text', 'File Upload', 'Data Import', 'Form Input'],
            think: ['Basic AI Analysis', 'Advanced Reasoning', 'Data Processing', 'Pattern Recognition'],
            act: ['AI Summary', 'Send Email', 'Create Report', 'Update Database', 'API Call'],
            agent: ['Agent']
          }
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (!response.data || response.data.success === false) {
        const errorMsg = response.data?.error || "Unknown error occurred";
        throw new Error(errorMsg);
      }

      const generatedFlow = response.data.generatedFlow;

      if (generatedFlow?.blocks && Array.isArray(generatedFlow.blocks)) {
        // Convert blocks to flow steps and blocks
        const flowSteps = generatedFlow.blocks.map((block: any, index: number) => ({
          id: generateUUID(),
          title: block.name || `Step ${index + 1}`,
          description: "",
          completed: false,
          order: index,
          blockId: generateUUID()
        }));

        const flowBlocks = generatedFlow.blocks.map((block: any, index: number) => ({
          id: flowSteps[index].blockId,
          type: block.type || 'collect',
          option: block.option || 'User Text',
          name: block.name || `Step ${index + 1}`
        }));

        // Update the task with the generated steps
        await updateUnifiedTask(taskId, {
          data: {
            flowSteps,
            flowBlocks
          },
          task_type: 'flow'
        });

        console.log("Successfully generated and saved", flowSteps.length, "steps for task");
        
        toast({
          title: "Steps Generated",
          description: `Generated ${flowSteps.length} steps with AI and saved to your task.`,
        });
      }
    } catch (error) {
      console.error("Error generating steps:", error);
      toast({
        title: "Error Generating Steps",
        description: "Failed to generate steps with AI, but your task was created successfully.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSteps(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    try {
      setIsLoading(true);
      
      if (!localStorage.getItem('isAuthenticated')) {
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      // Remove source and sourceData from the task data before sending to API
      const { source, sourceData, ...taskDataToSend } = taskData;
      
      // Create unified task with proper task_type and ensure proper typing
      const finalTaskData = {
        ...taskDataToSend,
        status: taskDataToSend.status as "Not Started" | "In Progress" | "Done",
        priority: taskDataToSend.priority as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
        task_type: 'task' as const,
        data: sourceData ? { sourceData } : null
      };
      
      const createdTask = await createUnifiedTask(finalTaskData);
      
      if (createdTask?.id) {
        // Only generate steps if auto generation is NOT disabled
        if (!disableAutoStepGeneration && shouldAutoGenerateSteps(taskData)) {
          setIsGeneratingSteps(true);
          const prompt = `${taskData.title}. ${taskData.description}`;
          await generateStepsWithAI(createdTask.id, prompt);
        }
        
        toast({
          title: "Task Created Successfully",
          description: (!disableAutoStepGeneration && shouldAutoGenerateSteps(taskData))
            ? "Your task has been created and AI is generating steps." 
            : "Your new task has been created and added to your tasks.",
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
      setIsGeneratingSteps(false);
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
            <Button variant="outline" onClick={handleBack} disabled={isLoading || (!disableAutoStepGeneration && isGeneratingSteps)}>
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
            <Button onClick={handleSubmit} disabled={isLoading || (!disableAutoStepGeneration && isGeneratingSteps)}>
              {(isLoading || (!disableAutoStepGeneration && isGeneratingSteps)) && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {(!disableAutoStepGeneration && isGeneratingSteps) ? "Generating Steps..." : isLoading ? "Creating..." : "Create Task"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
