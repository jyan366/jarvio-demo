import React, { useState, useRef, useEffect } from 'react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { FlowNode } from './FlowNode';
import { CanvasToolbar } from './CanvasToolbar';
import { NodeConfigPanel } from './NodeConfigPanel';
import { v4 as uuidv4 } from 'uuid';

interface FlowCanvasProps {
  steps: FlowStep[];
  blocks: FlowBlock[];
  onStepsChange: (steps: FlowStep[]) => void;
  onBlocksChange: (blocks: FlowBlock[]) => void;
  availableBlockOptions?: Record<string, string[]>;
}

export function FlowCanvas({
  steps,
  blocks,
  onStepsChange,
  onBlocksChange,
  availableBlockOptions
}: FlowCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Initialize canvas positions for steps that don't have them
  useEffect(() => {
    const needsPositioning = steps.filter(step => !step.canvasPosition);
    if (needsPositioning.length > 0) {
      const updatedSteps = steps.map((step, index) => {
        if (!step.canvasPosition) {
          return {
            ...step,
            canvasPosition: {
              x: 100 + (index % 3) * 280, // Grid layout with 280px spacing
              y: 100 + Math.floor(index / 3) * 180 // Row spacing of 180px
            }
          };
        }
        return step;
      });
      onStepsChange(updatedSteps);
    }
  }, [steps, onStepsChange]);

  const handleNodeEdit = (stepId: string) => {
    setSelectedNode(stepId);
    setShowConfigPanel(true);
  };

  const handleNodeDelete = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    const updatedSteps = steps
      .filter(s => s.id !== stepId)
      .map((s, index) => ({ ...s, order: index }));
    const updatedBlocks = blocks.filter(b => b.id !== step?.blockId);
    
    onStepsChange(updatedSteps);
    onBlocksChange(updatedBlocks);
  };

  const handlePromptChange = (stepId: string, prompt: string) => {
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, agentPrompt: prompt } : step
    );
    onStepsChange(updatedSteps);
  };

  const handleAddStep = (type: 'block' | 'agent') => {
    const stepId = uuidv4();
    const blockId = uuidv4();
    
    if (type === 'agent') {
      // Add agent step
      const newStep: FlowStep = {
        id: stepId,
        title: 'New Agent Step',
        description: '',
        completed: false,
        order: steps.length,
        isAgentStep: true,
        agentPrompt: '',
        selectedBlocks: [], // Will be set to all available blocks by default
        canvasPosition: {
          x: 100 + (steps.length % 3) * 280,
          y: 100 + Math.floor(steps.length / 3) * 180
        }
      };
      onStepsChange([...steps, newStep]);
    } else {
      // Add block step
      const newBlock: FlowBlock = {
        id: blockId,
        type: 'collect',
        option: availableBlockOptions?.collect?.[0] || 'User Text',
        name: 'New Block Step'
      };
      const newStep: FlowStep = {
        id: stepId,
        title: 'New Block Step',
        description: '',
        completed: false,
        order: steps.length,
        blockId: blockId,
        canvasPosition: {
          x: 100 + (steps.length % 3) * 280,
          y: 100 + Math.floor(steps.length / 3) * 180
        }
      };
      onStepsChange([...steps, newStep]);
      onBlocksChange([...blocks, newBlock]);
    }
  };

  const handleAutoArrange = () => {
    const updatedSteps = steps.map((step, index) => ({
      ...step,
      canvasPosition: {
        x: 100 + (index % 3) * 280,
        y: 100 + Math.floor(index / 3) * 180
      }
    }));
    onStepsChange(updatedSteps);
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };

  const handleFitToScreen = () => {
    setZoom(1);
    setCanvasOffset({ x: 0, y: 0 });
  };

  // Mouse event handlers for dragging nodes
  const handleMouseDown = (e: React.MouseEvent, stepId: string) => {
    if (e.button !== 0) return; // Only left click
    
    const step = steps.find(s => s.id === stepId);
    if (!step?.canvasPosition) return;

    setDraggedNode(stepId);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: (e.clientX - rect.left) / zoom - step.canvasPosition.x,
        y: (e.clientY - rect.top) / zoom - step.canvasPosition.y
      });
    }
    e.preventDefault();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = (e.clientX - rect.left) / zoom - dragOffset.x;
      const newY = (e.clientY - rect.top) / zoom - dragOffset.y;

      const updatedSteps = steps.map(step =>
        step.id === draggedNode
          ? { ...step, canvasPosition: { x: newX, y: newY } }
          : step
      );
      onStepsChange(updatedSteps);
    } else if (isPanning && canvasRef.current) {
      const deltaX = e.clientX - panStart.x;
      const deltaY = e.clientY - panStart.y;
      setCanvasOffset(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setIsPanning(false);
  };

  // Canvas panning
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current && e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX, y: e.clientY });
    }
  };

  const isAgentStep = (step: FlowStep) => {
    return step.isAgentStep || !step.blockId;
  };

  const getStepBlock = (step: FlowStep) => {
    return step.blockId ? blocks.find(b => b.id === step.blockId) : null;
  };

  return (
    <div className="flex h-full">
      {/* Canvas area */}
      <div className="flex-1 relative overflow-hidden bg-gray-50">
        <CanvasToolbar
          onAddStep={handleAddStep}
          onAutoArrange={handleAutoArrange}
          onZoomIn={() => handleZoom(0.1)}
          onZoomOut={() => handleZoom(-0.1)}
          onFitToScreen={handleFitToScreen}
          zoom={zoom}
        />
        
        <div
          ref={canvasRef}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            transform: `scale(${zoom}) translate(${canvasOffset.x}px, ${canvasOffset.y}px)`
          }}
        >
          {/* Connection lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
            {steps.slice(0, -1).map((step, index) => {
              const currentPos = step.canvasPosition;
              const nextStep = steps[index + 1];
              const nextPos = nextStep?.canvasPosition;
              
              if (!currentPos || !nextPos) return null;
              
              return (
                <line
                  key={`${step.id}-${nextStep.id}`}
                  x1={currentPos.x + 128} // Center of node (width 256 / 2)
                  y1={currentPos.y + 80}  // Bottom of node
                  x2={nextPos.x + 128}
                  y2={nextPos.y + 20}     // Top of next node
                  stroke="#e5e7eb"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
              );
            })}
            
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#e5e7eb"
                />
              </marker>
            </defs>
          </svg>

          {/* Nodes */}
          {steps.map((step) => {
            if (!step.canvasPosition) return null;
            
            const block = getStepBlock(step);
            const isAgent = isAgentStep(step);
            
            return (
              <div
                key={step.id}
                style={{
                  position: 'absolute',
                  left: step.canvasPosition.x,
                  top: step.canvasPosition.y,
                  zIndex: draggedNode === step.id ? 10 : 2
                }}
                onMouseDown={(e) => handleMouseDown(e, step.id)}
              >
                <FlowNode
                  step={step}
                  block={block}
                  isAgent={isAgent}
                  onEdit={() => handleNodeEdit(step.id)}
                  onDelete={() => handleNodeDelete(step.id)}
                  onPromptChange={(prompt) => handlePromptChange(step.id, prompt)}
                  style={{}}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Configuration panel */}
      {showConfigPanel && selectedNode && (
        <NodeConfigPanel
          step={steps.find(s => s.id === selectedNode)!}
          block={selectedNode ? getStepBlock(steps.find(s => s.id === selectedNode)!) : null}
          availableBlockOptions={availableBlockOptions}
          onClose={() => setShowConfigPanel(false)}
          onStepUpdate={(updates) => {
            const updatedSteps = steps.map(step =>
              step.id === selectedNode ? { ...step, ...updates } : step
            );
            onStepsChange(updatedSteps);
          }}
          onBlockUpdate={(updates) => {
            const step = steps.find(s => s.id === selectedNode);
            if (step?.blockId) {
              const updatedBlocks = blocks.map(block =>
                block.id === step.blockId ? { ...block, ...updates } : block
              );
              onBlocksChange(updatedBlocks);
            }
          }}
          onBlockCreate={(newBlock) => {
            onBlocksChange([...blocks, newBlock]);
          }}
        />
      )}
    </div>
  );
}