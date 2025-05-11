
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const agentId = window.location.pathname.split('/').pop() || '';
  const agentSettings = settings[agentId] || { customTools: [], toolsConfig: {} };
  const isEnabled = agentSettings.customTools.includes(toolId);
  
  // React to changes in isReady and isEnabled
  useEffect(() => {
    console.log(`ToolCard - ${toolId} - isReady: ${isReady}, isEnabled: ${isEnabled}, isDialogOpen: ${isDialogOpen}`);
  }, [isReady, isEnabled, toolId, isDialogOpen]);
  
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
    
    // If turning off, close the dialog if open
    if (!checked && isDialogOpen) {
      setIsDialogOpen(false);
    }
  };

  const toggleDialog = () => {
    if (!isEnabled) return; // Don't allow opening if tool is not enabled
    setIsDialogOpen(!isDialogOpen);
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
                  onClick={toggleDialog}
                >
                  <Settings className="h-3 w-3 mr-1" />
                  Configure
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Configuration Dialog */}
        {isReady && isEnabled && configComponent && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configure {title}</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {configComponent}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
