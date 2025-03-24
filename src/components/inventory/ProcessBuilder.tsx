
import React, { useState, useRef, useEffect } from 'react';
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
  title = "PPC Campaign Template", 
  description = "Build your PPC campaign workflow by adding steps that represent your optimization process.",
  blockTypes = [
    "Review Campaign Performance",
    "Adjust Keyword Bids",
    "Add Negative Keywords",
    "Analyze Search Terms",
    "Test New Ad Copy",
    "Scale Top Performers",
    "Budget Reallocation",
    "Generate Performance Report",
    "Competitor Analysis",
    "Seasonal Adjustments",
    "ACOS Optimization"
  ],
  saveKey = 'ppcProcessSteps'
}: ProcessBuilderProps) {
  const [blocks, setBlocks] = useState<WorkflowBlock[]>(() => {
    const savedBlocks = localStorage.getItem(saveKey);
    return savedBlocks ? JSON.parse(savedBlocks) : [];
  });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  // Update container dimensions when dialog opens
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setContainerDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    if (open) {
      // Small delay to ensure the container is rendered
      setTimeout(updateDimensions, 100);
      window.addEventListener('resize', updateDimensions);
    }

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [open]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setBlocks(items);
    localStorage.setItem(saveKey, JSON.stringify(items));
  };

  const handleAddBlock = (blockType: string) => {
    if (!containerRef.current) return;
    
    // Define starting position for the blocks to be more centered
    const startX = 100;
    const startY = 100;
    const blockSpacing = 130; // Vertical spacing between blocks
    
    // Calculate position for the new block
    let newY = startY;
    
    if (blocks.length > 0) {
      // Place the new block below the last one
      const lastBlock = blocks[blocks.length - 1];
      newY = (lastBlock.position?.y || 0) + blockSpacing;
    }
    
    // Ensure the block stays within container bounds
    const maxY = containerDimensions.height - 100; // 100px buffer
    if (newY > maxY) {
      newY = maxY;
    }
    
    const newBlock: WorkflowBlock = {
      id: Date.now().toString(),
      content: blockType,
      icon: blockType.toLowerCase().replace(/\s+/g, '-'),
      completed: false,
      position: {
        x: startX,
        y: newY
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
    // Ensure the block stays within container bounds
    if (containerRef.current) {
      const maxX = containerDimensions.width - 320; // 300px width plus buffer
      const maxY = containerDimensions.height - 100; // 100px buffer
      
      position.x = Math.max(10, Math.min(position.x, maxX));
      position.y = Math.max(10, Math.min(position.y, maxY));
    }
    
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
              className="flex-1 relative overflow-auto bg-slate-50 dark:bg-slate-900 border rounded-md min-h-[400px] grid-bg"
            >
              <WorkflowBlocks 
                blocks={blocks}
                onDragEnd={handleDragEnd}
                onRemoveBlock={handleRemoveBlock}
                onToggleComplete={toggleComplete}
                onUpdatePosition={updateBlockPosition}
                containerRef={containerRef}
                containerDimensions={containerDimensions}
              />
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Available PPC Workflow Blocks</h3>
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
