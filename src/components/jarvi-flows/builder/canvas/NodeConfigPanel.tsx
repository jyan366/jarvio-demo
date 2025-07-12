import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Database, Brain, Zap, User } from 'lucide-react';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { agentsData } from '@/data/agentsData';

interface NodeConfigPanelProps {
  step: FlowStep;
  block: FlowBlock | null;
  availableBlockOptions?: Record<string, string[]>;
  onClose: () => void;
  onStepUpdate: (updates: Partial<FlowStep>) => void;
  onBlockUpdate: (updates: Partial<FlowBlock>) => void;
  onBlockCreate?: (newBlock: FlowBlock) => void;
}

export function NodeConfigPanel({
  step,
  block,
  availableBlockOptions,
  onClose,
  onStepUpdate,
  onBlockUpdate,
  onBlockCreate
}: NodeConfigPanelProps) {
  const [localStep, setLocalStep] = useState(step);
  const [localBlock, setLocalBlock] = useState(block);
  const [selectedBlockCount, setSelectedBlockCount] = useState(24); // Default to all blocks

  const isAgentStep = step.isAgentStep || !step.blockId;

  const getBlockIcon = (type?: string) => {
    switch (type) {
      case 'collect':
        return <Database className="w-4 h-4 text-blue-600" />;
      case 'think':
        return <Brain className="w-4 h-4 text-purple-600" />;
      case 'act':
        return <Zap className="w-4 h-4 text-green-600" />;
      case 'agent':
      default:
        return <User className="w-4 h-4 text-orange-600" />;
    }
  };

  const handleSave = () => {
    onStepUpdate(localStep);
    if (localBlock) {
      // Check if this is a new block
      if (localBlock.id.startsWith('block-') && !block) {
        onBlockCreate?.(localBlock);
      } else {
        onBlockUpdate(localBlock);
      }
    }
    onClose();
  };

  const handleStepChange = (field: keyof FlowStep, value: any) => {
    setLocalStep(prev => ({ ...prev, [field]: value }));
  };

  const handleBlockChange = (field: keyof FlowBlock, value: any) => {
    if (localBlock) {
      setLocalBlock(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const convertToAgent = () => {
    handleStepChange('isAgentStep', true);
    handleStepChange('blockId', undefined);
    handleStepChange('agentPrompt', '');
    handleStepChange('selectedBlocks', []);
    setLocalBlock(null);
  };

  const convertToBlock = () => {
    const blockId = `block-${Date.now()}`;
    handleStepChange('isAgentStep', false);
    handleStepChange('agentPrompt', undefined);
    handleStepChange('selectedBlocks', undefined);
    handleStepChange('blockId', blockId);
    
    // Create a new block
    const newBlock: FlowBlock = {
      id: blockId,
      type: 'collect',
      option: availableBlockOptions?.collect?.[0] || 'User Text',
      name: localStep.title
    };
    setLocalBlock(newBlock);
  };

  return (
    <div className="w-80 bg-white border-l shadow-lg overflow-y-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Configure Step</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step Type Toggle */}
        <div className="space-y-2">
          <Label>Step Type</Label>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={isAgentStep ? "default" : "outline"}
              onClick={convertToAgent}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Agent
            </Button>
            <Button
              size="sm"
              variant={!isAgentStep ? "default" : "outline"}
              onClick={convertToBlock}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Block
            </Button>
          </div>
        </div>

        {/* Step Details */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="step-title">Step Title</Label>
            <Input
              id="step-title"
              value={localStep.title}
              onChange={(e) => handleStepChange('title', e.target.value)}
              placeholder="Enter step title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="step-description">Description</Label>
            <Textarea
              id="step-description"
              value={localStep.description || ''}
              onChange={(e) => handleStepChange('description', e.target.value)}
              placeholder="Enter step description"
              rows={3}
            />
          </div>
        </div>

        {/* Agent Configuration */}
        {isAgentStep && (
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-orange-600" />
                <Badge className="bg-orange-100 text-orange-700">Agent Step</Badge>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="agent-prompt">Agent Prompt</Label>
                  <Textarea
                    id="agent-prompt"
                    value={localStep.agentPrompt || ''}
                    onChange={(e) => handleStepChange('agentPrompt', e.target.value)}
                    placeholder="Enter instructions for the agent..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Available Blocks</Label>
                  <div className="p-3 bg-white border rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {selectedBlockCount}/24 blocks selected
                      </span>
                      <Button size="sm" variant="outline">
                        Configure Blocks
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Block Configuration */}
        {!isAgentStep && localBlock && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                {getBlockIcon(localBlock.type)}
                <Badge className="bg-blue-100 text-blue-700 capitalize">
                  {localBlock.type} Block
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="block-type">Block Type</Label>
                  <Select
                    value={localBlock.type}
                    onValueChange={(value: 'collect' | 'think' | 'act' | 'agent') => {
                      const defaultOption = availableBlockOptions?.[value]?.[0] || 'User Text';
                      handleBlockChange('type', value);
                      handleBlockChange('option', defaultOption);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="collect">Collect</SelectItem>
                      <SelectItem value="think">Think</SelectItem>
                      <SelectItem value="act">Act</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="block-option">Block Option</Label>
                  <Select
                    value={localBlock.option}
                    onValueChange={(value) => handleBlockChange('option', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(availableBlockOptions?.[localBlock.type] || []).map(option => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="block-name">Block Name</Label>
                  <Input
                    id="block-name"
                    value={localBlock.name}
                    onChange={(e) => handleBlockChange('name', e.target.value)}
                    placeholder="Enter block name"
                  />
                </div>

                {localBlock.type === 'agent' && (
                  <div className="space-y-2">
                    <Label htmlFor="agent-select">Select Agent</Label>
                    <Select
                      value={localBlock.agentId || ''}
                      onValueChange={(value) => {
                        const agent = agentsData.find(a => a.id === value);
                        handleBlockChange('agentId', value);
                        handleBlockChange('agentName', agent?.name);
                      }}
                    >
                      <SelectTrigger>
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
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <Button onClick={handleSave} className="w-full">
          Save Changes
        </Button>
      </CardContent>
    </div>
  );
}