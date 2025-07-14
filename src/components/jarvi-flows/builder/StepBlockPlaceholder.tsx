import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Database, Brain, Zap, User, X, Settings } from 'lucide-react';
import { FlowBlock, FlowStep } from '@/types/flowTypes';
import { agentsData } from '@/data/agentsData';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { BlockConfigDialog } from './BlockConfigDialog';

interface StepBlockPlaceholderProps {
  step: FlowStep;
  onBlockAttached: (stepId: string, block: FlowBlock) => void;
  onBlockDetached: (stepId: string) => void;
  onBlockConfigured: (block: FlowBlock) => void;
  attachedBlock?: FlowBlock | null;
  availableBlockOptions?: Record<string, string[]>;
}

export function StepBlockPlaceholder({
  step,
  onBlockAttached,
  onBlockDetached,
  onBlockConfigured,
  attachedBlock,
  availableBlockOptions = {}
}: StepBlockPlaceholderProps) {
  const [isAttaching, setIsAttaching] = useState(false);
  const [selectedType, setSelectedType] = useState<'collect' | 'think' | 'act' | 'agent'>('collect');
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [availableOptions, setAvailableOptions] = useState<string[]>([]);
  const [showBlockConfig, setShowBlockConfig] = useState(false);

  // Load available options from database when type changes
  useEffect(() => {
    const loadOptionsForType = async () => {
      try {
        const { data, error } = await supabase
          .from('flow_block_configs')
          .select('block_name')
          .eq('block_type', selectedType)
          .order('block_name');

        if (error) {
          console.error('Error fetching block options:', error);
          setAvailableOptions(availableBlockOptions[selectedType] || []);
          return;
        }

        const options = data?.map(item => item.block_name) || [];
        setAvailableOptions(options);
        
        // Set first option as default
        if (options.length > 0 && !selectedOption) {
          setSelectedOption(options[0]);
        }
      } catch (error) {
        console.error('Error loading options:', error);
        setAvailableOptions(availableBlockOptions[selectedType] || []);
      }
    };

    loadOptionsForType();
  }, [selectedType, availableBlockOptions]);

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
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'think':
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      case 'act':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'agent':
        return 'bg-orange-50 border-orange-200 hover:bg-orange-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const handleAttachBlock = () => {
    if (!selectedOption) return;

    const newBlock: FlowBlock = {
      id: uuidv4(),
      type: selectedType,
      option: selectedOption,
      name: selectedOption
    };

    onBlockAttached(step.id, newBlock);
    setIsAttaching(false);
    setSelectedOption('');
  };

  const handleDetachBlock = () => {
    onBlockDetached(step.id);
  };

  const handleConfigureBlock = () => {
    if (attachedBlock) {
      setShowBlockConfig(true);
    }
  };

  if (attachedBlock) {
    return (
      <>
        <Card className={`mt-3 transition-colors ${getBlockColor(attachedBlock.type)}`}>
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getBlockIcon(attachedBlock.type)}
                <Badge variant="outline" className="capitalize text-xs">
                  {attachedBlock.type}
                </Badge>
                <span className="text-sm font-medium">{attachedBlock.name}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleConfigureBlock}
                  className="h-6 w-6 p-0"
                >
                  <Settings className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDetachBlock}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {showBlockConfig && (
          <BlockConfigDialog
            isOpen={showBlockConfig}
            onClose={() => setShowBlockConfig(false)}
            block={attachedBlock}
          />
        )}
      </>
    );
  }

  if (isAttaching) {
    return (
      <Card className="mt-3 border-dashed border-gray-300">
        <CardContent className="p-3 space-y-3">
          <div className="text-sm font-medium text-gray-700">Connect Block or Use Agent</div>
          
          <div className="grid grid-cols-2 gap-2">
            <Select value={selectedType} onValueChange={(value: any) => setSelectedType(value)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="collect">Collect Data</SelectItem>
                <SelectItem value="think">Process & Analyze</SelectItem>
                <SelectItem value="act">Take Action</SelectItem>
                <SelectItem value="agent">Use AI Agent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedOption} onValueChange={setSelectedOption}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Choose option..." />
              </SelectTrigger>
              <SelectContent>
                {availableOptions.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleAttachBlock} 
              disabled={!selectedOption}
              className="h-7 text-xs"
            >
              Attach Block
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setIsAttaching(false)}
              className="h-7 text-xs"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-3 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer">
      <CardContent className="p-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsAttaching(true)}
          className="w-full h-8 text-gray-600 hover:text-gray-800 justify-start"
        >
          <Plus className="w-4 h-4 mr-2" />
          Connect Block or Use Agent
        </Button>
      </CardContent>
    </Card>
  );
}