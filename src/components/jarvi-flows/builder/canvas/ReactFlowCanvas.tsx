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
import { WorkflowStepNode } from './nodes/WorkflowStepNode';
import { AgentStepNode } from './nodes/AgentStepNode';
import { TriggerNode } from './nodes/TriggerNode';
import { AddStepPanel } from './AddStepDialog';
import { ReactFlowToolbar } from './ReactFlowToolbar';
import { CustomEdge } from './CustomEdge';
import { BlockConfigDialog } from '../BlockConfigDialog';
import { AttachBlockDialog } from './AttachBlockDialog';
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
  trigger: TriggerNode,
  workflowStep: WorkflowStepNode,
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
  const [addPanelOpen, setAddPanelOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<FlowBlock | null>(null);
  const [showBlockConfig, setShowBlockConfig] = useState(false);
  const [attachBlockDialogOpen, setAttachBlockDialogOpen] = useState(false);
  const [selectedStepForAttach, setSelectedStepForAttach] = useState<string | null>(null);

  const handleBlockClick = useCallback((block: FlowBlock) => {
    setSelectedBlock(block);
    setShowBlockConfig(true);
  }, []);
  
  // Convert steps to React Flow nodes
  const convertToNodes = useCallback((): Node[] => {
    const nodes: Node[] = [];
    
    // Add trigger node as the first node
    nodes.push({
      id: 'trigger',
      type: 'trigger',
      position: { x: 50, y: 100 },
      data: {
        triggerType: flowTrigger,
        onTriggerChange: onTriggerChange,
        onStartFlow: onStartFlow,
        isRunning: isRunningFlow,
      },
      draggable: true,
      selectable: true,
    });

    // Add step nodes
    const stepNodes = steps.map((step, index) => {
      const isAgent = step.isAgentStep || !step.blockId;
      const block = step.blockId ? blocks.find(b => b.id === step.blockId) : null;
      
      return {
        id: step.id,
        type: isAgent ? 'agentStep' : 'workflowStep',
        position: step.canvasPosition || { x: 400 + index * 450, y: 100 }, // Start further from trigger
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
          onAttachBlock: () => {
            setSelectedStepForAttach(step.id);
            setAttachBlockDialogOpen(true);
          },
          onConfigureBlock: block ? () => handleBlockClick(block) : undefined,
          availableBlockOptions
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        draggable: true,
        selectable: true,
      };
    });
    
    nodes.push(...stepNodes);
    return nodes;
  }, [steps, blocks, flowTrigger, isRunningFlow, handleBlockClick]);

  // Convert steps to React Flow edges
  const convertToEdges = useCallback((): Edge[] => {
    const edges: Edge[] = [];
    
    // Connect trigger to first step
    if (steps.length > 0) {
      edges.push({
        id: 'trigger-to-first',
        source: 'trigger',
        sourceHandle: 'trigger-source',
        target: steps[0].id,
        targetHandle: null,
        type: 'custom',
        animated: false,
        style: { stroke: '#6b7280', strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#6b7280',
        },
      });
    }
    
    // Connect steps to each other
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

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Update nodes when steps change - but use a stable reference
  useEffect(() => {
    setNodes(convertToNodes());
  }, [convertToNodes]);

  // Update edges when steps change
  useEffect(() => {
    setEdges(convertToEdges());
  }, [convertToEdges]);

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
    
    // Always create just a step first, blocks are attached separately
    const newStep: FlowStep = {
      id: stepId,
      title: type === 'agent' ? 'New Agent Step' : 'New Step',
      description: type === 'agent' ? 'AI will handle this step automatically' : 'Configure what action this step should perform',
      completed: false,
      order: steps.length,
      isAgentStep: type === 'agent',
      agentPrompt: '',
      selectedBlocks: [],
      canvasPosition: {
        x: 400 + steps.length * 450, // Start further from trigger
        y: 100
      }
    };

    onStepsChange([...steps, newStep]);
  };

  const handleAttachBlock = (stepId: string, blockData: any) => {
    const blockId = uuidv4();
    const newBlock: FlowBlock = {
      id: blockId,
      type: blockData.category || 'collect',
      option: blockData.name,
      name: blockData.name
    };

    // Update the step to reference this block
    const updatedSteps = steps.map(step =>
      step.id === stepId 
        ? { 
            ...step, 
            blockId: blockId,
            isAgentStep: false,
            title: blockData.name,
            description: blockData.summary
          }
        : step
    );

    onStepsChange(updatedSteps);
    onBlocksChange([...blocks, newBlock]);
  };

  const handleAutoArrange = () => {
    const updatedSteps = steps.map((step, index) => ({
      ...step,
      canvasPosition: {
        x: 400 + index * 450, // Start further from trigger, increased spacing
        y: 100
      }
    }));
    onStepsChange(updatedSteps);
  };


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
        availableBlockOptions={availableBlockOptions}
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

      <BlockConfigDialog
        block={selectedBlock}
        isOpen={showBlockConfig}
        onClose={() => {
          setShowBlockConfig(false);
          setSelectedBlock(null);
        }}
      />

      <AttachBlockDialog
        isOpen={attachBlockDialogOpen}
        onClose={() => {
          setAttachBlockDialogOpen(false);
          setSelectedStepForAttach(null);
        }}
        onAttachBlock={(blockData) => {
          if (selectedStepForAttach) {
            handleAttachBlock(selectedStepForAttach, blockData);
          }
        }}
        stepId={selectedStepForAttach || ''}
      />
    </div>
  );
}