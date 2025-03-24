
import React from 'react';
import { WorkflowBlocks, WorkflowBlock } from './WorkflowBlocks';

interface WorkflowCanvasProps {
  blocks: WorkflowBlock[];
  onDragEnd: (result: any) => void;
  onRemoveBlock: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onUpdatePosition: (id: string, position: { x: number, y: number }) => void;
  containerRef: React.RefObject<HTMLDivElement>;
  containerDimensions: { width: number, height: number };
  categoryColors: Record<string, string>;
}

export function WorkflowCanvas({
  blocks,
  onDragEnd,
  onRemoveBlock,
  onToggleComplete,
  onUpdatePosition,
  containerRef,
  containerDimensions,
  categoryColors
}: WorkflowCanvasProps) {
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
          className="workflow-connection"
        />
      );
    });
  };

  return (
    <>
      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
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
      
      <WorkflowBlocks 
        blocks={blocks}
        onDragEnd={onDragEnd}
        onRemoveBlock={onRemoveBlock}
        onToggleComplete={onToggleComplete}
        onUpdatePosition={onUpdatePosition}
        containerRef={containerRef}
        containerDimensions={containerDimensions}
        categoryColors={categoryColors}
      />
    </>
  );
}
