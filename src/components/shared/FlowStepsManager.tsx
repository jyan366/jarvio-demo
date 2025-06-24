import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, GripVertical, Wand2, RotateCcw } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { AIStepGenerator } from './AIStepGenerator';
import { StepEditor } from './StepEditor';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
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
  showAIGenerator = false,
  task,
  onClearCompletions
}: FlowStepsManagerProps) {
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [isAIStepGeneratorOpen, setIsAIStepGeneratorOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStep, setSelectedStep] = useState<FlowStep | null>(null);
  const [stepBeingDragged, setStepBeingDragged] = useState<string | null>(null);
  const [stepsOrder, setStepsOrder] = useState(steps.map(s => s.id));
  const [localSteps, setSteps] = useState(steps);
  const [localBlocks, setBlocks] = useState(blocks);

  const handleGeneratedSteps = async (generatedSteps: FlowStep[], generatedBlocks: FlowBlock[]) => {
    // Clear completions first if callback provided
    if (onClearCompletions) {
      await onClearCompletions();
    }

    setSteps(generatedSteps);
    setBlocks(generatedBlocks);
    onStepsChange(generatedSteps);
    onBlocksChange(generatedBlocks);
    
    // Removed toast notification - no longer showing success message
  };

  const handleStepUpdate = (stepId: string, updates: Partial<FlowStep>) => {
    const updatedSteps = localSteps.map(step => 
      step.id === stepId ? { ...step, ...updates } : step
    );
    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
    
    // Removed toast notification
  };

  const handleStepDelete = (stepId: string) => {
    const updatedSteps = localSteps.filter(step => step.id !== stepId);
    const updatedBlocks = localBlocks.filter(block => 
      !localSteps.find(step => step.id === stepId && step.blockId === block.id)
    );
    
    setSteps(updatedSteps);
    setBlocks(updatedBlocks);
    onStepsChange(updatedSteps);
    onBlocksChange(updatedBlocks);
    
    // Removed toast notification
  };

  const handleAddStep = () => {
    const newStep: FlowStep = {
      id: `step-${Date.now()}`,
      title: 'New Step',
      description: '',
      completed: false,
      order: localSteps.length,
      blockId: `block-${Date.now()}`
    };
    
    const newBlock: FlowBlock = {
      id: newStep.blockId,
      type: 'collect',
      option: 'User Text',
      name: newStep.title
    };
    
    const updatedSteps = [...localSteps, newStep];
    const updatedBlocks = [...localBlocks, newBlock];
    
    setSteps(updatedSteps);
    setBlocks(updatedBlocks);
    onStepsChange(updatedSteps);
    onBlocksChange(updatedBlocks);
    
    // Removed toast notification
  };

  const handleDragStart = (dragStart: any) => {
    setStepBeingDragged(dragStart.draggableId);
  };

  const handleDragEnd = (result: any) => {
    setStepBeingDragged(null);
    if (!result.destination) {
      return;
    }

    const items = Array.from(localSteps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update the order property of each step
    const updatedSteps = items.map((step, index) => ({ ...step, order: index }));

    setSteps(updatedSteps);
    onStepsChange(updatedSteps);
  };

  return (
    <div className="space-y-4">
      {showAIGenerator && (
        <AIStepGenerator
          taskTitle={taskTitle}
          taskDescription={taskDescription}
          onStepsGenerated={handleGeneratedSteps}
          task={task}
        />
      )}

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Flow Steps</CardTitle>
          <Button variant="outline" size="sm" onClick={handleAddStep}>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <DragDropContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <Droppable droppableId="steps">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {localSteps.map((step, index) => (
                    <Draggable key={step.id} draggableId={step.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="flex items-center justify-between p-4 border-b last:border-b-0"
                        >
                          <div className="flex items-center">
                            <div {...provided.dragHandleProps} className="cursor-grab mr-2">
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <Badge className="mr-2">{index + 1}</Badge>
                            <span className="text-sm font-medium">{step.title}</span>
                          </div>
                          <div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedStep(step);
                                setIsEditing(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleStepDelete(step.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </CardContent>
      </Card>

      {isEditing && selectedStep && (
        <StepEditor
          open={isEditing}
          onClose={() => {
            setIsEditing(false);
            setSelectedStep(null);
          }}
          step={selectedStep}
          onUpdate={(updates) => {
            handleStepUpdate(selectedStep.id, updates);
          }}
        />
      )}
    </div>
  );
}
