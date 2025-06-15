
import React, { useState } from 'react';
import { UnifiedTask } from '@/types/unifiedTask';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface UnifiedTaskStepsProps {
  task: UnifiedTask;
  childTasks: UnifiedTask[];
  onTaskUpdate: () => void;
  onAddChildTask: (title: string) => Promise<UnifiedTask>;
  onRemoveChildTask: (childId: string) => Promise<void>;
  onFlowStepsChange?: (steps: any[]) => void;
  onFlowBlocksChange?: (blocks: any[]) => void;
}

export function UnifiedTaskSteps({
  task,
  childTasks,
  onTaskUpdate,
  onAddChildTask,
  onRemoveChildTask,
  onFlowStepsChange,
  onFlowBlocksChange
}: UnifiedTaskStepsProps) {
  const [newStepTitle, setNewStepTitle] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleAddStep = async () => {
    if (!newStepTitle.trim()) return;
    
    try {
      await onAddChildTask(newStepTitle.trim());
      setNewStepTitle('');
      onTaskUpdate();
      toast({
        title: "Step added",
        description: "New step has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add step.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveStep = async (stepId: string) => {
    try {
      await onRemoveChildTask(stepId);
      onTaskUpdate();
      toast({
        title: "Step removed",
        description: "Step has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove step.",
        variant: "destructive",
      });
    }
  };

  const handleStepToggle = async (step: UnifiedTask) => {
    try {
      const newStatus = step.status === 'Done' ? 'Not Started' : 'Done';
      
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', step.id);
        
      if (error) throw error;
      
      onTaskUpdate();
      toast({
        title: "Step updated",
        description: `Step marked as ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update step.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateSteps = async () => {
    setIsGenerating(true);
    try {
      console.log("Generating steps for task:", task.title, task.description);
      
      const response = await supabase.functions.invoke('generate-task-steps', {
        body: {
          title: task.title,
          description: task.description || ""
        }
      });

      if (response.error) {
        throw new Error(response.error.message || "Failed to generate steps");
      }

      if (!response.data || !response.data.steps || !Array.isArray(response.data.steps)) {
        throw new Error("Invalid response from step generation service");
      }

      const generatedSteps = response.data.steps;
      console.log("Generated steps:", generatedSteps);

      if (generatedSteps.length === 0) {
        throw new Error("No steps were generated");
      }

      // Clear existing child tasks
      for (const child of childTasks) {
        await onRemoveChildTask(child.id);
      }

      // Create new child tasks from generated steps
      for (let i = 0; i < generatedSteps.length; i++) {
        const step = generatedSteps[i];
        await onAddChildTask(step.title);
      }
      
      onTaskUpdate();
      
      toast({
        title: "Steps generated",
        description: `Generated ${generatedSteps.length} steps successfully`,
      });
      
    } catch (error) {
      console.error("Error generating steps:", error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Error generating steps",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Generate Steps Button */}
      <div className="flex gap-4 items-center mb-4">
        <Button
          variant="outline"
          onClick={handleGenerateSteps}
          disabled={isGenerating}
          className="text-xs"
        >
          {isGenerating && <Loader2 className="w-4 h-4 mr-1 animate-spin" />} 
          Generate steps with AI
        </Button>
        <span className="text-neutral-400 text-xs">
          {childTasks.length > 0 ? "Replace current steps" : "Break down this task"}
        </span>
      </div>

      {/* Steps List */}
      <div className="space-y-2">
        <h3 className="font-semibold text-base mb-2">
          Steps ({childTasks.length})
        </h3>
        
        {childTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No steps yet. Add steps manually or generate them with AI.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {childTasks
              .sort((a, b) => (a.execution_order || 0) - (b.execution_order || 0))
              .map((step, index) => (
                <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Checkbox
                    checked={step.status === 'Done'}
                    onCheckedChange={() => handleStepToggle(step)}
                  />
                  <div className="flex-1">
                    <span className={`${step.status === 'Done' ? 'line-through text-muted-foreground' : ''}`}>
                      {step.title}
                    </span>
                    {step.description && (
                      <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveStep(step.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Add New Step */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a new step..."
          value={newStepTitle}
          onChange={(e) => setNewStepTitle(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddStep();
            }
          }}
        />
        <Button onClick={handleAddStep} disabled={!newStepTitle.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
