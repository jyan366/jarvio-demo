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
      
      <div className="fixed top-4 right-4 z-50 flex gap-2 items-center bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border">
        {onViewModeChange && (
          <ViewToggle 
            viewMode={viewMode} 
            onViewModeChange={onViewModeChange} 
          />
        )}
        
        <Button
          variant="outline"
          onClick={() => setShowAIPrompt(!showAIPrompt)}
          className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
        >
          <WandSparkles className="h-4 w-4 mr-2" />
          {showAIPrompt ? "Hide AI Builder" : "Create with AI"}
        </Button>
        
        {isManualTrigger && (
          <Button 
            onClick={onStartFlow}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={isRunningFlow || !flowHasBlocks}
          >
            {isRunningFlow ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Flow
              </>
            )}
          </Button>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className="bg-[#4457ff] hover:bg-[#4457ff]/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Flow
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white shadow-lg border border-gray-200">
            <DropdownMenuItem onClick={onSaveFlow}>
              Save
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Save as new flow")}>
              Save as New Flow
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Export flow")}>
              Export Flow JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
