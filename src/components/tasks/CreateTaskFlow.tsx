
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTask } from "@/lib/supabaseTasks";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";

type CreateTaskStep = 1 | 2 | 3;

interface CreateTaskFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateTaskFlow({ open, onOpenChange, onSuccess }: CreateTaskFlowProps) {
  const [step, setStep] = useState<CreateTaskStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    category: "LISTINGS",
    priority: "MEDIUM",
    status: "Not Started",
  });

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
    try {
      setIsLoading(true);
      const createdTask = await createTask(taskData);
      
      toast({
        title: "Task Created",
        description: "Your new task has been created successfully.",
      });
      
      onOpenChange(false);
      setStep(1);
      setTaskData({
        title: "",
        description: "",
        category: "LISTINGS",
        priority: "MEDIUM",
        status: "Not Started",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error creating task:", error);
      toast({
        title: "Error",
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
                onChange={(e) =>
                  setTaskData({ ...taskData, title: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Description"
                value={taskData.description}
                onChange={(e) =>
                  setTaskData({ ...taskData, description: e.target.value })
                }
              />
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
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
