import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Plus, Trash2, GripVertical, ChevronRight, ChevronDown, Database, Brain, Zap, User, Check } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { v4 as uuidv4 } from 'uuid';
import { agentsData } from '@/data/agentsData';
import { UnifiedTask } from '@/types/unifiedTask';
import { BlockConfigDialog } from './BlockConfigDialog';
import { GenerateInstructionsButton } from './GenerateInstructionsButton';
import { StepBlockPlaceholder } from './StepBlockPlaceholder';
import { blocksData } from '../data/blocksData';

interface FlowStepsEditorProps {
  steps: FlowStep[];
  blocks: FlowBlock[];
  onStepsChange: (steps: FlowStep[]) => void;
  onBlocksChange: (blocks: FlowBlock[]) => void;
  availableBlockOptions?: Record<string, string[]>;
  task?: UnifiedTask;
}

export function FlowStepsEditor({
  steps,
  blocks,
  onStepsChange,
  onBlocksChange,
  availableBlockOptions,
  task
}: FlowStepsEditorProps) {
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [selectedBlock, setSelectedBlock] = useState<FlowBlock | null>(null);
  const [showBlockConfig, setShowBlockConfig] = useState(false);
  const [stepSelectedBlocks, setStepSelectedBlocks] = useState<Record<string, string[]>>({});

  // Get all available blocks from blocksData
  const allBlocks = React.useMemo(() => {
    const blocks: string[] = [];
    Object.values(blocksData).forEach((category: any) => {
      if (Array.isArray(category)) {
        category.forEach((block: any) => {
          blocks.push(block.name);
        });
      }
    });
    return blocks;
  }, []);

  // Sync steps completion status with task data
  useEffect(() => {
    if (task && task.steps_completed && steps.length > 0) {
      const updatedSteps = steps.map((step, index) => ({
        ...step,
        completed: task.steps_completed?.includes(index) || false
      }));
      
      // Only update if there's a difference to avoid infinite loops
      const hasChanges = updatedSteps.some((step, index) => 
        step.completed !== steps[index]?.completed
      );
      
      if (hasChanges) {
        onStepsChange(updatedSteps);
      }
    }
  }, [task?.steps_completed, steps.length]);

  // Initialize selected blocks for steps (all blocks selected by default)
  const getStepSelectedBlocks = (stepId: string) => {
    return stepSelectedBlocks[stepId] || allBlocks;
  };

  const handleStepBlockToggle = (stepId: string, blockName: string) => {
    setStepSelectedBlocks(prev => {
      const currentBlocks = prev[stepId] || allBlocks;
      const newBlocks = currentBlocks.includes(blockName) 
        ? currentBlocks.filter(b => b !== blockName)
        : [...currentBlocks, blockName];
      return {
        ...prev,
        [stepId]: newBlocks
      };
    });
  };

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'collect':
        return <Database className="w-4 h-4 text-blue-600" />;
      case 'think':
        return <Brain className="w-4 h-4 text-purple-600" />;
      case 'act':
        return <Zap className="w-4 h-4 text-green-600" />;
      case 'agent':
        return <User className="w-4 h-4 text-purple-600" />;
      default:
        return null;
    }
  };

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'collect':
        return 'bg-blue-50 border-blue-200';
      case 'think':
        return 'bg-purple-50 border-purple-200';
      case 'act':
        return 'bg-green-50 border-green-200';
      case 'agent':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const addStep = () => {
    if (!newStepTitle.trim()) return;

    const stepId = uuidv4();
    const newStep: FlowStep = {
      id: stepId,
      title: newStepTitle,
      description: '', // Will be generated when user clicks "Generate Instructions"
      completed: false,
      order: steps.length,
      stepType: 'unselected',
      isAgentStep: false
    };
    onStepsChange([...steps, newStep]);
    setNewStepTitle('');
    setIsAddingStep(false);
  };

  const removeStep = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    const updatedSteps = steps
      .filter(step => step.id !== stepId)
      .map((step, index) => ({ ...step, order: index }));
    const updatedBlocks = blocks.filter(block => block.id !== step?.blockId);
    onStepsChange(updatedSteps);
    onBlocksChange(updatedBlocks);
  };

  const updateStep = (stepId: string, updates: Partial<FlowStep>) => {
    const updatedSteps = steps.map(step =>
      step.id === stepId ? { ...step, ...updates } : step
    );
    onStepsChange(updatedSteps);
  };

  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (
      (direction === 'up' && stepIndex === 0) ||
      (direction === 'down' && stepIndex === steps.length - 1)
    ) {
      return;
    }

    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    [newSteps[stepIndex], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[stepIndex]];
    
    const reorderedSteps = newSteps.map((step, index) => ({ ...step, order: index }));
    onStepsChange(reorderedSteps);
  };

  const updateBlock = (blockId: string, updates: Partial<FlowBlock>) => {
    const updatedBlocks = blocks.map(block =>
      block.id === blockId ? { ...block, ...updates } : block
    );
    onBlocksChange(updatedBlocks);
  };

  const toggleStepExpanded = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const getStepBlock = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    return step?.blockId ? blocks.find(b => b.id === step.blockId) : null;
  };

  const isStepCompleted = (stepIndex: number) => {
    return task?.steps_completed?.includes(stepIndex) || false;
  };

  const handleBlockClick = (blockOption: string) => {
    console.log('Clicked block option:', blockOption);
    
    // First try to find by exact option match
    let block = blocks.find(b => b.option === blockOption);
    
    // If not found, try to find by option name with case-insensitive match
    if (!block) {
      block = blocks.find(b => 
        b.option.toLowerCase() === blockOption.toLowerCase()
      );
    }
    
    // If still not found, create a temporary block for display
    if (!block) {
      console.log('Creating temporary block for:', blockOption);
      block = {
        id: 'temp-' + uuidv4(),
        type: 'collect', // Default type
        option: blockOption,
        name: blockOption
      };
    }
    
    console.log('Opening block config for:', block);
    setSelectedBlock(block);
    setShowBlockConfig(true);
  };

  const handleInstructionsGenerated = (stepId: string, instructions: string) => {
    updateStep(stepId, { description: instructions });
  };

  const handleBlockAttached = (stepId: string, block: FlowBlock) => {
    // Add the block to the blocks array
    const updatedBlocks = [...blocks, block];
    onBlocksChange(updatedBlocks);
    
    // Update the step to reference the block
    updateStep(stepId, { blockId: block.id, isAgentStep: false });
  };

  const handleBlockDetached = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step?.blockId) {
      // Remove the block from blocks array
      const updatedBlocks = blocks.filter(b => b.id !== step.blockId);
      onBlocksChange(updatedBlocks);
      
      // Update the step to remove block reference and set to unselected state
      updateStep(stepId, { blockId: undefined, isAgentStep: false, stepType: 'unselected' });
    }
  };

  const handleAgentSelected = (stepId: string) => {
    // Find the current step to preserve its title and description
    const currentStep = steps.find(s => s.id === stepId);
    
    // Create a virtual agent "block" to represent the agent selection
    const agentBlock: FlowBlock = {
      id: uuidv4(),
      type: 'agent',
      option: 'AI Agent',
      name: currentStep?.title || 'AI Agent Step'
    };
    
    // Add this virtual block and attach it to the step
    const updatedBlocks = [...blocks, agentBlock];
    onBlocksChange(updatedBlocks);
    
    // Update the step to reference this agent block while preserving existing data
    updateStep(stepId, { 
      blockId: agentBlock.id, 
      isAgentStep: true, 
      stepType: 'agent'
      // Don't override title or description - they should remain as user entered them
    });
  };

  const handleBlockConfigured = (updatedBlock: FlowBlock) => {
    updateBlock(updatedBlock.id, updatedBlock);
  };

  const addStepQuick = () => {
    const stepId = uuidv4();
    const newStep: FlowStep = {
      id: stepId,
      title: `Step ${steps.length + 1}`,
      description: '',
      completed: false,
      order: steps.length,
      stepType: 'unselected',
      isAgentStep: false
    };
    onStepsChange([...steps, newStep]);
  };

  const renderBlockReference = (description: string, stepBlock: FlowBlock | null) => {
    if (!description) return null;
    
    // Split the description by quoted blocks and render them as clickable buttons
    const parts = description.split(/(\"[^\"]+\")/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('"') && part.endsWith('"')) {
        const blockOption = part.slice(1, -1); // Remove quotes
        const blockType = stepBlock?.type || 'collect';
        
        return (
          <button
            key={index}
            onClick={() => handleBlockClick(blockOption)}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium hover:bg-blue-200 transition-colors cursor-pointer"
          >
            {getBlockIcon(blockType)}
            {blockOption}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Flow Steps</h2>
          <p className="text-sm text-gray-600">Define what needs to be done in each step</p>
        </div>
        <Button 
          onClick={() => setIsAddingStep(true)} 
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Step
        </Button>
      </div>

      {steps.length === 0 && !isAddingStep ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Add steps to build your flow</p>
          <p className="text-xs text-gray-500 mt-1">Each step will describe what needs to be done and which blocks to use</p>
        </div>
      ) : (
        <div className="space-y-4">
          {steps.map((step, index) => {
            const stepBlock = getStepBlock(step.id);
            const isExpanded = expandedSteps.has(step.id);
            const completed = isStepCompleted(index);
            
            return (
              <Card key={step.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        completed 
                          ? "bg-green-500 text-white" 
                          : "bg-blue-500 text-white"
                      }`}>
                        {completed ? <Check className="w-4 h-4" /> : (index + 1)}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Input
                          value={step.title}
                          onChange={(e) => updateStep(step.id, { title: e.target.value })}
                          placeholder="Step name (e.g., Get Amazon Sales for last 30 days)"
                          className="text-base font-semibold border-none shadow-none p-0 h-auto"
                        />
                        {stepBlock ? (
                          <Badge variant="outline" className="text-xs capitalize">
                            {stepBlock.type}
                          </Badge>
                        ) : step.stepType === 'agent' ? (
                          <Badge variant="outline" className="text-xs">
                            Agent
                          </Badge>
                        ) : null}
                      </div>
                      
                      <Textarea
                        value={step.description || ''}
                        onChange={(e) => updateStep(step.id, { description: e.target.value })}
                        placeholder="Step description (optional)"
                        className="text-sm border-gray-200 focus:border-gray-300 min-h-[60px] resize-none"
                      />
                      
                      {/* Agent System Prompt - show for agent steps or agent blocks */}
                      {((!stepBlock && step.isAgentStep && step.stepType !== 'unselected') || (stepBlock && stepBlock.type === 'agent')) && (
                        <div className="mt-2">
                          <label className="text-xs font-medium text-gray-700 block mb-1">
                            System prompt:
                          </label>
                          <Textarea
                            value={step.agentPrompt || ''}
                            onChange={(e) => updateStep(step.id, { agentPrompt: e.target.value })}
                            placeholder="Explain what the agent should do..."
                            className="text-sm border-purple-200 focus:border-purple-300 min-h-[60px] resize-none bg-purple-50"
                          />
                        </div>
                      )}
                        
                        {/* Agent Tools Dropdown - show for agent steps or agent blocks */}
                        {((!stepBlock && step.isAgentStep && step.stepType !== 'unselected') || (stepBlock && stepBlock.type === 'agent')) && (
                          <div className="mt-2">
                            <label className="text-xs font-medium text-gray-700 block mb-1">
                              Tools:
                            </label>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="w-full h-8 text-xs border-purple-200 focus:border-purple-300 justify-between bg-purple-50"
                                >
                                  <span>{getStepSelectedBlocks(step.id).length}/{allBlocks.length} selected</span>
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-80 max-h-64 overflow-y-auto" onCloseAutoFocus={(e) => e.preventDefault()}>
                                <DropdownMenuLabel className="text-xs">Select Tools</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {allBlocks.map((blockName) => (
                                  <DropdownMenuCheckboxItem
                                    key={blockName}
                                    checked={getStepSelectedBlocks(step.id).includes(blockName)}
                                    onCheckedChange={() => handleStepBlockToggle(step.id, blockName)}
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-xs"
                                  >
                                    {blockName}
                                  </DropdownMenuCheckboxItem>
                                ))}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                      {completed && (
                        <Badge className="bg-green-100 text-green-700 text-xs">
                          Completed
                        </Badge>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleStepExpanded(step.id)}
                        className="h-8 w-8 p-0"
                      >
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveStep(step.id, 'up')}
                        disabled={index === 0}
                        className="h-8 w-8 p-0"
                      >
                        ↑
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => moveStep(step.id, 'down')}
                        disabled={index === steps.length - 1}
                        className="h-8 w-8 p-0"
                      >
                        ↓
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeStep(step.id)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Add the StepBlockPlaceholder component */}
                <CardContent className="pt-0">
                  <StepBlockPlaceholder
                    step={step}
                    attachedBlock={stepBlock}
                    onBlockAttached={handleBlockAttached}
                    onBlockDetached={handleBlockDetached}
                    onBlockConfigured={handleBlockConfigured}
                    onAgentSelected={handleAgentSelected}
                    availableBlockOptions={availableBlockOptions}
                  />
                </CardContent>

                {isExpanded && stepBlock && (
                  <CardContent className="pt-0">
                    <div className={`p-3 rounded-lg border ${getBlockColor(stepBlock.type)}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          {getBlockIcon(stepBlock.type)}
                          <Badge variant="outline" className="capitalize text-xs">
                            {stepBlock.type}
                          </Badge>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <Select
                            value={stepBlock.type}
                            onValueChange={(value: 'collect' | 'think' | 'act' | 'agent') => {
                              const defaultOption = availableBlockOptions?.[value]?.[0] || (
                                value === 'collect' ? 'User Text' :
                                value === 'think' ? 'Basic AI Analysis' :
                                value === 'act' ? 'AI Summary' : 'Agent'
                              );
                              updateBlock(stepBlock.id, { type: value, option: defaultOption });
                            }}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="collect">Collect</SelectItem>
                              <SelectItem value="think">Think</SelectItem>
                              <SelectItem value="act">Act</SelectItem>
                              <SelectItem value="agent">Agent</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select
                            value={stepBlock.option}
                            onValueChange={(value) => updateBlock(stepBlock.id, { option: value })}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(availableBlockOptions?.[stepBlock.type] || []).map(option => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          
                          <Input
                            value={stepBlock.name}
                            onChange={(e) => updateBlock(stepBlock.id, { name: e.target.value })}
                            placeholder="Block name"
                            className="text-xs"
                          />

                          {stepBlock.type === 'agent' && (
                            <Select
                              value={stepBlock.agentId || ''}
                              onValueChange={(value) => updateBlock(stepBlock.id, {
                                agentId: value,
                                agentName: agentsData.find(a => a.id === value)?.name
                              })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Choose agent" />
                              </SelectTrigger>
                              <SelectContent>
                                {agentsData.map(agent => (
                                  <SelectItem key={agent.id} value={agent.id}>
                                    {agent.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
           })}
          
          {/* Quick Add Step Button at the end */}
          <Card className="border-dashed border-gray-300 hover:border-gray-400 transition-colors">
            <CardContent className="p-4">
              <Button
                variant="ghost"
                onClick={addStepQuick}
                className="w-full h-12 text-gray-600 hover:text-gray-800 justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Step
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {isAddingStep && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Input
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                placeholder="Enter step name (e.g., Get Amazon Sales for last 30 days)"
                autoFocus
              />
              <div className="flex gap-2">
                <Button onClick={addStep} disabled={!newStepTitle.trim()}>
                  Add Step
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingStep(false);
                    setNewStepTitle('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <BlockConfigDialog
        block={selectedBlock}
        isOpen={showBlockConfig}
        onClose={() => {
          setShowBlockConfig(false);
          setSelectedBlock(null);
        }}
      />
    </div>
  );
}
