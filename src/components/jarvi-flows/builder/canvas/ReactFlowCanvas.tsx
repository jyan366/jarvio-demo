import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  EdgeTypes,
  MarkerType,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { BlockStepNode } from './nodes/BlockStepNode';
import { AgentStepNode } from './nodes/AgentStepNode';
import { AddStepPanel } from './AddStepDialog';
import { ReactFlowToolbar } from './ReactFlowToolbar';
import { CustomEdge } from './CustomEdge';
import { FlowTriggers } from './FlowTriggers';
import { v4 as uuidv4 } from 'uuid';

interface ReactFlowCanvasProps {
  steps: FlowStep[];
  blocks: FlowBlock[];
  onStepsChange: (steps: FlowStep[]) => void;
  onBlocksChange: (blocks: FlowBlock[]) => void;
  availableBlockOptions?: Record<string, string[]>;
  flowTrigger?: string;
  onTriggerChange?: (trigger: string) => void;
  onStartFlow?: () => void;
  isRunningFlow?: boolean;
}

// Custom node types
const nodeTypes: NodeTypes = {
  blockStep: BlockStepNode,
  agentStep: AgentStepNode,
};

// Custom edge types
const edgeTypes: EdgeTypes = {
  custom: CustomEdge,
};

export function ReactFlowCanvas({
  steps,
  blocks,
  onStepsChange,
  onBlocksChange,
  availableBlockOptions,
  flowTrigger = 'manual',
  onTriggerChange = () => {},
  onStartFlow = () => {},
  isRunningFlow = false
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
          x: 100 + index * 400, // Increased spacing from 320 to 400
          y: 100
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
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
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
        type: 'custom',
        animated: false,
        style: { stroke: '#6b7280', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#6b7280',
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

  const handleAddStep = (type: 'block' | 'agent', blockData?: any) => {
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
          x: 100 + steps.length * 400, // Increased spacing from 320 to 400
          y: 100
        }
      };
      onStepsChange([...steps, newStep]);
    } else {
      const blockId = uuidv4();
      const newBlock: FlowBlock = {
        id: blockId,
        type: blockData?.category || 'collect',
        option: blockData?.name || availableBlockOptions?.collect?.[0] || 'User Text',
        name: blockData?.name || 'New Block Step',
        ...(blockData && {
          summary: blockData.summary,
          description: blockData.description,
          icon: blockData.icon,
          logo: blockData.logo,
          needsConnection: blockData.needsConnection,
          connectionService: blockData.connectionService
        })
      };
      const newStep: FlowStep = {
        id: stepId,
        title: blockData?.name || 'New Block Step',
        description: blockData?.summary || '',
        completed: false,
        order: steps.length,
        blockId: blockId,
        canvasPosition: {
          x: 100 + steps.length * 400, // Increased spacing from 320 to 400
          y: 100
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
        x: 100 + index * 400, // Increased spacing from 320 to 400
        y: 100
      }
    }));
    onStepsChange(updatedSteps);
  };

  const [addPanelOpen, setAddPanelOpen] = useState(false);

  return (
    <div className="w-full h-full relative bg-gray-50">
      <ReactFlowToolbar
        onAddStep={handleAddStep}
        onAutoArrange={handleAutoArrange}
        onToggleAddPanel={() => setAddPanelOpen(!addPanelOpen)}
      />
      
      <AddStepPanel
        onAddStep={handleAddStep}
        isOpen={addPanelOpen}
        onClose={() => setAddPanelOpen(false)}
      />
      
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
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
      
      <FlowTriggers
        selectedTrigger={flowTrigger}
        onTriggerChange={onTriggerChange}
        onStartFlow={onStartFlow}
        isRunning={isRunningFlow}
      />
    </div>
  );
}