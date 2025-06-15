import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, GripVertical, ChevronRight, ChevronDown, Database, Brain, Zap, User } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { v4 as uuidv4 } from 'uuid';
import { agentsData } from '@/data/agentsData';

interface FlowStepsEditorProps {
  steps: FlowStep[];
  blocks: FlowBlock[];
  onStepsChange: (steps: FlowStep[]) => void;
  onBlocksChange: (blocks: FlowBlock[]) => void;
  availableBlockOptions?: Record<string, string[]>;
}
export function FlowStepsEditor({
  steps,
  blocks,
  onStepsChange,
  onBlocksChange,
  availableBlockOptions
}: FlowStepsEditorProps) {
  const [isAddingStep, setIsAddingStep] = useState(false);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepDescription, setNewStepDescription] = useState('');
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
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

    // Create a corresponding block for the step
    const blockId = uuidv4();
    const stepId = uuidv4();
    const newBlock: FlowBlock = {
      id: blockId,
      type: 'collect',
      // Default type
      option: availableBlockOptions?.collect?.[0] || 'User Text',
      name: newStepTitle
    };
    const newStep: FlowStep = {
      id: stepId,
      title: newStepTitle,
      description: newStepDescription,
      completed: false,
      order: steps.length,
      blockId: blockId // Link step to block
    };
    onStepsChange([...steps, newStep]);
    onBlocksChange([...blocks, newBlock]);
    setNewStepTitle('');
    setNewStepDescription('');
    setIsAddingStep(false);
  };
  const removeStep = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);

    // Remove step and its linked block
    const updatedSteps = steps.filter(step => step.id !== stepId).map((step, index) => ({
      ...step,
      order: index
    }));
    const updatedBlocks = blocks.filter(block => block.id !== step?.blockId);
    onStepsChange(updatedSteps);
    onBlocksChange(updatedBlocks);
  };
  const updateStep = (stepId: string, updates: Partial<FlowStep>) => {
    const updatedSteps = steps.map(step => step.id === stepId ? {
      ...step,
      ...updates
    } : step);
    onStepsChange(updatedSteps);
  };
  const moveStep = (stepId: string, direction: 'up' | 'down') => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    if (direction === 'up' && stepIndex === 0 || direction === 'down' && stepIndex === steps.length - 1) {
      return;
    }
    const newSteps = [...steps];
    const targetIndex = direction === 'up' ? stepIndex - 1 : stepIndex + 1;
    [newSteps[stepIndex], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[stepIndex]];
    const reorderedSteps = newSteps.map((step, index) => ({
      ...step,
      order: index
    }));
    onStepsChange(reorderedSteps);
  };
  const updateBlock = (blockId: string, updates: Partial<FlowBlock>) => {
    const updatedBlocks = blocks.map(block => block.id === blockId ? {
      ...block,
      ...updates
    } : block);
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
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Steps</h2>
          
        </div>
        <Button onClick={() => setIsAddingStep(true)} className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Step
        </Button>
      </div>

      {steps.length === 0 && !isAddingStep ? <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">Add steps to build your flow</p>
          <p className="text-xs text-gray-500 mt-1">Each step will have a corresponding block for execution</p>
        </div> : <div className="space-y-4">
          {steps.map((step, index) => {
        const stepBlock = getStepBlock(step.id);
        const isExpanded = expandedSteps.has(step.id);
        return <Card key={step.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                        step.completed 
                          ? "bg-green-500 text-white" 
                          : "bg-blue-500 text-white"
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <Input value={step.title} onChange={e => updateStep(step.id, {
                  title: e.target.value
                })} placeholder="Step title" className="text-lg font-semibold border-none shadow-none p-0 h-auto" />
                      {step.description && <Textarea value={step.description} onChange={e => updateStep(step.id, {
                  description: e.target.value
                })} placeholder="Step description" className="text-sm text-gray-600 border-none shadow-none p-0 mt-1 resize-none" rows={2} />}
                    </div>

                    <div className="flex items-center gap-1">
                      {stepBlock && <div className="flex items-center gap-1">
                          {getBlockIcon(stepBlock.type)}
                          <Badge variant="outline" className="text-xs capitalize">
                            {stepBlock.type}
                          </Badge>
                        </div>}
                      
                      <Button size="sm" variant="ghost" onClick={() => toggleStepExpanded(step.id)} className="h-8 w-8 p-0">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </Button>
                      
                      <Button size="sm" variant="ghost" onClick={() => moveStep(step.id, 'up')} disabled={index === 0} className="h-8 w-8 p-0">
                        ↑
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => moveStep(step.id, 'down')} disabled={index === steps.length - 1} className="h-8 w-8 p-0">
                        ↓
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => removeStep(step.id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && stepBlock && <CardContent className="pt-0">
                    <div className={`p-3 rounded-lg border ${getBlockColor(stepBlock.type)}`}>
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2">
                          {getBlockIcon(stepBlock.type)}
                          <Badge variant="outline" className="capitalize text-xs">
                            {stepBlock.type}
                          </Badge>
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <Select value={stepBlock.type} onValueChange={(value: 'collect' | 'think' | 'act' | 'agent') => {
                    const defaultOption = availableBlockOptions?.[value]?.[0] || (value === 'collect' ? 'User Text' : value === 'think' ? 'Basic AI Analysis' : value === 'act' ? 'AI Summary' : 'Agent');
                    updateBlock(stepBlock.id, {
                      type: value,
                      option: defaultOption
                    });
                  }}>
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

                          <Select value={stepBlock.option} onValueChange={value => updateBlock(stepBlock.id, {
                    option: value
                  })}>
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {(availableBlockOptions?.[stepBlock.type] || []).map(option => <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>)}
                            </SelectContent>
                          </Select>
                          
                          <Input value={stepBlock.name} onChange={e => updateBlock(stepBlock.id, {
                    name: e.target.value
                  })} placeholder="Block name" className="text-xs" />

                          {stepBlock.type === 'agent' && <Select value={stepBlock.agentId || ''} onValueChange={value => updateBlock(stepBlock.id, {
                    agentId: value,
                    agentName: agentsData.find(a => a.id === value)?.name
                  })}>
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue placeholder="Choose agent" />
                              </SelectTrigger>
                              <SelectContent>
                                {agentsData.map(agent => <SelectItem key={agent.id} value={agent.id}>
                                    {agent.name}
                                  </SelectItem>)}
                              </SelectContent>
                            </Select>}
                        </div>
                      </div>
                    </div>
                  </CardContent>}
              </Card>;
      })}
        </div>}

      {/* Add New Step */}
      {isAddingStep && <Card>
          <CardContent className="p-4">
            <div className="space-y-3">
              <Input value={newStepTitle} onChange={e => setNewStepTitle(e.target.value)} placeholder="Enter step title" autoFocus />
              <Textarea value={newStepDescription} onChange={e => setNewStepDescription(e.target.value)} placeholder="Enter step description (optional)" rows={2} />
              <div className="flex gap-2">
                <Button onClick={addStep} disabled={!newStepTitle.trim()}>
                  Add Step
                </Button>
                <Button variant="outline" onClick={() => {
              setIsAddingStep(false);
              setNewStepTitle('');
              setNewStepDescription('');
            }}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>}
    </div>;
}
