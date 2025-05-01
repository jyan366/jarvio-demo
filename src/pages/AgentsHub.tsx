
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { FloatingChatButton } from "@/components/chat/FloatingChatButton";
import { AgentsList } from "@/components/agents/AgentsList";
import { AgentChat } from "@/components/agents/AgentChat";
import { Agent } from "@/components/agents/types";
import { agentsData } from "@/data/agentsData";

export default function AgentsHub() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  
  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
  };
  
  const handleBackToAgents = () => {
    setSelectedAgent(null);
  };
  
  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-hidden">
          {selectedAgent ? (
            <AgentChat agent={selectedAgent} onBack={handleBackToAgents} />
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-3xl font-bold">Agents Hub</h1>
                <p className="text-muted-foreground mt-2">
                  Meet your team of specialized AI agents, managed by Jarvio
                </p>
              </div>
              <AgentsList agents={agentsData} onSelectAgent={handleAgentSelect} />
            </>
          )}
        </div>
      </div>
      <FloatingChatButton />
    </MainLayout>
  );
}
