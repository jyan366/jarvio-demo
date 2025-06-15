
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, GripVertical, CheckCircle2, Circle, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { AIStepGenerator } from './AIStepGenerator';
import { StepEditor } from './StepEditor';
import { UnifiedTask } from '@/types/unifiedTask';

interface FlowStepsManagerProps {
  steps: FlowStep[];
  blocks: FlowBlock[];
  onStepsChange: (steps: FlowStep[]) => void;
  onBlocksChange: (blocks: FlowBlock[]) => void;
  taskTitle?: string;
  taskDescription?: string;
  showAIGenerator?: boolean;
  task?: UnifiedTask;
  onClearCompletions?: () => void;
}

export function FlowStepsManager({
  steps,
  blocks,
  onStepsChange,
  onBlocksChange,
  taskTitle,
  taskDescription,
  showAIGenerator = true,
  task,
  onClearCompletions
}: FlowStepsManagerProps) {
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [isAddingStep, setIsAddingStep] = useState(false);

  const handleStepsGenerated = async (newSteps: FlowStep[], newBlocks: FlowBlock[]) => {
    console.log('Generated steps:', newSteps);
    console.log('Generated blocks:', newBlocks);
    
    // Update both steps and blocks
    onStepsChange(newSteps);
    onBlocksChange(newBlocks);
  };

  const handleAddStep = () => {
    const newStep: FlowStep = {
      id: crypto.randomUUID(),
      title: 'New step',
      description: '',
      completed: false,
      order: steps.length,
      blockId: crypto.randomUUID()
    };

    const newBlock: FlowBlock = {
      id: newStep.blockId!,
      type: 'collect',
      option: 'User Text',
      name: newStep.title
    };

    onStepsChange([...steps, newStep]);
    onBlocksChange([...blocks, newBlock]);
    setEditingStepId(newStep.id);
  };

  const handleUpdateStep = (stepId: string, updates: Partial<FlowStep>) => {
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    );
    onStepsChange(updatedSteps);

    // Update corresponding block name if title changed
    if (updates.title) {
      const step = steps.find(s => s.id === stepId);
      if (step?.blockId) {
        const updatedBlocks = blocks.map(block =>
          block.id === step.blockId ? { ...block, name: updates.title } : block
        );
        onBlocksChange(updatedBlocks);
      }
    }
  };

  const handleDeleteStep = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    const updatedSteps = steps
      .filter(s => s.id !== stepId)
      .map((step, index) => ({ ...step, order: index }));
    
    onStepsChange(updatedSteps);

    // Remove corresponding block
    if (step?.blockId) {
      const updatedBlocks = blocks.filter(block => block.id !== step.blockId);
      onBlocksChange(updatedBlocks);
    }
  };

  const handleMoveStep = (stepId: string, direction: 'up' | 'down') => {
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
    onStepsChange(reorderedSteps);
  };

  const handleToggleComplete = (stepId: string) => {
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, completed: !step.completed } : step
    );
    onStepsChange(updatedSteps);
  };

  const sortedSteps = [...steps].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div className="space-y-4">
      {showAIGenerator && (
        <AIStepGenerator
          onStepsGenerated={handleStepsGenerated}
          taskTitle={taskTitle}
          taskDescription={taskDescription}
          onClearCompletions={onClearCompletions}
        />
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Steps</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {steps.length} step{steps.length !== 1 ? 's' : ''}
              </Badge>
              <Button onClick={handleAddStep} size="sm" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Step
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {sortedSteps.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No steps yet</p>
              <p className="text-sm">Use "Generate steps with AI" or click "Add Step" to get started</p>
            </div>
          ) : (
            sortedSteps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-3 p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleComplete(step.id)}
                    className="flex-shrink-0"
                  >
                    {step.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  <span className="text-xs font-medium text-gray-500 w-6 text-center">
                    {index + 1}
                  </span>
                </div>
                
                <div className="flex-1">
                  {editingStepId === step.id ? (
                    <StepEditor
                      step={step}
                      onSave={(updates) => {
                        handleUpdateStep(step.id, updates);
                        setEditingStepId(null);
                      }}
                      onCancel={() => setEditingStepId(null)}
                    />
                  ) : (
                    <div 
                      className="cursor-pointer"
                      onClick={() => setEditingStepId(step.id)}
                    >
                      <h4 className="font-medium">{step.title}</h4>
                      {step.description && (
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMoveStep(step.id, 'up')}
                    disabled={index === 0}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMoveStep(step.id, 'down')}
                    disabled={index === sortedSteps.length - 1}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteStep(step.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
