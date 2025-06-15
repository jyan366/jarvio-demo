import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Play, 
  Clock,
  ChevronRight,
  Workflow,
  Sparkles,
  Edit3,
  Save,
  X
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
  updateTaskDescription?: (description: string) => Promise<void>;
}

export function UnifiedTaskSteps({ 
  task, 
  childTasks, 
  onTaskUpdate, 
  onAddChildTask, 
  onRemoveChildTask,
  updateTaskDescription 
}: UnifiedTaskStepsProps) {
  const [newChildTitle, setNewChildTitle] = useState('');
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [executingStep, setExecutingStep] = useState<number | null>(null);
  const [editingSteps, setEditingSteps] = useState(false);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [isGeneratingSteps, setIsGeneratingSteps] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Parse steps - unified for all task types
  const steps = parseTaskSteps(task);
  const completedSteps = task.steps_completed || [];

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

  const handleCreateWithAI = async () => {
    setIsGeneratingSteps(true);
    try {
      // Simulate AI step generation - in a real app, this would call an AI service
      const aiGeneratedSteps = [
        "Research and analyze the requirements",
        "Plan the implementation approach", 
        "Set up the development environment",
        "Implement the core functionality",
        "Test and validate the implementation",
        "Document the solution",
        "Deploy and monitor"
      ];
      
      const newDescription = aiGeneratedSteps.map((step, index) => `${index + 1}. ${step}`).join('\n');
      setEditedDescription(newDescription);
      setEditingSteps(true);
      
      toast({
        title: "AI Steps Generated",
        description: "AI has generated task steps. Review and save them."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI steps",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingSteps(false);
    }
  };

  const handleSaveSteps = async () => {
    try {
      if (updateTaskDescription) {
        await updateTaskDescription(editedDescription);
      }
      setEditingSteps(false);
      onTaskUpdate();
    } catch (error) {
      toast({
        title: "Error", 
        description: "Failed to update steps",
        variant: "destructive"
      });
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

  const hasSteps = steps.length > 0;
  const hasActualChildTasks = childTasks.length > 0;
  const isFlowTask = task.task_type === 'flow';

  return (
    <div className="space-y-6">
      {/* Task Steps - unified handling for all task types */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {isFlowTask && <Workflow className="h-5 w-5 text-purple-600" />}
            <h3 className="font-semibold text-lg">
              {isFlowTask ? 'Flow Steps' : 'Task Steps'}
            </h3>
            {hasSteps && (
              <Badge variant="outline" className="text-xs">
                {completedSteps.length} / {steps.length} completed
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCreateWithAI}
              disabled={isGeneratingSteps}
              className="flex items-center gap-2"
            >
              {isGeneratingSteps ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Create with AI
                </>
              )}
            </Button>
            {hasSteps && !editingSteps && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingSteps(true);
                  setEditedDescription(task.description || '');
                }}
                className="flex items-center gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Edit Steps
              </Button>
            )}
          </div>
        </div>

        {/* Step editing mode */}
        {editingSteps && (
          <Card className="mb-4">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Edit Task Steps (one per line or numbered list)
                  </label>
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Enter task steps, one per line or as a numbered list..."
                    className="min-h-[200px]"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSaveSteps} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Steps
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setEditingSteps(false);
                      setEditedDescription(task.description || '');
                    }}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Steps display */}
        {hasSteps && !editingSteps && (
          <div className="space-y-3">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              const isExecuting = executingStep === index;
              
              return (
                <Card key={index} className={`transition-all ${status === 'completed' ? 'bg-green-50 border-green-200' : 'hover:shadow-sm'}`}>
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
                          {step}
                        </p>
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
        )}

        {/* Empty state for no steps */}
        {!hasSteps && !editingSteps && (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <p className="mb-4">No steps defined for this task yet.</p>
            <Button
              onClick={handleCreateWithAI}
              disabled={isGeneratingSteps}
              className="flex items-center gap-2"
            >
              {isGeneratingSteps ? (
                <>
                  <Clock className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Create with AI
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Child Tasks - FIXED: Only show for non-flow tasks or when actual child tasks exist */}
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
