import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ReactFlowToolbarProps {
  onAddStep: (type: 'block' | 'agent') => void;
  onAutoArrange: () => void;
}

export function ReactFlowToolbar({
  onAddStep,
  onAutoArrange,
}: ReactFlowToolbarProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-3 bg-white rounded-lg shadow-md border p-2">
      {/* Add Step Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Step
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onAddStep('block')}>
            Add Block Step
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddStep('agent')}>
            Add Agent Step
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Auto Arrange */}
      <Button
        size="sm"
        variant="outline"
        onClick={onAutoArrange}
        className="flex items-center gap-2"
      >
        <LayoutGrid className="h-4 w-4" />
        Auto Arrange
      </Button>
    </div>
  );
}