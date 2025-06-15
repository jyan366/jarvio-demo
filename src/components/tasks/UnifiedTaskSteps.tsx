
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Play, 
  Clock,
  ChevronRight,
  Workflow
} from 'lucide-react';
import { UnifiedTask } from '@/types/unifiedTask';
import { parseTaskSteps, markStepCompleted } from '@/lib/unifiedTasks';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { FlowStepsManager } from '@/components/shared/FlowStepsManager';
import { FlowStep, FlowBlock } from '@/types/flowTypes';

interface UnifiedTaskStepsProps {
  task: UnifiedTask;
  childTasks: UnifiedTask[];
  onTaskUpdate: () => void;
  onAddChildTask: (title: string) => void;
  onRemoveChildTask: (taskId: string) => void;
}

export function UnifiedTaskSteps({ 
  task, 
  childTasks, 
  onTaskUpdate, 
  onAddChildTask, 
  onRemoveChildTask 
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
  const flowSteps: FlowStep[] = (task.data?.flowSteps || steps.map((step, index) => ({
    id: `step-${index}`,
    title: step,
    description: "",
    completed: completedSteps.includes(index),
    order: index,
    blockId: `block-${index}`
  })));

  const flowBlocks: FlowBlock[] = (task.data?.flowBlocks || flowSteps.map((step, index) => ({
    id: step.blockId || `block-${index}`,
    type: 'collect' as const,
    option: 'User Text',
    name: step.title
  })));

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

  const handleFlowStepsChange = (updatedSteps: FlowStep[]) => {
    // Update task data with new flow steps
    const updatedData = {
      ...task.data,
      flowSteps: updatedSteps,
      flowBlocks: flowBlocks // Keep existing blocks
    };
    // Note: This would need to be implemented in the hook
    console.log('Updated flow steps:', updatedSteps);
    onTaskUpdate();
  };

  const handleFlowBlocksChange = (updatedBlocks: FlowBlock[]) => {
    // Update task data with new flow blocks
    const updatedData = {
      ...task.data,
      flowSteps: flowSteps, // Keep existing steps
      flowBlocks: updatedBlocks
    };
    // Note: This would need to be implemented in the hook
    console.log('Updated flow blocks:', updatedBlocks);
    onTaskUpdate();
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
          <div className="flex items-center gap-2">
            {isFlowTask && <Workflow className="h-5 w-5 text-purple-600" />}
            <h3 className="font-semibold text-lg">
              {isFlowTask ? 'Flow Steps' : 'Task Steps'}
            </h3>
            <Badge variant="outline" className="text-xs">
              {completedSteps.length} / {flowSteps.length} completed
            </Badge>
          </div>
        </div>

        <FlowStepsManager
          steps={flowSteps}
          blocks={flowBlocks}
          onStepsChange={handleFlowStepsChange}
          onBlocksChange={handleFlowBlocksChange}
          taskTitle={task.title}
          taskDescription={task.description}
          showAIGenerator={true}
        />
      </div>

      {/* Child Tasks - only show for non-flow tasks or when actual child tasks exist */}
      {(!isFlowTask || hasActualChildTasks) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Child Tasks</h3>
            {!isFlowTask && (
              <Button
                size="sm"
                onClick={() => setIsAddingChild(true)}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Child Task
              </Button>
            )}
          </div>

          {/* Add new child task - only for non-flow tasks */}
          {!isFlowTask && isAddingChild && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChildTitle}
                    onChange={(e) => setNewChildTitle(e.target.value)}
                    placeholder="Enter child task title..."
                    className="flex-1 px-3 py-2 border rounded-md"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddChild()}
                    autoFocus
                  />
                  <Button onClick={handleAddChild} disabled={!newChildTitle.trim()}>
                    Add
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setIsAddingChild(false);
                    setNewChildTitle('');
                  }}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Child tasks list */}
          <div className="space-y-3">
            {childTasks.map((childTask) => (
              <Card key={childTask.id} className="hover:shadow-sm transition-all cursor-pointer group">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div 
                      className="flex items-center gap-3 flex-1"
                      onClick={() => navigate(`/task/${childTask.id}`)}
                    >
                      <Badge className={getTaskStatusColor(childTask.status)}>
                        {childTask.status}
                      </Badge>
                      <h4 className="font-medium">{childTask.title}</h4>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 ml-auto" />
                    </div>
                    
                    {!isFlowTask && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveChild(childTask.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                  
                  {childTask.description && (
                    <p className="text-sm text-gray-600 mt-2 ml-[4.5rem]">
                      {childTask.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
            
            {childTasks.length === 0 && !isAddingChild && (
              <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                {isFlowTask 
                  ? "This flow task manages its steps internally. Child tasks are not applicable for flows."
                  : "No child tasks yet. Click \"Add Child Task\" to create one."
                }
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
