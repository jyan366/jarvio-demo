
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Agent } from "@/components/agents/types";
import { agentsData } from "@/data/agentsData";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { useToast } from "@/hooks/use-toast";
import { flowBlockOptions, BlockCategory } from "@/data/flowBlockOptions";

export default function AgentProfile() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { settings, toggleTool, saveSettings } = useAgentSettings();
  const { toast } = useToast();
  
  const [agent, setAgent] = useState<Agent | undefined>(undefined);

  useEffect(() => {
    // Find agent by ID
    const foundAgent = agentsData.find(agent => agent.id === agentId);
    if (foundAgent) {
      setAgent(foundAgent);
    }
  }, [agentId]);

  if (!agent) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Agent not found</h2>
            <Button onClick={() => navigate("/agents-hub")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents Hub
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const agentSettings = settings[agent.id] || {
    agentId: agent.id,
    enabledFlows: [],
    customTools: []
  };

  const handleSave = () => {
    saveSettings();
    toast({
      title: "Settings saved",
      description: `Configuration for ${agent.name} has been updated.`
    });
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate("/agents-hub")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: agent.avatarColor }}
            >
              {agent.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{agent.name}</h1>
              <p className="text-muted-foreground">{agent.domain} Specialist</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium mb-2">About</h2>
          <p className="italic text-muted-foreground mb-4">"{agent.tagline}"</p>
          <p>{agent.description}</p>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-lg font-medium mb-6">Agent Configuration</h2>
          
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground mb-4">
              Enable tools that {agent.name} can access to perform tasks.
            </p>
            
            {/* Collect Tools Section */}
            <div className="mb-8">
              <h3 className="font-medium text-md mb-4 pb-2 border-b">Collect Tools</h3>
              {Object.entries(flowBlockOptions).filter(([category]) => category === 'collect')[0][1].map(toolOption => {
                const toolId = `collect-${toolOption.toLowerCase().replace(/\s+/g, '-')}`;
                return (
                  <div key={toolId} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <h4 className="font-medium">{toolOption}</h4>
                      <p className="text-sm text-muted-foreground">
                        Access and collect data from various sources
                      </p>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mt-2 inline-block">
                        {toolOption}
                      </span>
                    </div>
                    <Switch 
                      id={`tool-${toolId}`}
                      checked={agentSettings.customTools.includes(toolId)}
                      onCheckedChange={(checked) => toggleTool(toolId, checked)}
                    />
                  </div>
                );
              })}
            </div>
            
            {/* Think Tools Section */}
            <div className="mb-8">
              <h3 className="font-medium text-md mb-4 pb-2 border-b">Think Tools</h3>
              {Object.entries(flowBlockOptions).filter(([category]) => category === 'think')[0][1].map(toolOption => {
                const toolId = `think-${toolOption.toLowerCase().replace(/\s+/g, '-')}`;
                return (
                  <div key={toolId} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <h4 className="font-medium">{toolOption}</h4>
                      <p className="text-sm text-muted-foreground">
                        Process and analyze information intelligently
                      </p>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full mt-2 inline-block">
                        {toolOption}
                      </span>
                    </div>
                    <Switch 
                      id={`tool-${toolId}`}
                      checked={agentSettings.customTools.includes(toolId)}
                      onCheckedChange={(checked) => toggleTool(toolId, checked)}
                    />
                  </div>
                );
              })}
            </div>
            
            {/* Act Tools Section */}
            <div>
              <h3 className="font-medium text-md mb-4 pb-2 border-b">Act Tools</h3>
              {Object.entries(flowBlockOptions).filter(([category]) => category === 'act')[0][1].map(toolOption => {
                const toolId = `act-${toolOption.toLowerCase().replace(/\s+/g, '-')}`;
                return (
                  <div key={toolId} className="flex items-center justify-between py-3 border-b last:border-0">
                    <div>
                      <h4 className="font-medium">{toolOption}</h4>
                      <p className="text-sm text-muted-foreground">
                        Take actions based on insights and analysis
                      </p>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mt-2 inline-block">
                        {toolOption}
                      </span>
                    </div>
                    <Switch 
                      id={`tool-${toolId}`}
                      checked={agentSettings.customTools.includes(toolId)}
                      onCheckedChange={(checked) => toggleTool(toolId, checked)}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
