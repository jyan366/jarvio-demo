
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Workflow, Save } from "lucide-react";
import { toast } from "sonner";
import { WorkflowBlocks, WorkflowBlock } from './WorkflowBlocks';

interface ProcessBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  blockTypes?: string[];
  saveKey?: string;
}

export function ProcessBuilder({ 
  open, 
  onOpenChange, 
  title = "My Workflow", 
  description = "Build your workflow by dragging blocks and connecting them in sequence.",
  blockTypes = [
    "Inventory Check",
    "Order Processing",
    "Quality Control",
    "Shipment Preparation",
    "Customer Communication",
    "Returns Processing"
  ],
  saveKey = 'inventoryProcessSteps'
}: ProcessBuilderProps) {
  const [blocks, setBlocks] = useState<WorkflowBlock[]>(() => {
    const savedBlocks = localStorage.getItem(saveKey);
    return savedBlocks ? JSON.parse(savedBlocks) : [];
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setBlocks(items);
    localStorage.setItem(saveKey, JSON.stringify(items));
  };

  const handleAddBlock = (blockType: string) => {
    const newBlock: WorkflowBlock = {
      id: Date.now().toString(),
      content: blockType,
      icon: blockType.toLowerCase().replace(/\s+/g, '-'),
      completed: false
    };
    
    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    localStorage.setItem(saveKey, JSON.stringify(updatedBlocks));
    toast(`Added "${blockType}" to your workflow`);
  };

  const handleRemoveBlock = (id: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== id);
    setBlocks(updatedBlocks);
    localStorage.setItem(saveKey, JSON.stringify(updatedBlocks));
  };

  const toggleComplete = (id: string) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, completed: !block.completed } : block
    );
    setBlocks(updatedBlocks);
    localStorage.setItem(saveKey, JSON.stringify(updatedBlocks));
  };

  const saveProcess = () => {
    localStorage.setItem(saveKey, JSON.stringify(blocks));
    toast("Workflow saved successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Workflow className="h-5 w-5 text-blue-500" /> 
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <WorkflowBlocks 
            blocks={blocks}
            onDragEnd={handleDragEnd}
            onAddBlock={handleAddBlock}
            onRemoveBlock={handleRemoveBlock}
            onToggleComplete={toggleComplete}
            blockTypes={blockTypes}
          />
          
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
