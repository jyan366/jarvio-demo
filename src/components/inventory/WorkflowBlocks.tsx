
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
}

export function WorkflowBlocks({ 
  blocks, 
  onDragEnd, 
  onRemoveBlock, 
  onToggleComplete,
  onUpdatePosition,
  containerRef
}: WorkflowBlocksProps) {
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedBlockId && containerRef.current) {
        const container = containerRef.current;
        const containerRect = container.getBoundingClientRect();
        
        const x = e.clientX - containerRect.left + container.scrollLeft;
        const y = e.clientY - containerRect.top + container.scrollTop;
        
        setMousePosition({ x, y });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [draggedBlockId, containerRef]);

  const startDragging = (blockId: string) => {
    setDraggedBlockId(blockId);
  };

  const stopDragging = () => {
    if (draggedBlockId) {
      const block = blocks.find(b => b.id === draggedBlockId);
      if (block) {
        onUpdatePosition(draggedBlockId, mousePosition);
      }
    }
    setDraggedBlockId(null);
  };

  const renderConnections = () => {
    if (blocks.length < 2) return null;
    
    return blocks.map((block, index) => {
      if (index === blocks.length - 1) return null;
      
      const sourceBlock = block;
      const targetBlock = blocks[index + 1];
      
      if (!sourceBlock.position || !targetBlock.position) return null;
      
      const sourcePos = sourceBlock.position;
      const targetPos = targetBlock.position;
      
      // Calculate connection points
      const sourceX = sourcePos.x + 150; // middle-right of source block
      const sourceY = sourcePos.y + 35; // middle of source block
      const targetX = targetPos.x; // middle-left of target block
      const targetY = targetPos.y + 35; // middle of target block
      
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
          } rounded-md p-4 shadow-sm w-[300px] z-10 cursor-move`}
          style={{
            left: block.position?.x || index * 50,
            top: block.position?.y || index * 100,
            transform: draggedBlockId === block.id ? 'translate(-50%, -50%)' : 'none',
          }}
          onMouseDown={() => startDragging(block.id)}
          onMouseUp={stopDragging}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-slate-400" />
              <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
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
