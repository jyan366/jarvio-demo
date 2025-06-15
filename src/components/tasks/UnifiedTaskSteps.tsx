
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Plus, Trash2, Play, Clock, ChevronRight, Workflow } from 'lucide-react';
import { UnifiedTask } from '@/types/unifiedTask';
import { parseTaskSteps, markStepCompleted } from '@/lib/unifiedTasks';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { FlowStepsManager } from '@/components/shared/FlowStepsManager';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { updateUnifiedTask } from '@/lib/unifiedTasks';

interface UnifiedTaskStepsProps {
  task: UnifiedTask;
  childTasks: UnifiedTask[];
  onTaskUpdate: () => void;
  onAddChildTask: (title: string) => void;
  onRemoveChildTask: (taskId: string) => void;
  onFlowStepsChange: (steps: FlowStep[]) => void;
  onFlowBlocksChange: (blocks: FlowBlock[]) => void;
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
  const [newChildTitle, setNewChildTitle] = useState('');
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [executingStep, setExecutingStep] = useState<number | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Parse steps - unified for all task types
  const steps = parseTaskSteps(task);
  const completedSteps = task.steps_completed || [];

  // Convert task data to flow format
  const flowSteps: FlowStep[] = task.data?.flowSteps || steps.map((step, index) => ({
    id: `step-${index}`,
    title: step,
    description: "",
    completed: completedSteps.includes(index),
    order: index,
    blockId: `block-${index}`
  }));

  const flowBlocks: FlowBlock[] = task.data?.flowBlocks || flowSteps.map((step, index) => ({
    id: step.blockId || `block-${index}`,
    type: 'collect' as const,
    option: 'User Text',
    name: step.title
  }));

  const handleClearCompletions = async () => {
    try {
      // Clear steps_completed and step_execution_log when generating new steps
      await updateUnifiedTask(task.id, {
        steps_completed: [],
        step_execution_log: []
      });
      onTaskUpdate(); // Refresh the task data
    } catch (error) {
      console.error('Error clearing completions:', error);
    }
  };

  const handleStepExecute = async (stepIndex: number) => {
    try {
      setExecutingStep(stepIndex);
      const stepDescription = steps[stepIndex] || `Step ${stepIndex + 1}`;
      await markStepCompleted(task.id, stepIndex, `Agent executed step: ${stepDescription}`);
      onTaskUpdate();
      toast({
        title: "Step completed",
        description: `Step ${stepIndex + 1} has been marked as completed`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark step as completed",
        variant: "destructive"
      });
    } finally {
      setExecutingStep(null);
    }
  };

  const handleAddChild = async () => {
    if (!newChildTitle.trim()) return;
    try {
      await onAddChildTask(newChildTitle);
      setNewChildTitle('');
      setIsAddingChild(false);
      toast({
        title: "Child task added",
        description: "New child task has been created"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add child task",
        variant: "destructive"
      });
    }
  };

  const handleRemoveChild = async (taskId: string) => {
    try {
      await onRemoveChildTask(taskId);
      toast({
        title: "Child task removed",
        description: "Child task has been deleted"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove child task",
        variant: "destructive"
      });
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const hasActualChildTasks = childTasks.length > 0;
  const isFlowTask = task.task_type === 'flow';

  return (
    <div className="space-y-6">
      {/* Flow Steps Manager - identical to flow builder */}
      <div>
        <div className="flex items-center justify-between mb-4">
          
        </div>

        <FlowStepsManager 
          steps={flowSteps} 
          blocks={flowBlocks} 
          onStepsChange={onFlowStepsChange} 
          onBlocksChange={onFlowBlocksChange} 
          taskTitle={task.title} 
          taskDescription={task.description} 
          showAIGenerator={true} 
          task={task}
          onClearCompletions={handleClearCompletions}
        />
      </div>

      {/* Child Tasks - only show for non-flow tasks or when actual child tasks exist */}
      {(!isFlowTask || hasActualChildTasks) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Child Tasks</h3>
            <Button
              onClick={() => setIsAddingChild(true)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Child Task
            </Button>
          </div>

          {childTasks.length === 0 && !isAddingChild ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No child tasks yet</p>
              <p className="text-xs text-gray-500 mt-1">Break down this task into smaller subtasks</p>
            </div>
          ) : (
            <div className="space-y-3">
              {childTasks.map((childTask) => (
                <Card key={childTask.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {childTask.status === 'Done' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{childTask.title}</h4>
                        {childTask.description && (
                          <p className="text-sm text-gray-600 mt-1">{childTask.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getTaskStatusColor(childTask.status)}>
                        {childTask.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/task/${childTask.id}`)}
                        className="flex items-center gap-1"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveChild(childTask.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Add Child Task Form */}
          {isAddingChild && (
            <Card className="p-4">
              <div className="space-y-3">
                <input
                  value={newChildTitle}
                  onChange={(e) => setNewChildTitle(e.target.value)}
                  placeholder="Enter child task title"
                  className="w-full px-3 py-2 border rounded-md"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddChild} disabled={!newChildTitle.trim()}>
                    Add Child Task
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddingChild(false);
                      setNewChildTitle('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
