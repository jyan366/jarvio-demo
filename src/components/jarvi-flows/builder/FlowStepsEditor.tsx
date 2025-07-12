import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, GripVertical, ChevronRight, ChevronDown, Database, Brain, Zap, User, Check } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { v4 as uuidv4 } from 'uuid';
import { agentsData } from '@/data/agentsData';
import { UnifiedTask } from '@/types/unifiedTask';
import { BlockConfigDialog } from './BlockConfigDialog';
import { GenerateInstructionsButton } from './GenerateInstructionsButton';
import { EditableDescription } from './EditableDescription';

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

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'collect':
        return <Database className="w-4 h-4 text-blue-600" />;
      case 'think':
        return <Brain className="w-4 h-4 text-purple-600" />;
      case 'act':
        return <Zap className="w-4 h-4 text-green-600" />;
      case 'agent':
        return <User className="w-4 h-4 text-orange-600" />;
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
        return 'bg-orange-50 border-orange-200';
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
      isAgentStep: true // Start as agent step, block can be attached later
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

  const handleBlockAttach = (stepId: string, blockType: string, blockOption: string) => {
    const blockId = uuidv4();
    const newBlock: FlowBlock = {
      id: blockId,
      type: blockType as 'collect' | 'think' | 'act' | 'agent',
      option: blockOption,
      name: blockOption
    };
    
    // Update step to reference the block
    updateStep(stepId, { 
      blockId: blockId,
      isAgentStep: false 
    });
    
    // Add the new block
    onBlocksChange([...blocks, newBlock]);
  };

  const handleBlockDetach = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (step?.blockId) {
      // Remove the block
      const updatedBlocks = blocks.filter(b => b.id !== step.blockId);
      onBlocksChange(updatedBlocks);
      
      // Update step to be an agent step
      updateStep(stepId, { 
        blockId: undefined,
        isAgentStep: true 
      });
    }
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
                        ) : (
                          <Badge variant="outline" className="text-xs">
                            Agent
                          </Badge>
                        )}
                      </div>
                      
                      <EditableDescription
                        step={step}
                        stepBlock={stepBlock}
                        onStepUpdate={(updates) => updateStep(step.id, updates)}
                        onBlockAttach={(blockType, blockOption) => handleBlockAttach(step.id, blockType, blockOption)}
                        onBlockDetach={() => handleBlockDetach(step.id)}
                      />
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
