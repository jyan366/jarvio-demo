import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  Loader2, 
  Play, 
  Save,
  WandSparkles, 
  ChevronDown 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ViewToggle } from './ViewToggle';

interface FlowHeaderProps {
  showAIPrompt: boolean;
  setShowAIPrompt: (show: boolean) => void;
  isManualTrigger: boolean;
  isRunningFlow: boolean;
  flowHasBlocks: boolean;
  onStartFlow: () => void;
  onSaveFlow: () => void;
  viewMode?: 'steps' | 'canvas';
  onViewModeChange?: (mode: 'steps' | 'canvas') => void;
}

export function FlowHeader({
  showAIPrompt,
  setShowAIPrompt,
  isManualTrigger,
  isRunningFlow,
  flowHasBlocks,
  onStartFlow,
  onSaveFlow,
  viewMode = 'steps',
  onViewModeChange
}: FlowHeaderProps) {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    // Go back to the previous page in browser history
    window.history.back();
  };
  
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <Button 
        variant="ghost" 
        onClick={handleBackClick}
        className="self-start"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div className="flex-1 flex justify-center">
        {onViewModeChange && (
          <ViewToggle 
            viewMode={viewMode} 
            onViewModeChange={onViewModeChange} 
          />
        )}
      </div>
      
      <div className="w-[60px]">
        {/* Empty space to balance the back button */}
      </div>
    </div>
  );
}
