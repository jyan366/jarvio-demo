
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, CheckCircle2, Circle } from 'lucide-react';
import { FlowStep } from '@/types/flowTypes';
import { v4 as uuidv4 } from 'uuid';

interface FlowBlockStepsEditorProps {
  blockId: string;
  blockName: string;
  steps: FlowStep[];
  onStepsChange: (blockId: string, steps: FlowStep[]) => void;
}

export function FlowBlockStepsEditor({ 
  blockId, 
  blockName, 
  steps = [], 
  onStepsChange 
}: FlowBlockStepsEditorProps) {
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDescription, setNewStepDescription] = useState('');

  const addStep = () => {
    if (!newStepTitle.trim()) return;
    
    const newStep: FlowStep = {
      id: uuidv4(),
      title: newStepTitle,
      description: newStepDescription,
      completed: false,
      order: steps.length
    };
    
    onStepsChange(blockId, [...steps, newStep]);
    setNewStepTitle('');
    setNewStepDescription('');
    setIsAddingStep(false);
  };

  const removeStep = (stepId: string) => {
    const updatedSteps = steps
      .filter(step => step.id !== stepId)
      .map((step, index) => ({ ...step, order: index }));
    onStepsChange(blockId, updatedSteps);
  };

  const updateStep = (stepId: string, updates: Partial<FlowStep>) => {
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    );
    onStepsChange(blockId, updatedSteps);
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
    
    // Update order numbers
    const reorderedSteps = newSteps.map((step, index) => ({ ...step, order: index }));
    onStepsChange(blockId, reorderedSteps);
  };

  return (
    <Card className="mt-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Steps for {blockName}
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {steps.length} step{steps.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              <span className="text-xs font-medium text-gray-500 w-6 text-center">
                {index + 1}
              </span>
            </div>
            
            <div className="flex-1 space-y-2">
              <Input
                value={step.title}
                onChange={(e) => updateStep(step.id, { title: e.target.value })}
                placeholder="Step title"
                className="text-sm"
              />
              {step.description && (
                <Textarea
                  value={step.description}
                  onChange={(e) => updateStep(step.id, { description: e.target.value })}
                  placeholder="Step description (optional)"
                  className="text-xs min-h-[60px]"
                />
              )}
            </div>
            
            <div className="flex flex-col gap-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => moveStep(step.id, 'up')}
                disabled={index === 0}
                className="h-6 w-6 p-0"
              >
                ↑
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => moveStep(step.id, 'down')}
                disabled={index === steps.length - 1}
                className="h-6 w-6 p-0"
              >
                ↓
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeStep(step.id)}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}

        {isAddingStep ? (
          <div className="p-3 border rounded-lg bg-blue-50 space-y-3">
            <Input
              value={newStepTitle}
              onChange={(e) => setNewStepTitle(e.target.value)}
              placeholder="Enter step title"
              className="text-sm"
              autoFocus
            />
            <Textarea
              value={newStepDescription}
              onChange={(e) => setNewStepDescription(e.target.value)}
              placeholder="Enter step description (optional)"
              className="text-xs min-h-[60px]"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={addStep} disabled={!newStepTitle.trim()}>
                Add Step
              </Button>
              <Button size="sm" variant="outline" onClick={() => {
                setIsAddingStep(false);
                setNewStepTitle('');
                setNewStepDescription('');
              }}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsAddingStep(true)}
            className="w-full flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Step
          </Button>
        )}

        {steps.length === 0 && !isAddingStep && (
          <div className="text-center py-6 text-gray-500 text-sm">
            No steps added yet. Click "Add Step" to create the first step for this block.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
