
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, CheckCircle2, Circle, Play, Clock } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  order?: number;
}

interface StepEditorProps {
  steps: Step[];
  onStepsChange: (steps: Step[]) => void;
  onStepExecute?: (stepIndex: number) => void;
  completedSteps?: number[];
  executingStep?: number | null;
  title?: string;
  showExecuteButtons?: boolean;
  showCompletionStatus?: boolean;
}

export function StepEditor({ 
  steps, 
  onStepsChange, 
  onStepExecute,
  completedSteps = [],
  executingStep = null,
  title = "Steps",
  showExecuteButtons = false,
  showCompletionStatus = false
}: StepEditorProps) {
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');

  const addStep = () => {
    if (!newStepTitle.trim()) return;
    
    const newStep: Step = {
      id: crypto.randomUUID(),
      title: newStepTitle,
      completed: false,
      order: steps.length
    };
    
    onStepsChange([...steps, newStep]);
    setNewStepTitle('');
    setIsAddingStep(false);
  };

  const removeStep = (stepId: string) => {
    const updatedSteps = steps
      .filter(step => step.id !== stepId)
      .map((step, index) => ({ ...step, order: index }));
    onStepsChange(updatedSteps);
  };

  const updateStep = (stepId: string, updates: Partial<Step>) => {
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    );
    onStepsChange(updatedSteps);
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (
      (direction === 'up' && stepIndex === 0) ||
      (direction === 'down' && stepIndex === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    [newSteps[stepIndex], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[stepIndex]];
    
    const reorderedSteps = newSteps.map((step, index) => ({ ...step, order: index }));
    onStepsChange(reorderedSteps);
  };

  const getStepStatus = (stepIndex: number) => {
    return completedSteps.includes(stepIndex) ? 'completed' : 'pending';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-lg">{title}</h3>
          {showCompletionStatus && (
            <Badge variant="outline" className="text-xs">
              {completedSteps.length} / {steps.length} completed
            </Badge>
          )}
        </div>
        <Button
          size="sm"
          onClick={() => setIsAddingStep(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Step
        </Button>
      </div>

      <div className="space-y-3">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const isExecuting = executingStep === index;
          
          return (
            <Card key={step.id} className={`transition-all ${status === 'completed' ? 'bg-green-50 border-green-200' : 'hover:shadow-sm'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    {showCompletionStatus && (
                      <div className="flex-shrink-0">
                        {status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <Circle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    )}
                    <span className="text-xs font-medium text-gray-500 w-6 text-center">
                      {index + 1}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <Input
                      value={step.title}
                      onChange={(e) => updateStep(step.id, { title: e.target.value })}
                      placeholder="Step title"
                      className={`border-none shadow-none p-0 h-auto text-sm ${status === 'completed' ? 'text-green-800 line-through' : 'text-gray-700'}`}
                    />
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {showExecuteButtons && status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onStepExecute?.(index)}
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
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveStep(step.id, 'up')}
                      disabled={index === 0}
                      className="h-8 w-8 p-0"
                    >
                      ↑
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveStep(step.id, 'down')}
                      disabled={index === steps.length - 1}
                      className="h-8 w-8 p-0"
                    >
                      ↓
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeStep(step.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isAddingStep && (
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                placeholder="Enter step title"
                className="flex-1"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && addStep()}
              />
              <Button onClick={addStep} disabled={!newStepTitle.trim()}>
                Add
              </Button>
              <Button variant="outline" onClick={() => {
                setIsAddingStep(false);
                setNewStepTitle('');
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {steps.length === 0 && !isAddingStep && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          No steps added yet. Click "Add Step" to create the first step.
        </div>
      )}
    </div>
  );
}
