import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  LayoutGrid, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CanvasToolbarProps {
  onAddStep: (type: 'block' | 'agent') => void;
  onAutoArrange: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToScreen: () => void;
  zoom: number;
}

export function CanvasToolbar({
  onAddStep,
  onAutoArrange,
  onZoomIn,
  onZoomOut,
  onFitToScreen,
  zoom
}: CanvasToolbarProps) {
  return (
    <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white rounded-lg shadow-md p-2">
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

      {/* Zoom Controls */}
      <div className="flex items-center gap-1 ml-2 border-l pl-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onZoomOut}
          disabled={zoom <= 0.5}
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-muted-foreground min-w-[50px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        
        <Button
          size="sm"
          variant="outline"
          onClick={onZoomIn}
          disabled={zoom >= 2}
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={onFitToScreen}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}