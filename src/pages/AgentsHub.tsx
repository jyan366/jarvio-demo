
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { AgentsList } from "@/components/agents/AgentsList";
import { AgentChat } from "@/components/agents/AgentChat";
import { GroupAgentChat } from "@/components/agents/GroupAgentChat";
import { Agent } from "@/components/agents/types";
import { agentsData } from "@/data/agentsData";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { AgentSettingsProvider } from "@/hooks/useAgentSettings";

export default function AgentsHub() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showGroupChat, setShowGroupChat] = useState(false);
  
  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowGroupChat(false);
  };
  
  const handleStartGroupChat = () => {
    setSelectedAgent(null);
    setShowGroupChat(true);
  };
  
  const handleBackToAgents = () => {
    setSelectedAgent(null);
    setShowGroupChat(false);
  };
  
  return (
    <AgentSettingsProvider>
      <MainLayout>
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-hidden">
            {selectedAgent ? (
              <AgentChat agent={selectedAgent} onBack={handleBackToAgents} />
            ) : showGroupChat ? (
              <GroupAgentChat onBack={handleBackToAgents} />
            ) : (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <div>
                    <h1 className="text-3xl font-bold">Agents Hub</h1>
                    <p className="text-muted-foreground mt-2">
                      Meet your team of specialized AI agents, coordinated by Jarvio
                    </p>
                  </div>
                  <Button 
                    onClick={handleStartGroupChat} 
                    className="bg-[#9b87f5] hover:bg-[#8a70ff]"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat with Team
                  </Button>
                </div>
                <AgentsList agents={agentsData} onSelectAgent={handleAgentSelect} />
              </>
            )}
          </div>
        </div>
      </MainLayout>
    </AgentSettingsProvider>
  );
}
