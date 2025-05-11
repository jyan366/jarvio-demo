
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ToolCardProps {
  toolId: string;
  title: string;
  description: string;
  category: string;
  configComponent?: React.ReactNode;
}

export function ToolCard({ 
  toolId, 
  title, 
  description, 
  category, 
  configComponent 
}: ToolCardProps) {
  const { settings, toggleTool, isReady, getToolConfig } = useAgentSettings();
  const [configDialogOpen, setConfigDialogOpen] = useState(false);
  
  const agentId = window.location.pathname.split('/').pop() || '';
  const agentSettings = settings[agentId] || { customTools: [], toolsConfig: {} };
  const isEnabled = agentSettings.customTools.includes(toolId);
  
  // Log for debugging
  useEffect(() => {
    console.log(`ToolCard - ${toolId} - isReady: ${isReady}, isEnabled: ${isEnabled}, configDialogOpen: ${configDialogOpen}`);
  }, [isReady, isEnabled, toolId, configDialogOpen]);
  
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'collect': return "bg-blue-100 text-blue-800";
      case 'think': return "bg-purple-100 text-purple-800";
      case 'act': return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleToggle = (checked: boolean) => {
    if (!isReady) return;
    console.log("Toggle triggered:", checked, toolId);
    toggleTool(toolId, checked);
    
    // If turning off, close configuration dialog if open
    if (!checked && configDialogOpen) {
      setConfigDialogOpen(false);
    }
  };

  const toggleConfigDialog = () => {
    if (!isEnabled) return; // Don't allow opening if tool is not enabled
    console.log("Toggle config dialog for:", toolId, "Current state:", configDialogOpen, "Setting to:", !configDialogOpen);
    setConfigDialogOpen(!configDialogOpen);
  };

  return (
    <div className="border rounded-lg mb-4 overflow-hidden shadow-sm">
      <div className={`p-4 ${isEnabled ? 'bg-white' : 'bg-gray-50'}`}>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium text-lg">{title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              </div>
              
              {!isReady ? (
                <Skeleton className="w-10 h-5 rounded-full" />
              ) : (
                <Switch
                  id={`tool-${toolId}`}
                  checked={isEnabled}
                  onCheckedChange={handleToggle}
                  className="cursor-pointer"
                  disabled={!isReady}
                />
              )}
            </div>
            
            <div className="mt-3 flex items-center">
              <span className={`text-xs px-2 py-1 rounded-full inline-block ${getCategoryColor(category)}`}>
                {category}
              </span>
              
              {isReady && isEnabled && configComponent && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-7 text-xs"
                  onClick={toggleConfigDialog}
                >
                  <ChevronDown className="h-3 w-3 mr-1" />
                  Configure
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Configuration Dialog */}
      {isReady && configComponent && (
        <Dialog open={configDialogOpen} onOpenChange={setConfigDialogOpen}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Configure {title}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              {configComponent}
            </div>
            <DialogFooter>
              <Button onClick={() => setConfigDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
