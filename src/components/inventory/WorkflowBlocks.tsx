
import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle2, CircleDashed, GripVertical, CircleDot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from 'lucide-react';

export interface WorkflowBlock {
  id: string;
  blockId?: string;
  content: string;
  category?: string;
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
  containerRef: React.RefObject<HTMLDivElement>;
  containerDimensions: { width: number, height: number };
  categoryColors: Record<string, string>;
}

export function WorkflowBlocks({ 
  blocks, 
  onDragEnd, 
  onRemoveBlock, 
  onToggleComplete,
  onUpdatePosition,
  containerRef,
  containerDimensions,
  categoryColors
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

  // Dynamic icon rendering from lucide-react
  const renderIcon = (iconName: string) => {
    // Convert kebab-case to PascalCase for the icon name
    const pascalCaseIconName = iconName
      .split('-')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
    
    // Access the icon component safely using indexing with type assertion
    const IconComponent = (LucideIcons as any)[pascalCaseIconName] || LucideIcons.CircleDot;
    
    return <IconComponent className="h-4 w-4" />;
  };

  return (
    <>
      {blocks.map((block, index) => {
        // Get category-specific color classes or default to a standard color
        const categoryColorClass = block.category && categoryColors[block.category] 
          ? categoryColors[block.category] 
          : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';

        return (
          <div
            key={block.id}
            ref={(el) => (blockRefs.current[block.id] = el)}
            className={`absolute bg-white dark:bg-slate-800 border ${
              block.completed ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-700'
            } rounded-md p-4 shadow-sm w-[300px] z-10 cursor-move workflow-block ${
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
                {block.category && (
                  <Badge variant="outline" className={categoryColorClass}>
                    {block.category}
                  </Badge>
                )}
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
            <div className="ml-6 flex items-center gap-2">
              {renderIcon(block.icon)}
              <span className={block.completed ? 'line-through text-muted-foreground' : ''}>
                {block.content}
              </span>
            </div>
          </div>
        );
      })}
    </>
  );
}
