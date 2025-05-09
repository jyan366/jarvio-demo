
import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useAgentSettings } from "@/hooks/useAgentSettings";

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
  const { settings, toggleTool } = useAgentSettings();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const agentId = window.location.pathname.split('/').pop() || '';
  const agentSettings = settings[agentId] || { customTools: [], toolsConfig: {} };
  const isEnabled = agentSettings.customTools.includes(toolId);
  
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'collect': return "bg-blue-100 text-blue-800";
      case 'think': return "bg-purple-100 text-purple-800";
      case 'act': return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleToggle = (checked: boolean) => {
    toggleTool(toolId, checked);
    // If turning off, collapse the expanded section
    if (!checked && isExpanded) {
      setIsExpanded(false);
    }
  };

  const toggleExpand = () => {
    if (!isEnabled) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="border rounded-lg mb-4 overflow-hidden">
      <div className={`p-4 ${isEnabled ? 'bg-white' : 'bg-gray-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{title}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {description}
                </p>
              </div>
              
              <Switch
                id={`tool-${toolId}`}
                checked={isEnabled}
                onCheckedChange={handleToggle}
              />
            </div>
            
            <div className="mt-2 flex items-center">
              <span className={`text-xs px-2 py-1 rounded-full inline-block ${getCategoryColor(category)}`}>
                {category}
              </span>
              
              {isEnabled && configComponent && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 h-7 text-xs"
                  onClick={toggleExpand}
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
      
      {isEnabled && isExpanded && configComponent && (
        <div className="border-t p-4 bg-gray-50">
          {configComponent}
        </div>
      )}
    </div>
  );
}
