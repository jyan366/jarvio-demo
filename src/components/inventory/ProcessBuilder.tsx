
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Workflow, Save, Plus, Trash2, Package, Clock, ChevronUp, ChevronDown, Play } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Pre-defined inventory process steps
const INVENTORY_STEPS = [
  { id: "check-stock", content: "Check stock levels" },
  { id: "check-sales", content: "Check sales" },
  { id: "create-restock", content: "Create ASIN restock report" },
  { id: "convert-report", content: "Convert restock report to case level sheet" },
  { id: "email-warehouse", content: "Send email to warehouse" },
  { id: "email-prep", content: "Send email to prep centre" },
  { id: "create-shipment", content: "Create shipment in Amazon" }
];

export interface ProcessStep {
  id: string;
  content: string;
  completed: boolean;
}

interface ProcessBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageType?: 'inventory' | 'ads';
}

export function ProcessBuilder({ 
  open, 
  onOpenChange, 
  pageType = 'inventory'
}: ProcessBuilderProps) {
  const [selectedSteps, setSelectedSteps] = useState<ProcessStep[]>(() => {
    const savedSteps = localStorage.getItem('inventoryProcessSteps');
    return savedSteps ? JSON.parse(savedSteps) : [];
  });
  
  const [autoRun, setAutoRun] = useState<boolean>(() => {
    const savedAutoRun = localStorage.getItem('inventoryProcessAutoRun');
    return savedAutoRun ? JSON.parse(savedAutoRun) : false;
  });

  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const isStepSelected = (stepId: string) => {
    return selectedSteps.some(step => step.id === stepId);
  };

  const toggleStep = (step: { id: string; content: string }) => {
    if (isStepSelected(step.id)) {
      setSelectedSteps(selectedSteps.filter(s => s.id !== step.id));
    } else {
      setSelectedSteps([...selectedSteps, { id: step.id, content: step.content, completed: false }]);
    }
  };

  const moveStepUp = (index: number) => {
    if (index === 0) return;
    const newSteps = [...selectedSteps];
    [newSteps[index-1], newSteps[index]] = [newSteps[index], newSteps[index-1]];
    setSelectedSteps(newSteps);
  };

  const moveStepDown = (index: number) => {
    if (index === selectedSteps.length - 1) return;
    const newSteps = [...selectedSteps];
    [newSteps[index], newSteps[index+1]] = [newSteps[index+1], newSteps[index]];
    setSelectedSteps(newSteps);
  };

  const toggleStepCompletion = (stepId: string) => {
    setSelectedSteps(selectedSteps.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ));
  };

  const saveWorkflow = () => {
    localStorage.setItem('inventoryProcessSteps', JSON.stringify(selectedSteps));
    localStorage.setItem('inventoryProcessAutoRun', JSON.stringify(autoRun));
    toast.success("Inventory process saved successfully");
    onOpenChange(false);
  };

  const runProcess = async () => {
    if (selectedSteps.length === 0) {
      toast.error("Please select at least one step to run the process");
      return;
    }

    setIsRunning(true);
    setCurrentStepIndex(0);
    
    // Reset all steps to not completed
    setSelectedSteps(selectedSteps.map(step => ({ ...step, completed: false })));
    
    // Mock running through each step with delays
    for (let i = 0; i < selectedSteps.length; i++) {
      setCurrentStepIndex(i);
      
      // Show toast for current step
      toast.info(`Running step ${i + 1}: ${selectedSteps[i].content}`);
      
      // Add a delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mark step as completed
      setSelectedSteps(prevSteps => {
        const newSteps = [...prevSteps];
        newSteps[i] = { ...newSteps[i], completed: true };
        return newSteps;
      });
    }
    
    // Process complete
    setCurrentStepIndex(-1);
    setIsRunning(false);
    toast.success("Restock Process Complete!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Package className="h-5 w-5 text-blue-500" />
            <span>Inventory Management Process</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a custom inventory management workflow by selecting the steps needed for your process.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 my-4 overflow-y-auto max-h-[50vh] p-1">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Available Steps:</h3>
            <div className="space-y-2">
              {INVENTORY_STEPS.map((step) => (
                <div 
                  key={step.id}
                  className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer
                            hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors
                            ${isStepSelected(step.id) ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                  onClick={() => toggleStep(step)}
                >
                  <Checkbox 
                    checked={isStepSelected(step.id)} 
                    onCheckedChange={() => toggleStep(step)}
                  />
                  <span>{step.content}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedSteps.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Your Process:</h3>
              <div className="space-y-2">
                {selectedSteps.map((step, index) => (
                  <div 
                    key={step.id}
                    className={`flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border rounded-md
                              ${step.completed ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 
                                currentStepIndex === index ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' : 
                                'border-slate-200 dark:border-slate-700'}`}
                  >
                    <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                      {index + 1}
                    </div>
                    <span className={step.completed ? 'line-through text-muted-foreground' : ''}>
                      {step.content}
                    </span>
                    <div className="ml-auto flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveStepUp(index)}
                        disabled={index === 0 || isRunning}
                        className="h-7 w-7"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => moveStepDown(index)}
                        disabled={index === selectedSteps.length - 1 || isRunning}
                        className="h-7 w-7"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleStepCompletion(step.id)}
                        disabled={isRunning}
                        className="h-7 w-7"
                      >
                        <Checkbox 
                          checked={step.completed}
                          onCheckedChange={() => toggleStepCompletion(step.id)}
                          disabled={isRunning}
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStep(step);
                        }}
                        disabled={isRunning}
                        className="h-7 w-7 text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 pt-4 border-t">
            <Switch 
              id="auto-run" 
              checked={autoRun}
              onCheckedChange={setAutoRun}
              disabled={isRunning}
            />
            <Label htmlFor="auto-run" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Automatically run every 30 days
            </Label>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isRunning}
          >
            Cancel
          </Button>
          <Button 
            onClick={runProcess} 
            className="gap-2 bg-green-600 hover:bg-green-700"
            disabled={selectedSteps.length === 0 || isRunning}
          >
            <Play className="h-4 w-4" />
            Run Process
          </Button>
          <Button 
            onClick={saveWorkflow} 
            className="gap-2 bg-blue-600 hover:bg-blue-700"
            disabled={isRunning}
          >
            <Save className="h-4 w-4" />
            Save Process
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
