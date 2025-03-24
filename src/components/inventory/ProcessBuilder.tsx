
import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Workflow, Save, Plus, Package, CircleDollarSign, AlertCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { WorkflowBlock } from './WorkflowBlocks';
import { Badge } from "@/components/ui/badge";
import { WorkflowCanvas } from './WorkflowCanvas';

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

  const [blocks, setBlocks] = useState<WorkflowBlock[]>(() => {
    const savedBlocks = localStorage.getItem(effectiveSaveKey);
    return savedBlocks ? JSON.parse(savedBlocks) : [];
  });
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
    localStorage.setItem(effectiveSaveKey, JSON.stringify(items));
  };

  const handleAddBlock = (blockType: any) => {
    if (!containerRef.current) return;
    
    // Calculate position for the new block
    const centerX = containerDimensions.width / 2 - 150; // Half of block width
    const startY = 100;
    const blockSpacing = 120; // Vertical spacing between blocks
    
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
      blockId: blockType.id,
      content: blockType.content,
      category: blockType.category,
      icon: blockType.icon,
      completed: false,
      position: {
        x: centerX,
        y: newY
      }
    };
    
    const updatedBlocks = [...blocks, newBlock];
    setBlocks(updatedBlocks);
    localStorage.setItem(effectiveSaveKey, JSON.stringify(updatedBlocks));
    toast(`Added "${blockType.content}" to your workflow`);
  };

  const handleRemoveBlock = (id: string) => {
    const updatedBlocks = blocks.filter(block => block.id !== id);
    setBlocks(updatedBlocks);
    localStorage.setItem(effectiveSaveKey, JSON.stringify(updatedBlocks));
  };

  const toggleComplete = (id: string) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, completed: !block.completed } : block
    );
    setBlocks(updatedBlocks);
    localStorage.setItem(effectiveSaveKey, JSON.stringify(updatedBlocks));
  };

  const updateBlockPosition = (id: string, position: { x: number, y: number }) => {
    const updatedBlocks = blocks.map(block => 
      block.id === id ? { ...block, position } : block
    );
    setBlocks(updatedBlocks);
    localStorage.setItem(effectiveSaveKey, JSON.stringify(updatedBlocks));
  };

  const saveProcess = () => {
    localStorage.setItem(effectiveSaveKey, JSON.stringify(blocks));
    toast("Workflow saved successfully");
    onOpenChange(false);
  };

  // Get all unique categories
  const categories = [...new Set(effectiveBlockTypes.map(block => block.category))];

  // Filter blocks by selected category
  const filteredBlocks = selectedCategory 
    ? effectiveBlockTypes.filter(block => block.category === selectedCategory)
    : effectiveBlockTypes;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl xl:max-w-5xl h-[80vh] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {pageIcon}
            <span>{effectiveTitle}</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {effectiveDescription}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden mt-4">
          <div className="flex-1 flex flex-col h-full">
            <div className="bg-slate-50 dark:bg-slate-900 border rounded-md mb-4 p-4">
              <h3 className="text-sm font-medium mb-2">Filter by category:</h3>
              <div className="flex flex-wrap gap-2">
                <Badge 
                  variant="outline" 
                  className={`cursor-pointer ${selectedCategory === null ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Categories
                </Badge>
                {categories.map((category) => (
                  <Badge 
                    key={category}
                    variant="outline" 
                    className={`cursor-pointer ${CATEGORY_COLORS[category]} ${selectedCategory === category ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div 
              ref={containerRef}
              className="flex-1 relative overflow-auto bg-slate-50 dark:bg-slate-900 border rounded-md min-h-[400px] workflow-grid-bg"
            >
              <WorkflowCanvas 
                blocks={blocks}
                onDragEnd={handleDragEnd}
                onRemoveBlock={handleRemoveBlock}
                onToggleComplete={toggleComplete}
                onUpdatePosition={updateBlockPosition}
                containerRef={containerRef}
                containerDimensions={containerDimensions}
                categoryColors={CATEGORY_COLORS}
              />
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">
                Available {pageType === 'ads' ? 'PPC' : 'Inventory'} Workflow Blocks:
              </h3>
              <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto p-2 bg-white dark:bg-slate-800 border rounded-md">
                {filteredBlocks.map((blockType) => (
                  <Badge 
                    key={blockType.id}
                    variant="outline" 
                    className={`flex items-center gap-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 ${CATEGORY_COLORS[blockType.category]}`}
                    onClick={() => handleAddBlock(blockType)}
                  >
                    <Plus className="h-3 w-3" />
                    {blockType.content}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
          
        <DialogFooter className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={saveProcess} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Save className="h-4 w-4" />
            Save Workflow
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
