import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { flowBlockOptions } from '@/data/flowBlockOptions';
import { FlowStep, FlowBlock } from '@/types/flowTypes';
import { Plus, Hash } from 'lucide-react';

interface EditableDescriptionProps {
  step: FlowStep;
  stepBlock: FlowBlock | null;
  onStepUpdate: (updates: Partial<FlowStep>) => void;
  onBlockAttach: (blockType: string, blockOption: string) => void;
  onBlockDetach: () => void;
}

export function EditableDescription({
  step,
  stepBlock,
  onStepUpdate,
  onBlockAttach,
  onBlockDetach
}: EditableDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(step.description || '');
  const [showBlockSelector, setShowBlockSelector] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onStepUpdate({ description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDescription(step.description || '');
    setIsEditing(false);
  };

  const handleBlockSelect = (blockType: string, blockOption: string) => {
    onBlockAttach(blockType, blockOption);
    setShowBlockSelector(false);
  };

  const handleBlockRemove = () => {
    onBlockDetach();
    // Remove block reference from description if it exists
    const cleanDescription = description.replace(/#\[[^\]]+\]/g, '').trim();
    setDescription(cleanDescription);
    onStepUpdate({ description: cleanDescription });
  };

  // Get all available blocks
  const allBlocks = Object.entries(flowBlockOptions).flatMap(([category, options]) =>
    options.map(option => ({ category, option }))
  );

  if (!isEditing) {
    return (
      <div className="space-y-2">
        {step.description ? (
          <div 
            className="text-sm text-gray-700 leading-relaxed cursor-pointer hover:bg-gray-50 p-2 rounded"
            onClick={() => setIsEditing(true)}
          >
            {step.description}
          </div>
        ) : (
          <div 
            className="text-sm text-gray-500 cursor-pointer hover:bg-gray-50 p-2 rounded border-dashed border-2"
            onClick={() => setIsEditing(true)}
          >
            {stepBlock ? "No instructions yet" : "Agent step - click to add description"}
          </div>
        )}
        
        <div className="flex items-center gap-2">
          {stepBlock ? (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <Hash className="w-3 h-3 mr-1" />
                {stepBlock.name}
              </Badge>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleBlockRemove}
                className="text-xs text-red-500 hover:text-red-700"
              >
                Remove block
              </Button>
            </div>
          ) : (
            <Popover open={showBlockSelector} onOpenChange={setShowBlockSelector}>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline" className="text-xs">
                  <Plus className="w-3 h-3 mr-1" />
                  Tag block
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0">
                <Command>
                  <CommandInput placeholder="Search blocks..." />
                  <CommandList>
                    <CommandEmpty>No blocks found.</CommandEmpty>
                    {Object.entries(flowBlockOptions).map(([category, options]) => (
                      <CommandGroup key={category} heading={category.charAt(0).toUpperCase() + category.slice(1)}>
                        {options.map((option) => (
                          <CommandItem
                            key={`${category}-${option}`}
                            onSelect={() => handleBlockSelect(category, option)}
                          >
                            <Hash className="w-3 h-3 mr-2" />
                            {option}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Textarea
        ref={textareaRef}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Describe what this step should do..."
        className="min-h-20"
      />
      
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleSave}>
          Save
        </Button>
        <Button size="sm" variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        
        {!stepBlock && (
          <Popover open={showBlockSelector} onOpenChange={setShowBlockSelector}>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="text-xs">
                <Plus className="w-3 h-3 mr-1" />
                Tag block
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0">
              <Command>
                <CommandInput placeholder="Search blocks..." />
                <CommandList>
                  <CommandEmpty>No blocks found.</CommandEmpty>
                  {Object.entries(flowBlockOptions).map(([category, options]) => (
                    <CommandGroup key={category} heading={category.charAt(0).toUpperCase() + category.slice(1)}>
                      {options.map((option) => (
                        <CommandItem
                          key={`${category}-${option}`}
                          onSelect={() => handleBlockSelect(category, option)}
                        >
                          <Hash className="w-3 h-3 mr-2" />
                          {option}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}