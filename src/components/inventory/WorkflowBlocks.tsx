
import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2, PlusCircle, CircleDashed } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface WorkflowBlock {
  id: string;
  content: string;
  icon: string;
  completed: boolean;
}

interface WorkflowBlocksProps {
  blocks: WorkflowBlock[];
  onDragEnd: (result: any) => void;
  onAddBlock: (blockType: string) => void;
  onRemoveBlock: (id: string) => void;
  onToggleComplete: (id: string) => void;
  blockTypes?: string[];
}

export function WorkflowBlocks({ 
  blocks, 
  onDragEnd, 
  onAddBlock, 
  onRemoveBlock, 
  onToggleComplete,
  blockTypes = [
    "Inventory Check",
    "Order Processing",
    "Quality Control",
    "Shipment Preparation",
    "Customer Communication",
    "Returns Processing"
  ]
}: WorkflowBlocksProps) {
  return (
    <div className="space-y-4">
      <div className="border rounded-md min-h-[200px] p-4 bg-slate-50 dark:bg-slate-900">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="workflow-blocks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {blocks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[180px] text-center text-muted-foreground">
                    <p>Drag and drop blocks to build your workflow</p>
                    <p className="text-sm mt-2">Start by adding a block from below</p>
                  </div>
                ) : (
                  blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`bg-white dark:bg-slate-800 border rounded-md p-3 shadow-sm ${
                            block.completed ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onToggleComplete(block.id)}
                                className={`h-8 w-8 rounded-full ${
                                  block.completed ? 'text-green-600' : 'text-muted-foreground'
                                }`}
                              >
                                {block.completed ? (
                                  <CheckCircle2 className="h-5 w-5" />
                                ) : (
                                  <CircleDashed className="h-5 w-5" />
                                )}
                              </Button>
                              <span className={block.completed ? 'line-through text-muted-foreground' : ''}>
                                {block.content}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onRemoveBlock(block.id)}
                              className="h-8 w-8 text-destructive hover:text-destructive/90"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="add-blocks">
          <AccordionTrigger className="text-sm">
            Available Blocks
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2">
              {blockTypes.map((blockType) => (
                <Button
                  key={blockType}
                  variant="outline"
                  size="sm"
                  onClick={() => onAddBlock(blockType)}
                  className="justify-start text-sm h-auto py-2"
                >
                  <PlusCircle className="h-3 w-3 mr-2" />
                  {blockType}
                </Button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
