
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { Skeleton } from "@/components/ui/skeleton";

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
  const [isExpanded, setIsExpanded] = useState(false);
  
  const agentId = window.location.pathname.split('/').pop() || '';
  const agentSettings = settings[agentId] || { customTools: [], toolsConfig: {} };
  const isEnabled = agentSettings.customTools.includes(toolId);
  
  // React to changes in isReady and isEnabled
  useEffect(() => {
    if (isReady && isEnabled && isExpanded) {
      // Maintain expanded state when settings refresh
      setIsExpanded(true);
    }
    
    console.log(`ToolCard - ${toolId} - isReady: ${isReady}, isEnabled: ${isEnabled}`);
  }, [isReady, isEnabled, toolId]);
  
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
    
    // If turning off, collapse the expanded section
    if (!checked && isExpanded) {
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => {
    if (!isEnabled || !isReady) return;
    setIsExpanded(!isExpanded);
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
                  onClick={toggleExpand}
                  disabled={!isReady}
                >
                  {isExpanded ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Hide Configuration
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      Configure
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {isReady && isEnabled && isExpanded && configComponent && (
        <div className="border-t p-4 bg-gray-50">
          {configComponent}
        </div>
      )}
    </div>
  );
}
