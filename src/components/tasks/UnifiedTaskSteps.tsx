
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

  const isFlowTask = task.task_type === 'flow';
  
  // For flow tasks, try to get the flow data and display blocks as steps
  const getFlowSteps = () => {
    if (!isFlowTask || !task.data?.flowId) return [];
    
    try {
      const savedFlowsString = localStorage.getItem('jarviFlows');
      if (savedFlowsString) {
        const savedFlows = JSON.parse(savedFlowsString);
        const flow = savedFlows.find((f: any) => f.id === task.data.flowId);
        if (flow && flow.blocks) {
          return flow.blocks.map((block: any, index: number) => ({
            id: block.id,
            name: block.name || `${block.type}: ${block.option}`,
            description: `Flow step: ${block.option}`,
            index
          }));
        }
      }
    } catch (error) {
      console.error('Error loading flow steps:', error);
    }
    
    return [];
  };

  // Parse description into steps for regular tasks
  const descriptionSteps = !isFlowTask ? parseTaskSteps(task.description) : [];
  const flowSteps = isFlowTask ? getFlowSteps() : [];
  const completedSteps = task.steps_completed || [];

  const handleStepExecute = async (stepIndex: number) => {
    try {
      setExecutingStep(stepIndex);
      const stepDescription = isFlowTask 
        ? flowSteps[stepIndex]?.name || `Flow step ${stepIndex + 1}`
        : descriptionSteps[stepIndex];
      
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
        title: isFlowTask ? "Step added" : "Child task added",
        description: isFlowTask ? "New step has been created" : "New child task has been created"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: isFlowTask ? "Failed to add step" : "Failed to add child task",
        variant: "destructive"
      });
    }
  };

  const handleRemoveChild = async (taskId: string) => {
    try {
      await onRemoveChildTask(taskId);
      toast({
        title: isFlowTask ? "Step removed" : "Child task removed",
        description: isFlowTask ? "Step has been deleted" : "Child task has been deleted"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: isFlowTask ? "Failed to remove step" : "Failed to remove child task",
        variant: "destructive"
      });
    }
  };

  const getStepStatus = (stepIndex: number) => {
    return completedSteps.includes(stepIndex) ? 'completed' : 'pending';
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

  const stepsToDisplay = isFlowTask ? flowSteps : descriptionSteps;
  const hasSteps = stepsToDisplay.length > 0;

  return (
    <div className="space-y-6">
      {/* Task Steps - either from description or flow blocks */}
      {hasSteps && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            {isFlowTask && <Workflow className="h-5 w-5 text-purple-600" />}
            <h3 className="font-semibold text-lg">
              {isFlowTask ? 'Flow Steps' : 'Task Steps'}
            </h3>
          </div>
          <div className="space-y-3">
            {stepsToDisplay.map((step, index) => {
              const status = getStepStatus(index);
              const isExecuting = executingStep === index;
              const stepName = isFlowTask ? step.name : step;
              const stepDescription = isFlowTask ? step.description : null;
              
              return (
                <Card key={isFlowTask ? step.id : index} className={`transition-all ${status === 'completed' ? 'bg-green-50 border-green-200' : 'hover:shadow-sm'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className={`text-sm ${status === 'completed' ? 'text-green-800 line-through' : 'text-gray-700'}`}>
                          {stepName}
                        </p>
                        {stepDescription && (
                          <p className="text-xs text-gray-500 mt-1">{stepDescription}</p>
                        )}
                      </div>
                      
                      {status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStepExecute(index)}
                          disabled={isExecuting}
                          className="flex-shrink-0"
                        >
                          {isExecuting ? (
                            <>
                              <Clock className="h-4 w-4 mr-1 animate-spin" />
                              Executing
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-1" />
                              Execute
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Child Tasks - only show for non-flow tasks or when flow tasks have actual child tasks */}
      {(!isFlowTask || childTasks.length > 0) && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">
              {isFlowTask ? 'Additional Steps' : 'Child Tasks'}
            </h3>
            <Button
              size="sm"
              onClick={() => setIsAddingChild(true)}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              {isFlowTask ? 'Add Step' : 'Add Child Task'}
            </Button>
          </div>

          {/* Add new child task */}
          {isAddingChild && (
            <Card className="mb-4">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newChildTitle}
                    onChange={(e) => setNewChildTitle(e.target.value)}
                    placeholder={isFlowTask ? "Enter step title..." : "Enter child task title..."}
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
                  ? "No additional steps yet. Click \"Add Step\" to create one."
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
