
import React from "react";
import {
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { agentsData } from "@/data/agentsData";

interface AgentsMenuItemsProps {
  searchValue: string;
  onSelect: (agentName: string) => void;
}

export const AgentsMenuItems: React.FC<AgentsMenuItemsProps> = ({ searchValue, onSelect }) => {
  const filteredAgents = agentsData.filter(agent => 
    searchValue === '' || 
    agent.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    agent.domain.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <CommandGroup heading="Agents">
      {filteredAgents.length > 0 ? (
        filteredAgents.map((agent) => (
          <CommandItem
            key={agent.id}
            onSelect={() => onSelect(agent.name)}
            className="py-2"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-5 h-5 rounded-full flex-shrink-0"
                style={{ backgroundColor: agent.avatarColor }}
              />
              <span>{agent.name}</span>
              <span className="text-xs text-muted-foreground ml-1">
                {agent.domain} Specialist
              </span>
            </div>
          </CommandItem>
        ))
      ) : (
        <div className="py-6 text-center text-sm text-gray-500">
          No agents found
        </div>
      )}
    </CommandGroup>
  );
};
