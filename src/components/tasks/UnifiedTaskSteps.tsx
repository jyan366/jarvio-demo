
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Check, X, Play, Pause, MoreHorizontal, Trash2 } from "lucide-react";
import { parseTaskSteps } from "@/lib/unifiedTasks";
import { getFlowStepsWithBlocks } from "@/lib/flowStepHelpers";
import { FlowStepInfo } from "./FlowStepInfo";
import { UnifiedTask } from "@/types/unifiedTask";

interface UnifiedTaskStepsProps {
  task: UnifiedTask;
  childTasks: UnifiedTask[];
  onTaskUpdate: () => void;
  onAddChildTask: (title: string, description?: string) => Promise<UnifiedTask>;
  onRemoveChildTask: (childId: string) => Promise<void>;
}

export function UnifiedTaskSteps({
  task,
  childTasks,
  onTaskUpdate,
  onAddChildTask,
  onRemoveChildTask
}: UnifiedTaskStepsProps) {
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChildTitle, setNewChildTitle] = useState("");
  const [newChildDescription, setNewChildDescription] = useState("");

  // Get steps based on task type
  const getStepsToDisplay = () => {
    if (task.task_type === 'flow') {
      // For flow tasks, get steps with block information
      return getFlowStepsWithBlocks(task);
    } else {
      // For regular tasks, parse steps from description or use child tasks
      const parsedSteps = parseTaskSteps(task);
      return parsedSteps.map((stepTitle, index) => ({
        id: `step-${index}`,
        title: stepTitle,
        completed: task.steps_completed?.includes(index) || false,
        order: index,
        block: undefined
      }));
    }
  };

  const steps = getStepsToDisplay();
  const isFlowTask = task.task_type === 'flow';

  const handleAddChild = async () => {
    if (!newChildTitle.trim()) return;
    
    try {
      await onAddChildTask(newChildTitle, newChildDescription);
      setNewChildTitle("");
      setNewChildDescription("");
      setIsAddingChild(false);
      onTaskUpdate();
    } catch (error) {
      console.error("Error adding child task:", error);
    }
  };

  const handleRemoveChild = async (childId: string) => {
    try {
      await onRemoveChildTask(childId);
      onTaskUpdate();
    } catch (error) {
      console.error("Error removing child task:", error);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="steps">
            {isFlowTask ? "Flow Steps" : "Task Steps"} ({steps.length})
          </TabsTrigger>
          <TabsTrigger value="subtasks">
            Child Tasks ({childTasks.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-4">
          <div className="space-y-3">
            {steps.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground">
                    {isFlowTask ? "No flow steps defined" : "No steps found in task description"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              steps.map((step, index) => (
                <Card key={step.id} className="transition-all hover:shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                        {index + 1}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{step.title}</h4>
                          {step.completed && (
                            <Badge variant="secondary" className="bg-green-50 text-green-700">
                              <Check className="w-3 h-3 mr-1" />
                              Complete
                            </Badge>
                          )}
                        </div>
                        
                        {step.description && (
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        )}
                        
                        {/* Show block information for flow tasks */}
                        {isFlowTask && step.block && (
                          <FlowStepInfo block={step.block} />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="subtasks" className="space-y-4">
          <div className="space-y-3">
            {childTasks.map((child) => (
              <Card key={child.id} className="transition-all hover:shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{child.title}</h4>
                      {child.description && (
                        <p className="text-sm text-muted-foreground mt-1">{child.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{child.status}</Badge>
                        <Badge variant="outline">{child.priority}</Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveChild(child.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {isAddingChild ? (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <Input
                    value={newChildTitle}
                    onChange={(e) => setNewChildTitle(e.target.value)}
                    placeholder="Child task title"
                    autoFocus
                  />
                  <Textarea
                    value={newChildDescription}
                    onChange={(e) => setNewChildDescription(e.target.value)}
                    placeholder="Child task description (optional)"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleAddChild} disabled={!newChildTitle.trim()}>
                      Add Child Task
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsAddingChild(false);
                        setNewChildTitle("");
                        setNewChildDescription("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Button
                onClick={() => setIsAddingChild(true)}
                variant="outline"
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Child Task
              </Button>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
