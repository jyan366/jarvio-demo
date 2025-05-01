
import React from "react";
import { Agent } from "./types";
import { AgentCard } from "./AgentCard";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AgentsListProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
}

export function AgentsList({ agents, onSelectAgent }: AgentsListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard 
          key={agent.id} 
          agent={agent} 
          onSelect={() => onSelectAgent(agent)} 
        />
      ))}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-6">
        <div className="bg-gradient-to-r from-[#9b87f5]/10 to-transparent p-6 rounded-lg border border-[#9b87f5]/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#9b87f5] flex items-center justify-center text-white font-bold text-xl">
              J
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg">Jarvio</h3>
              <p className="text-sm text-muted-foreground">Team Manager</p>
            </div>
          </div>
          <p className="mt-4">
            I coordinate your team of specialized agents and direct your questions to the right expert. Tell me your problems, and I'll identify which specialist is best suited to help you solve them quickly and effectively.
          </p>
        </div>
      </div>
    </div>
  );
}
