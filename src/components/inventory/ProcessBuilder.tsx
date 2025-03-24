
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Workflow, Save, Plus } from "lucide-react";
import { toast } from "sonner";
import { WorkflowBlocks, WorkflowBlock } from './WorkflowBlocks';
import { Badge } from "@/components/ui/badge";

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
  
  const containerRef = useRef<HTMLDivElement>(null);

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
      completed: false,
      position: {
        x: blocks.length ? (blocks[blocks.length-1].position?.x || 0) + 50 : 50,
        y: blocks.length ? (blocks[blocks.length-1].position?.y || 0) + 100 : 100
      }
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

  const updateBlockPosition = (id: string, position: { x: number, y: number }) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, position } : block
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
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-[80vh] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Workflow className="h-5 w-5 text-blue-500" /> 
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden mt-4">
          <div className="flex-1 flex flex-col h-full">
            <div 
              ref={containerRef}
              className="flex-1 relative overflow-auto bg-slate-50 dark:bg-slate-900 border rounded-md min-h-[300px] grid-bg"
            >
              <WorkflowBlocks 
                blocks={blocks}
                onDragEnd={handleDragEnd}
                onRemoveBlock={handleRemoveBlock}
                onToggleComplete={toggleComplete}
                onUpdatePosition={updateBlockPosition}
                containerRef={containerRef}
              />
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Available Blocks</h3>
              <div className="flex flex-wrap gap-2">
                {blockTypes.map((blockType) => (
                  <Badge 
                    key={blockType}
                    variant="outline" 
                    className="flex items-center gap-1 cursor-pointer bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700"
                    onClick={() => handleAddBlock(blockType)}
                  >
                    <Plus className="h-3 w-3" />
                    {blockType}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
          
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={saveProcess} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4" />
            Save Workflow
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
