
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Workflow, MoveUp, MoveDown, Save } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Step {
  id: string;
  content: string;
}

interface ProcessBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProcessBuilder({ open, onOpenChange }: ProcessBuilderProps) {
  const [steps, setSteps] = useState<Step[]>(() => {
    const savedSteps = localStorage.getItem('inventoryProcessSteps');
    return savedSteps ? JSON.parse(savedSteps) : [];
  });
  const [newStep, setNewStep] = useState('');

  const addStep = () => {
    if (newStep.trim() === '') return;
    
    const newStepItem: Step = {
      id: Date.now().toString(),
      content: newStep.trim()
    };
    
    const updatedSteps = [...steps, newStepItem];
    setSteps(updatedSteps);
    localStorage.setItem('inventoryProcessSteps', JSON.stringify(updatedSteps));
    setNewStep('');
  };

  const removeStep = (id: string) => {
    const updatedSteps = steps.filter(step => step.id !== id);
    setSteps(updatedSteps);
    localStorage.setItem('inventoryProcessSteps', JSON.stringify(updatedSteps));
  };

  const moveStep = (id: string, direction: 'up' | 'down') => {
    const index = steps.findIndex(step => step.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === steps.length - 1)
    ) {
      return;
    }

    const updatedSteps = [...steps];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap elements
    [updatedSteps[index], updatedSteps[newIndex]] = [updatedSteps[newIndex], updatedSteps[index]];
    
    setSteps(updatedSteps);
    localStorage.setItem('inventoryProcessSteps', JSON.stringify(updatedSteps));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addStep();
    }
  };

  const saveProcess = () => {
    localStorage.setItem('inventoryProcessSteps', JSON.stringify(steps));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg lg:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5" /> 
            My Amazon Inventory Process
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <p className="text-sm text-muted-foreground">
            Add the steps you follow to manage your inventory on Amazon. You can reorder them as needed.
          </p>
          
          <div className="flex gap-2">
            <Input 
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              placeholder="Add a new step in your process..."
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button 
              onClick={addStep}
              size="icon"
              variant="outline"
              disabled={newStep.trim() === ''}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {steps.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No steps added yet. Add your first step above.
              </div>
            ) : (
              steps.map((step, index) => (
                <Card key={step.id} className="p-3 flex items-center gap-2">
                  <div className="bg-muted rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-sm">{step.content}</p>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveStep(step.id, 'up')}
                      disabled={index === 0}
                    >
                      <MoveUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => moveStep(step.id, 'down')}
                      disabled={index === steps.length - 1}
                    >
                      <MoveDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => removeStep(step.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))
            )}
          </div>
          
          <div className="flex justify-end">
            <Button onClick={saveProcess} className="gap-2">
              <Save className="h-4 w-4" />
              Save Process
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
