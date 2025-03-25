
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Workflow, Save, Plus, Package, CircleDollarSign, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

// Predefined block types for each page type
const BLOCK_TYPES = {
  ads: [
    { id: "review-campaign", content: "Review Campaign Performance", category: "Analysis", icon: "trending-up" },
    { id: "adjust-bids", content: "Adjust Keyword Bids", category: "Optimization", icon: "circle-dollar-sign" },
    { id: "add-negative", content: "Add Negative Keywords", category: "Optimization", icon: "x-circle" },
    { id: "analyze-terms", content: "Analyze Search Terms", category: "Analysis", icon: "search" },
    { id: "test-ad-copy", content: "Test New Ad Copy", category: "Creative", icon: "pencil" },
    { id: "scale-performers", content: "Scale Top Performers", category: "Scaling", icon: "arrow-up-right" },
    { id: "budget-reallocation", content: "Budget Reallocation", category: "Optimization", icon: "circle-dollar-sign" },
    { id: "generate-report", content: "Generate Performance Report", category: "Analysis", icon: "file-text" },
    { id: "competitor-analysis", content: "Competitor Analysis", category: "Analysis", icon: "users" },
    { id: "seasonal-adjustments", content: "Seasonal Adjustments", category: "Optimization", icon: "calendar" },
    { id: "acos-optimization", content: "ACOS Optimization", category: "Optimization", icon: "percent" },
    { id: "create-campaign", content: "Create Sponsored Products Campaign", category: "Setup", icon: "plus-circle" },
    { id: "optimize-strategy", content: "Optimize Bid Strategy", category: "Optimization", icon: "target" },
    { id: "mine-search-terms", content: "Mine Search Terms", category: "Analysis", icon: "filter" },
    { id: "target-competitors", content: "Target Competitor ASINs", category: "Targeting", icon: "crosshair" },
    { id: "pause-underperforming", content: "Pause Underperforming Keywords", category: "Optimization", icon: "pause" },
    { id: "implement-dayparting", content: "Implement Dayparting Strategy", category: "Optimization", icon: "clock" }
  ],
  inventory: [
    { id: "check-stock", content: "Check Stock Levels", category: "Monitoring", icon: "package" },
    { id: "create-restock", content: "Create Restock Plan", category: "Planning", icon: "clipboard-list" },
    { id: "calculate-quantity", content: "Calculate Reorder Quantity", category: "Planning", icon: "calculator" },
    { id: "review-velocity", content: "Review Sales Velocity", category: "Analysis", icon: "trending-up" },
    { id: "forecast-demand", content: "Forecast Demand", category: "Analysis", icon: "bar-chart" },
    { id: "analyze-coverage", content: "Analyze Stock Coverage", category: "Analysis", icon: "percent" },
    { id: "generate-fba", content: "Generate FBA Shipment", category: "Fulfillment", icon: "truck" },
    { id: "monitor-inbound", content: "Monitor Inbound Shipments", category: "Monitoring", icon: "eye" },
    { id: "track-aging", content: "Track Inventory Aging", category: "Monitoring", icon: "calendar" },
    { id: "identify-slow", content: "Identify Slow-Moving Items", category: "Analysis", icon: "alert-circle" },
    { id: "calculate-fees", content: "Calculate Storage Fees", category: "Analysis", icon: "dollar-sign" },
    { id: "evaluate-supplier", content: "Evaluate Supplier Performance", category: "Analysis", icon: "award" },
    { id: "optimize-storage", content: "Optimize Storage Solutions", category: "Optimization", icon: "box" },
    { id: "check-competitor", content: "Check Competitor Stock Status", category: "Analysis", icon: "users" },
    { id: "prepare-reports", content: "Prepare Inventory Reports", category: "Analysis", icon: "file-text" }
  ]
};

// Save keys for each page type
const SAVE_KEYS = {
  ads: "amazonPPCTemplate",
  inventory: "inventoryProcessSteps"
};

// Page titles and descriptions
const PAGE_CONFIG = {
  ads: {
    title: "PPC Campaign Template",
    description: "Build your Amazon PPC campaign workflow by adding steps that represent your optimization process.",
    icon: <CircleDollarSign className="h-5 w-5 text-blue-500" />
  },
  inventory: {
    title: "Inventory Management Process",
    description: "Create a custom inventory management workflow by adding steps to optimize your stock levels and reordering process.",
    icon: <Package className="h-5 w-5 text-blue-500" />
  }
};

// Category colors for visual grouping
const CATEGORY_COLORS = {
  "Analysis": "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200",
  "Optimization": "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200",
  "Planning": "bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400 border-purple-200",
  "Monitoring": "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400 border-yellow-200",
  "Setup": "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 border-indigo-200",
  "Fulfillment": "bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200",
  "Creative": "bg-pink-50 text-pink-700 dark:bg-pink-900/20 dark:text-pink-400 border-pink-200",
  "Scaling": "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200",
  "Targeting": "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200"
};

export interface ProcessStep {
  id: string;
  blockId: string;
  content: string;
  category: string;
  icon: string;
  completed: boolean;
}

interface ProcessBuilderProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pageType?: 'ads' | 'inventory';
  title?: string;
  description?: string;
  customBlockTypes?: any[];
  saveKey?: string;
}

export function ProcessBuilder({ 
  open, 
  onOpenChange, 
  pageType = 'ads',
  title,
  description,
  customBlockTypes,
  saveKey
}: ProcessBuilderProps) {
  // Use provided values or determine from pageType
  const effectiveTitle = title || PAGE_CONFIG[pageType].title;
  const effectiveDescription = description || PAGE_CONFIG[pageType].description;
  const effectiveBlockTypes = customBlockTypes || BLOCK_TYPES[pageType];
  const effectiveSaveKey = saveKey || SAVE_KEYS[pageType];
  const pageIcon = PAGE_CONFIG[pageType].icon;

  const [steps, setSteps] = useState<ProcessStep[]>(() => {
    const savedSteps = localStorage.getItem(effectiveSaveKey);
    return savedSteps ? JSON.parse(savedSteps) : [];
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<any | null>(null);

  // Get all unique categories
  const categories = [...new Set(effectiveBlockTypes.map(block => block.category))];

  // Filter blocks by selected category
  const filteredBlocks = selectedCategory 
    ? effectiveBlockTypes.filter(block => block.category === selectedCategory)
    : effectiveBlockTypes;

  const handleAddStep = (blockType: any) => {
    const newStep: ProcessStep = {
      id: `step-${Date.now()}`,
      blockId: blockType.id,
      content: blockType.content,
      category: blockType.category,
      icon: blockType.icon,
      completed: false
    };
    
    setSteps([...steps, newStep]);
    toast.success(`Added "${blockType.content}" to your workflow`);
  };

  const handleRemoveStep = (stepId: string) => {
    setSteps(steps.filter(step => step.id !== stepId));
    toast.info("Step removed from workflow");
  };

  const moveStep = (dragIndex: number, hoverIndex: number) => {
    if (dragIndex === hoverIndex) return;
    
    const newSteps = [...steps];
    const draggedStep = newSteps[dragIndex];
    
    // Remove the dragged item
    newSteps.splice(dragIndex, 1);
    // Insert it at the new position
    newSteps.splice(hoverIndex, 0, draggedStep);
    
    setSteps(newSteps);
  };

  // Handle starting drag from available blocks area
  const handleDragStart = (e: React.DragEvent, block: any) => {
    setIsDragging(true);
    setDraggedBlock(block);
    e.dataTransfer.setData('blockId', block.id);
    e.dataTransfer.effectAllowed = 'copy';
  };
  
  // Handle dropping on the workflow area
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (!draggedBlock) return;
    
    // Add the dragged block as a new step
    const newStep: ProcessStep = {
      id: `step-${Date.now()}`,
      blockId: draggedBlock.id,
      content: draggedBlock.content,
      category: draggedBlock.category,
      icon: draggedBlock.icon,
      completed: false
    };
    
    setSteps([...steps, newStep]);
    setDraggedBlock(null);
    toast.success(`Added "${draggedBlock.content}" to your workflow`);
  };
  
  // Allow dropping on the workflow area
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedBlock(null);
  };

  const toggleStepComplete = (stepId: string) => {
    setSteps(steps.map(step => 
      step.id === stepId ? { ...step, completed: !step.completed } : step
    ));
  };

  const saveWorkflow = () => {
    localStorage.setItem(effectiveSaveKey, JSON.stringify(steps));
    toast.success("Workflow saved successfully");
    onOpenChange(false);
  };

  // Render a block from our block types
  const renderBlockItem = (block: any, isDraggable = true) => {
    const categoryColor = CATEGORY_COLORS[block.category] || '';
    
    return (
      <div 
        key={block.id}
        draggable={isDraggable}
        onDragStart={isDraggable ? (e) => handleDragStart(e, block) : undefined}
        className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer
                   hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors
                   ${categoryColor || 'border-slate-200 dark:border-slate-700'}`}
      >
        <Badge className={categoryColor}>
          {block.category}
        </Badge>
        <span>{block.content}</span>
        {!isDraggable && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleRemoveStep(block.id)}
            className="ml-auto h-7 w-7 text-destructive hover:text-destructive/90"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl max-h-[80vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-xl">
            {pageIcon}
            <span>{effectiveTitle}</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {effectiveDescription}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 pt-2 pb-0">
          <div className="bg-slate-50 dark:bg-slate-900 border rounded-md p-4 mb-4">
            <h3 className="text-sm font-medium mb-2">Filter by category:</h3>
            <div className="flex flex-wrap gap-2">
              <Badge 
                variant="outline" 
                className={`cursor-pointer ${selectedCategory === null ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Badge>
              {categories.map((category) => (
                <Badge 
                  key={category}
                  variant="outline" 
                  className={`cursor-pointer ${CATEGORY_COLORS[category]} ${selectedCategory === category ? 'ring-2 ring-offset-1 ring-blue-500' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <ResizablePanelGroup direction="horizontal" className="flex-1 overflow-hidden">
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="h-full flex flex-col p-6 pt-0 overflow-hidden">
              <h3 className="text-sm font-medium mb-2">Available Blocks:</h3>
              <div className="flex-1 overflow-y-auto p-2 bg-white dark:bg-slate-800 border rounded-md grid grid-cols-1 gap-2">
                {filteredBlocks.map((block) => renderBlockItem(block))}
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Drag blocks to the workflow area →
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle />
          
          <ResizablePanel defaultSize={70}>
            <div className="h-full flex flex-col p-6 pt-0 overflow-hidden">
              <h3 className="text-sm font-medium mb-2">Workflow Steps:</h3>
              <div 
                ref={canvasRef}
                className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900 border rounded-md grid grid-cols-1 gap-3"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                {steps.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                    <div className="mb-3">
                      <Plus className="h-12 w-12 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No steps added yet</h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      Drag blocks from the left panel to build your workflow, or click on a block to add it directly.
                    </p>
                  </div>
                ) : (
                  steps.map((step, index) => (
                    <div 
                      key={step.id}
                      className={`flex items-center gap-2 p-3 bg-white dark:bg-slate-800 border rounded-md
                                ${step.completed ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700'}`}
                    >
                      <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                        {index + 1}
                      </div>
                      <Badge className={CATEGORY_COLORS[step.category]}>
                        {step.category}
                      </Badge>
                      <span className={step.completed ? 'line-through text-muted-foreground' : ''}>
                        {step.content}
                      </span>
                      <div className="ml-auto flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleStepComplete(step.id)}
                          className="h-7 w-7"
                        >
                          <input 
                            type="checkbox" 
                            checked={step.completed}
                            onChange={() => {}}
                            className="h-4 w-4"
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveStep(step.id)}
                          className="h-7 w-7 text-destructive hover:text-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
          
        <DialogFooter className="p-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={saveWorkflow} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4" />
            Save Workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
