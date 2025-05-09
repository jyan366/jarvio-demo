
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Agent } from "@/components/agents/types";
import { agentsData } from "@/data/agentsData";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { useToast } from "@/hooks/use-toast";
import { ToolsSection } from "@/components/agents/tools/ToolsSection";
import { AgentSettingsProvider } from "@/hooks/useAgentSettings";

export default function AgentProfile() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { saveSettings } = useAgentSettings();
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
          
          <ToolsSection />

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
