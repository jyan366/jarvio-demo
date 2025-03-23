
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash2, Workflow, MoveUp, MoveDown, Save, CheckCircle, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface Step {
  id: string;
  content: string;
  completed?: boolean;
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
      content: newStep.trim(),
      completed: false
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

  const toggleComplete = (id: string) => {
    const updatedSteps = steps.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    );
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
    toast("Process saved successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Workflow className="h-5 w-5 text-blue-500" /> 
            <span>My Amazon Inventory Workflow</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <p className="text-sm text-muted-foreground">
            Define your inventory management workflow on Amazon with sequential steps. 
            Each step represents an action in your process.
          </p>
          
          <div className="flex gap-2">
            <Input 
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              placeholder="Add a new workflow step..."
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button 
              onClick={addStep}
              variant="outline"
              className="gap-1"
              disabled={newStep.trim() === ''}
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add Step</span>
            </Button>
          </div>
          
          <div className="border rounded-md bg-slate-50/50 dark:bg-slate-900/20 p-6">
            {steps.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-md">
                <Workflow className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No workflow steps defined yet.</p>
                <p className="text-xs mt-1">Add your first step above to begin building your process.</p>
              </div>
            ) : (
              <div className="space-y-0">
                {steps.map((step, index) => (
                  <div key={step.id} className="relative">
                    <Card 
                      key={step.id} 
                      className={`p-4 flex items-center gap-3 mb-1 border-l-4 ${
                        step.completed 
                          ? "border-l-green-500 bg-green-50/50 dark:bg-green-950/10" 
                          : "border-l-blue-500"
                      }`}
                    >
                      <button
                        onClick={() => toggleComplete(step.id)}
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? "text-green-500 bg-green-100 dark:bg-green-900/20" 
                            : "text-blue-500 bg-blue-100 dark:bg-blue-900/20"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-semibold">{index + 1}</span>
                        )}
                      </button>
                      
                      <p className={`flex-1 text-sm ${step.completed ? "line-through text-muted-foreground" : ""}`}>
                        {step.content}
                      </p>
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          onClick={() => moveStep(step.id, 'up')}
                          disabled={index === 0}
                        >
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                          onClick={() => moveStep(step.id, 'down')}
                          disabled={index === steps.length - 1}
                        >
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                          onClick={() => removeStep(step.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                    
                    {index < steps.length - 1 && (
                      <div className="absolute left-4 h-4 w-0 border-l-2 border-dashed border-slate-300 ml-3 -mb-2 z-0"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={saveProcess} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Save className="h-4 w-4" />
              Save Workflow
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
