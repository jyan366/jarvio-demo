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
import { NextStepNode } from './nodes/NextStepNode';
import { AddStepPanel } from './AddStepDialog';
import { ReactFlowToolbar } from './ReactFlowToolbar';
import { CustomEdge } from './CustomEdge';
import { BlockConfigDialog } from '../BlockConfigDialog';
import { AttachBlockDialog } from './AttachBlockDialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Play, TestTube } from 'lucide-react';

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
  nextStep: NextStepNode,
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
  
  // Test execution states
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [executionStates, setExecutionStates] = useState<Record<string, 'idle' | 'running' | 'success' | 'failed'>>({});
  const [activeEdges, setActiveEdges] = useState<Set<string>>(new Set());

  const handleBlockClick = useCallback((block: FlowBlock) => {
    setSelectedBlock(block);
    setShowBlockConfig(true);
  }, []);

  const handleAddStep = useCallback((type: 'block' | 'agent', blockData?: any) => {
    const stepId = uuidv4();
    
    if (type === 'agent') {
      // Create agent step
      const newStep: FlowStep = {
        id: stepId,
        title: '',
        description: '',
        completed: false,
        order: steps.length,
        isAgentStep: true,
        stepType: 'agent',
        agentPrompt: '',
        selectedBlocks: [],
        canvasPosition: {
          x: 400 + steps.length * 450,
          y: 100
        }
      };
      onStepsChange([...steps, newStep]);
    } else if (type === 'block' && blockData) {
      // Create workflow step with block attached
      const blockId = uuidv4();
      const newBlock: FlowBlock = {
        id: blockId,
        type: blockData.type || 'collect',
        option: blockData.name,
        name: blockData.name
      };

      const newStep: FlowStep = {
        id: stepId,
        title: '',
        description: '',
        completed: false,
        order: steps.length,
        blockId: blockId,
        isAgentStep: false,
        stepType: 'block',
        canvasPosition: {
          x: 400 + steps.length * 450,
          y: 100
        }
      };

      onStepsChange([...steps, newStep]);
      onBlocksChange([...blocks, newBlock]);
    }
  }, [steps, blocks, onStepsChange, onBlocksChange]);

  const handleDetachBlock = useCallback((stepId: string) => {
    // Remove block reference and set to unselected state
    const updatedSteps = steps.map(step =>
      step.id === stepId 
        ? { 
            ...step, 
            blockId: undefined,
            isAgentStep: false,
            stepType: 'unselected' as const,
            title: '',
            description: ''
          }
        : step
    );
    
    // Remove the block from blocks array
    const stepToUpdate = steps.find(s => s.id === stepId);
    if (stepToUpdate?.blockId) {
      const updatedBlocks = blocks.filter(b => b.id !== stepToUpdate.blockId);
      onBlocksChange(updatedBlocks);
    }
    
    onStepsChange(updatedSteps);
  }, [steps, blocks, onStepsChange, onBlocksChange]);
  
  // Convert steps to React Flow nodes
  const convertToNodes = useCallback((): Node[] => {
    console.log('convertToNodes called with steps:', steps.length);
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
      const isAgent = step.isAgentStep === true;
      const isUnselected = step.stepType === 'unselected' || (!step.isAgentStep && !step.blockId && step.stepType !== 'block');
      const block = step.blockId ? blocks.find(b => b.id === step.blockId) : null;
      
      return {
        id: step.id,
        type: isAgent ? 'agentStep' : 'workflowStep',
        position: step.canvasPosition || { x: 400 + index * 450, y: 100 }, // Start further from trigger
        data: {
          step,
          block,
          isAgent,
          executionState: executionStates[step.id] || 'idle',
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
            // Update step type to block when attaching
            onStepsChange(steps.map(s => 
              s.id === step.id 
                ? { ...s, stepType: 'block', isAgentStep: false }
                : s
            ));
            setSelectedStepForAttach(step.id);
            setAttachBlockDialogOpen(true);
          },
          onDetachBlock: block ? () => handleDetachBlock(step.id) : undefined,
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
    
    // Add "Next Step" node after the last step (only if there are steps)
    if (steps.length > 0) {
      const lastStepPosition = steps[steps.length - 1].canvasPosition || { x: 400 + (steps.length - 1) * 450, y: 100 };
      
      const nextStepNode = {
        id: 'next-step',
        type: 'nextStep',
        position: { x: lastStepPosition.x + 450, y: lastStepPosition.y },
        data: {
          onAddStep: handleAddStep,
        },
        draggable: false,
        selectable: false,
        deletable: false,
      };
      
      nodes.push(nextStepNode);
    }
    
    
    console.log('All nodes created:', nodes.map(n => ({ id: n.id, type: n.type, position: n.position })));
    return nodes;
  }, [steps, blocks, flowTrigger, isRunningFlow, executionStates, handleBlockClick, handleAddStep, handleDetachBlock]);

  // Convert steps to React Flow edges
  const convertToEdges = useCallback((): Edge[] => {
    const edges: Edge[] = [];
    
    // Connect trigger to first step
    if (steps.length > 0) {
      const triggerEdgeId = 'trigger-to-first';
      const isActive = activeEdges.has(triggerEdgeId);
      
      edges.push({
        id: triggerEdgeId,
        source: 'trigger',
        sourceHandle: 'trigger-source',
        target: steps[0].id,
        targetHandle: null,
        type: 'custom',
        animated: isActive,
        style: { 
          stroke: isActive ? '#3b82f6' : '#6b7280', 
          strokeWidth: isActive ? 3 : 2 
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isActive ? '#3b82f6' : '#6b7280',
        },
      });
    }
    
    // Connect steps to each other
    for (let i = 0; i < steps.length - 1; i++) {
      const currentStep = steps[i];
      const nextStep = steps[i + 1];
      const edgeId = `edge-${currentStep.id}-${nextStep.id}`;
      const isActive = activeEdges.has(edgeId);
      
      edges.push({
        id: edgeId,
        source: currentStep.id,
        target: nextStep.id,
        type: 'custom',
        animated: isActive,
        style: { 
          stroke: isActive ? '#3b82f6' : '#6b7280', 
          strokeWidth: isActive ? 3 : 2 
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isActive ? '#3b82f6' : '#6b7280',
        },
      });
    }
    
    return edges;
  }, [steps, activeEdges]);

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

  // Test execution logic
  const simulateFlowExecution = async (shouldFail: boolean) => {
    if (steps.length === 0) return;
    
    setIsTestRunning(true);
    setExecutionStates({});
    setActiveEdges(new Set());
    
    // Reset all states
    const resetStates: Record<string, 'idle' | 'running' | 'success' | 'failed'> = {};
    steps.forEach(step => resetStates[step.id] = 'idle');
    setExecutionStates(resetStates);
    
    // Execute steps sequentially
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const edgeId = i === 0 ? 'trigger-to-first' : `edge-${steps[i-1].id}-${step.id}`;
      
      // Animate edge
      setActiveEdges(prev => new Set([...prev, edgeId]));
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Start step execution
      setExecutionStates(prev => ({ ...prev, [step.id]: 'running' }));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if should fail on step 3 (index 2)
      if (shouldFail && i === 2) {
        setExecutionStates(prev => ({ ...prev, [step.id]: 'failed' }));
        setActiveEdges(new Set());
        setIsTestRunning(false);
        return;
      }
      
      // Mark as success
      setExecutionStates(prev => ({ ...prev, [step.id]: 'success' }));
      setActiveEdges(prev => {
        const newSet = new Set(prev);
        newSet.delete(edgeId);
        return newSet;
      });
    }
    
    setIsTestRunning(false);
  };


  return (
    <div className="w-full h-full relative bg-gray-50">
      <ReactFlowToolbar
        onAddStep={handleAddStep}
        onAutoArrange={handleAutoArrange}
        onToggleAddPanel={() => setAddPanelOpen(!addPanelOpen)}
      />
      
      {/* Test Button */}
      <div className="absolute top-4 right-4 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="default" 
              disabled={isTestRunning || steps.length === 0}
              className="gap-2"
            >
              <TestTube className="w-4 h-4" />
              {isTestRunning ? "Running..." : "Test Flow"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => simulateFlowExecution(false)}>
              <Play className="w-4 h-4 mr-2" />
              Test Success
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => simulateFlowExecution(true)}>
              <Play className="w-4 h-4 mr-2 text-destructive" />
              Test Fail (Step 3)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
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