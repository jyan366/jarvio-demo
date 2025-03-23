
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Workflow, Save } from "lucide-react";
import { toast } from "sonner";
import { WorkflowBlocks, WorkflowBlock } from './WorkflowBlocks';

interface ProcessBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProcessBuilder({ open, onOpenChange }: ProcessBuilderProps) {
  const [blocks, setBlocks] = useState<WorkflowBlock[]>(() => {
    const savedBlocks = localStorage.getItem('inventoryProcessSteps');
    return savedBlocks ? JSON.parse(savedBlocks) : [];
  });

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setBlocks(items);
    localStorage.setItem('inventoryProcessSteps', JSON.stringify(items));
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
    localStorage.setItem('inventoryProcessSteps', JSON.stringify(updatedBlocks));
    toast(`Added "${blockType}" to your workflow`);
  };

  const handleRemoveBlock = (id: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== id);
    setBlocks(updatedBlocks);
    localStorage.setItem('inventoryProcessSteps', JSON.stringify(updatedBlocks));
  };

  const toggleComplete = (id: string) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, completed: !block.completed } : block
    );
    setBlocks(updatedBlocks);
    localStorage.setItem('inventoryProcessSteps', JSON.stringify(updatedBlocks));
  };

  const saveProcess = () => {
    localStorage.setItem('inventoryProcessSteps', JSON.stringify(blocks));
    toast("Workflow saved successfully");
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
            Build your inventory workflow by dragging blocks and connecting them in sequence.
            Each block represents a step in your Amazon inventory management process.
          </p>
          
          <div className="border rounded-md bg-slate-50/50 dark:bg-slate-900/20 p-6">
            {blocks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-md">
                <Workflow className="h-8 w-8 mx-auto mb-2 opacity-40" />
                <p className="text-sm">No workflow blocks added yet.</p>
                <p className="text-xs mt-1">Add your first block from the options above to begin building your workflow.</p>
              </div>
            ) : (
              <WorkflowBlocks 
                blocks={blocks}
                onDragEnd={handleDragEnd}
                onAddBlock={handleAddBlock}
                onRemoveBlock={handleRemoveBlock}
                onToggleComplete={toggleComplete}
              />
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
