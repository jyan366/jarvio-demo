
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card } from "@/components/ui/card";
import { 
  PackageSearch, 
  ChartBar, 
  FileText, 
  Table, 
  Truck, 
  Factory, 
  Package, 
  Workflow, 
  PlusCircle, 
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface WorkflowBlock {
  id: string;
  content: string;
  icon: string;
  completed?: boolean;
}

interface WorkflowBlocksProps {
  blocks: WorkflowBlock[];
  onDragEnd: (result: any) => void;
  onAddBlock: (blockType: string) => void;
  onRemoveBlock: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

const blockIcons: Record<string, React.ReactNode> = {
  "check-stock-levels": <PackageSearch className="h-5 w-5" />,
  "check-sales": <ChartBar className="h-5 w-5" />,
  "create-asin-restock-report": <FileText className="h-5 w-5" />,
  "convert-restock-report-to-case-level-sheet": <Table className="h-5 w-5" />,
  "send-to-my-warehouse": <Truck className="h-5 w-5" />,
  "send-to-my-prep-centre": <Factory className="h-5 w-5" />,
  "create-shipment": <Package className="h-5 w-5" />,
  "default": <Workflow className="h-5 w-5" />
};

const predefinedBlocks = [
  "Check stock levels",
  "Check sales",
  "Create ASIN restock report",
  "Convert restock report to case level sheet",
  "Send to my warehouse",
  "Send to my prep centre",
  "Create shipment"
];

export function WorkflowBlocks({ blocks, onDragEnd, onAddBlock, onRemoveBlock, onToggleComplete }: WorkflowBlocksProps) {
  const getIconForBlock = (block: WorkflowBlock) => {
    const iconKey = block.content.toLowerCase().replace(/\s+/g, '-');
    return blockIcons[iconKey] || blockIcons.default;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-900/20 rounded-md border">
        <div className="w-full mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Add blocks to your workflow:</h3>
        </div>
        {predefinedBlocks.map((block) => (
          <Button
            key={block}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-white dark:bg-slate-800"
            onClick={() => onAddBlock(block)}
          >
            {getIconForBlock({ id: '', content: block, icon: '' })}
            <span className="text-xs">{block}</span>
            <PlusCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
          </Button>
        ))}
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="workflow-blocks">
          {(provided) => (
            <div 
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-0"
            >
              {blocks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-md">
                  <Workflow className="h-8 w-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">No workflow blocks added yet.</p>
                  <p className="text-xs mt-1">Add your first block from the options above to begin building your workflow.</p>
                </div>
              ) : (
                blocks.map((block, index) => (
                  <Draggable key={block.id} draggableId={block.id} index={index}>
                    {(provided, snapshot) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="relative mb-4"
                      >
                        <Card 
                          className={`p-4 flex items-center gap-3 border-l-4 ${
                            snapshot.isDragging ? "shadow-lg" : ""
                          } ${
                            block.completed 
                              ? "border-l-green-500 bg-green-50/50 dark:bg-green-950/10" 
                              : "border-l-blue-500"
                          }`}
                        >
                          <button
                            onClick={() => onToggleComplete(block.id)}
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              block.completed 
                                ? "text-green-500 bg-green-100 dark:bg-green-900/20" 
                                : "text-blue-500 bg-blue-100 dark:bg-blue-900/20"
                            }`}
                          >
                            {getIconForBlock(block)}
                          </button>
                          
                          <div 
                            {...provided.dragHandleProps}
                            className={`flex-1 text-sm cursor-move ${block.completed ? "line-through text-muted-foreground" : ""}`}
                          >
                            {block.content}
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
                            onClick={() => onRemoveBlock(block.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </Card>
                        
                        {index < blocks.length - 1 && (
                          <div className="absolute left-[20px] h-4 w-0 border-l-2 border-dashed border-slate-300 -bottom-4 z-0"></div>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
