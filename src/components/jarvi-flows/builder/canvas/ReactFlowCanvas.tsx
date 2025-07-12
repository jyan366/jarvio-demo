import React, { useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  NodeTypes,
  MarkerType,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { BlockStepNode } from './nodes/BlockStepNode';
import { AgentStepNode } from './nodes/AgentStepNode';
import { ReactFlowToolbar } from './ReactFlowToolbar';
import { v4 as uuidv4 } from 'uuid';

interface ReactFlowCanvasProps {
  steps: FlowStep[];
  blocks: FlowBlock[];
  onStepsChange: (steps: FlowStep[]) => void;
  onBlocksChange: (blocks: FlowBlock[]) => void;
  availableBlockOptions?: Record<string, string[]>;
}

// Custom node types
const nodeTypes: NodeTypes = {
  blockStep: BlockStepNode,
  agentStep: AgentStepNode,
};

export function ReactFlowCanvas({
  steps,
  blocks,
  onStepsChange,
  onBlocksChange,
  availableBlockOptions
}: ReactFlowCanvasProps) {
  
  // Convert steps to React Flow nodes
  const convertToNodes = useCallback((): Node[] => {
    return steps.map((step, index) => {
      const isAgent = step.isAgentStep || !step.blockId;
      const block = step.blockId ? blocks.find(b => b.id === step.blockId) : null;
      
      return {
        id: step.id,
        type: isAgent ? 'agentStep' : 'blockStep',
        position: step.canvasPosition || {
          x: 100 + (index % 4) * 320,
          y: 100 + Math.floor(index / 4) * 200
        },
        data: {
          step,
          block,
          isAgent,
          onStepUpdate: (updates: Partial<FlowStep>) => {
            const updatedSteps = steps.map(s =>
              s.id === step.id ? { ...s, ...updates } : s
            );
            onStepsChange(updatedSteps);
          },
          onBlockUpdate: (updates: Partial<FlowBlock>) => {
            if (block) {
              const updatedBlocks = blocks.map(b =>
                b.id === block.id ? { ...b, ...updates } : b
              );
              onBlocksChange(updatedBlocks);
            }
          },
          onDelete: () => {
            const updatedSteps = steps
              .filter(s => s.id !== step.id)
              .map((s, idx) => ({ ...s, order: idx }));
            const updatedBlocks = blocks.filter(b => b.id !== step.blockId);
            onStepsChange(updatedSteps);
            onBlocksChange(updatedBlocks);
          },
          availableBlockOptions
        },
        draggable: true,
        selectable: true,
      };
    });
  }, [steps, blocks, onStepsChange, onBlocksChange, availableBlockOptions]);

  // Convert steps to React Flow edges
  const convertToEdges = useCallback((): Edge[] => {
    const edges: Edge[] = [];
    
    for (let i = 0; i < steps.length - 1; i++) {
      const currentStep = steps[i];
      const nextStep = steps[i + 1];
      
      edges.push({
        id: `edge-${currentStep.id}-${nextStep.id}`,
        source: currentStep.id,
        target: nextStep.id,
        type: 'smoothstep',
        animated: false,
        style: { stroke: '#e5e7eb', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#e5e7eb',
        },
      });
    }
    
    return edges;
  }, [steps]);

  const [nodes, setNodes, onNodesChange] = useNodesState(convertToNodes());
  const [edges, setEdges, onEdgesChange] = useEdgesState(convertToEdges());

  // Update nodes when steps/blocks change
  useEffect(() => {
    setNodes(convertToNodes());
  }, [steps, blocks, convertToNodes, setNodes]);

  // Update edges when steps change
  useEffect(() => {
    setEdges(convertToEdges());
  }, [steps, convertToEdges, setEdges]);

  // Handle node position changes
  const handleNodeDragStop = useCallback((event: any, node: Node) => {
    const updatedSteps = steps.map(step =>
      step.id === node.id 
        ? { ...step, canvasPosition: { x: node.position.x, y: node.position.y } }
        : step
    );
    onStepsChange(updatedSteps);
  }, [steps, onStepsChange]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleAddStep = (type: 'block' | 'agent') => {
    const stepId = uuidv4();
    
    if (type === 'agent') {
      const newStep: FlowStep = {
        id: stepId,
        title: 'New Agent Step',
        description: '',
        completed: false,
        order: steps.length,
        isAgentStep: true,
        agentPrompt: '',
        selectedBlocks: [],
        canvasPosition: {
          x: 100 + (steps.length % 4) * 320,
          y: 100 + Math.floor(steps.length / 4) * 200
        }
      };
      onStepsChange([...steps, newStep]);
    } else {
      const blockId = uuidv4();
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
          x: 100 + (steps.length % 4) * 320,
          y: 100 + Math.floor(steps.length / 4) * 200
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
        x: 100 + (index % 4) * 320,
        y: 100 + Math.floor(index / 4) * 200
      }
    }));
    onStepsChange(updatedSteps);
  };

  return (
    <div className="w-full h-full relative bg-gray-50">
      <ReactFlowToolbar
        onAddStep={handleAddStep}
        onAutoArrange={handleAutoArrange}
      />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid
        snapGrid={[20, 20]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        minZoom={0.2}
        maxZoom={2}
        className="bg-gray-50"
      >
        <Background color="#e5e7eb" gap={20} />
        <Controls showInteractive={false} />
        <MiniMap 
          nodeStrokeColor="#374151"
          nodeColor={(node) => {
            if (node.type === 'agentStep') return '#fb923c';
            const nodeData = node.data as any;
            const block = blocks.find(b => b.id === nodeData?.step?.blockId);
            switch (block?.type) {
              case 'collect': return '#3b82f6';
              case 'think': return '#8b5cf6';
              case 'act': return '#10b981';
              default: return '#6b7280';
            }
          }}
          maskColor="rgba(255, 255, 255, 0.2)"
          pannable
          zoomable
          className="bg-white border border-gray-200 rounded-lg"
        />
      </ReactFlow>
    </div>
  );
}