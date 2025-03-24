
import React, { useState, useRef, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2, CircleDashed, Grip, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface WorkflowBlock {
  id: string;
  content: string;
  icon: string;
  completed: boolean;
  position?: {
    x: number;
    y: number;
  };
}

interface WorkflowBlocksProps {
  blocks: WorkflowBlock[];
  onDragEnd: (result: any) => void;
  onRemoveBlock: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onUpdatePosition: (id: string, position: { x: number, y: number }) => void;
  blockTypes?: string[];
  containerRef: React.RefObject<HTMLDivElement>;
  containerDimensions: { width: number, height: number };
}

export function WorkflowBlocks({ 
  blocks, 
  onDragEnd, 
  onRemoveBlock, 
  onToggleComplete,
  onUpdatePosition,
  containerRef,
  containerDimensions
}: WorkflowBlocksProps) {
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Handle mouse movement for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedBlockId && containerRef.current) {
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        
        // Calculate position relative to container with scroll offset
        let x = e.clientX - containerRect.left + container.scrollLeft - dragOffset.x;
        let y = e.clientY - containerRect.top + container.scrollTop - dragOffset.y;
        
        // Add bounds checking
        const blockWidth = 300;
        const blockHeight = 80;
        const maxX = containerDimensions.width - blockWidth;
        const maxY = containerDimensions.height - blockHeight;
        
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));
        
        setMousePosition({ x, y });
      }
    };

    const handleMouseUp = () => {
      if (draggedBlockId) {
        onUpdatePosition(draggedBlockId, mousePosition);
        setDraggedBlockId(null);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedBlockId, containerRef, dragOffset, mousePosition, onUpdatePosition, containerDimensions]);

  const startDragging = (blockId: string, e: React.MouseEvent) => {
    const blockElement = blockRefs.current[blockId];
    if (blockElement && containerRef.current) {
      const blockRect = blockElement.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate offset within the block
      const offsetX = e.clientX - blockRect.left;
      const offsetY = e.clientY - blockRect.top;
      
      setDragOffset({ x: offsetX, y: offsetY });
      setDraggedBlockId(blockId);
      
      // Initialize mouse position to current block position
      const block = blocks.find(b => b.id === blockId);
      if (block && block.position) {
        setMousePosition(block.position);
      }
    }
  };

  const renderConnections = () => {
    if (blocks.length < 2) return null;
    
    return blocks.map((block, index) => {
      if (index === blocks.length - 1) return null;
      
      const sourceBlock = block;
      const targetBlock = blocks[index + 1];
      
      if (!sourceBlock.position || !targetBlock.position) return null;
      
      // Calculate connection points
      const sourceX = sourceBlock.position.x + 150; // middle-right of source block
      const sourceY = sourceBlock.position.y + 35; // middle of source block
      const targetX = targetBlock.position.x; // middle-left of target block
      const targetY = targetBlock.position.y + 35; // middle of target block
      
      // Calculate control points for curve
      const dx = Math.abs(targetX - sourceX) * 0.5;
      
      // Draw an SVG path
      const path = `M${sourceX},${sourceY} C${sourceX + dx},${sourceY} ${targetX - dx},${targetY} ${targetX},${targetY}`;
      
      return (
        <path
          key={`connection-${sourceBlock.id}-${targetBlock.id}`}
          d={path}
          stroke="#3b82f6"
          strokeWidth="2"
          fill="none"
          markerEnd="url(#arrow)"
        />
      );
    });
  };

  return (
    <>
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="4"
            markerHeight="4"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
          </marker>
        </defs>
        {renderConnections()}
      </svg>
      
      {blocks.map((block, index) => (
        <div
          key={block.id}
          ref={(el) => (blockRefs.current[block.id] = el)}
          className={`absolute bg-white dark:bg-slate-800 border ${
            block.completed ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700'
          } rounded-md p-4 shadow-sm w-[300px] z-10 cursor-move ${
            draggedBlockId === block.id ? 'shadow-lg' : ''
          }`}
          style={{
            left: draggedBlockId === block.id ? mousePosition.x : block.position?.x,
            top: draggedBlockId === block.id ? mousePosition.y : block.position?.y,
          }}
          onMouseDown={(e) => {
            // Only start dragging if the click is not on a button
            if (!(e.target as HTMLElement).closest('button')) {
              startDragging(block.id, e);
            }
          }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-slate-400" />
              <Badge variant="blue" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                {index + 1}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(block.id);
                }}
                className={`h-6 w-6 rounded-full ${
                  block.completed ? 'text-green-600' : 'text-muted-foreground'
                }`}
              >
                {block.completed ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <CircleDashed className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveBlock(block.id);
                }}
                className="h-6 w-6 text-destructive hover:text-destructive/90"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="ml-6">
            <span className={block.completed ? 'line-through text-muted-foreground' : ''}>
              {block.content}
            </span>
          </div>
        </div>
      ))}
    </>
  );
}
