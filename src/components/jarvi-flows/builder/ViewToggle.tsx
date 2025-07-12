import React from 'react';
import { Button } from '@/components/ui/button';
import { List, Network } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'steps' | 'canvas';
  onViewModeChange: (mode: 'steps' | 'canvas') => void;
}

export function ViewToggle({ viewMode, onViewModeChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-muted rounded-lg p-1">
      <Button
        variant={viewMode === 'steps' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('steps')}
        className="flex items-center gap-2"
      >
        <List className="h-4 w-4" />
        Steps
      </Button>
      <Button
        variant={viewMode === 'canvas' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewModeChange('canvas')}
        className="flex items-center gap-2"
      >
        <Network className="h-4 w-4" />
        Canvas
      </Button>
    </div>
  );
}