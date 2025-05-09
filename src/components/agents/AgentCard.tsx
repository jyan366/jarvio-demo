
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, Settings } from "lucide-react";
import { Agent } from "./types";
import { useNavigate } from "react-router-dom";

interface AgentCardProps {
  agent: Agent;
  onSelect: () => void;
}

export function AgentCard({ agent, onSelect }: AgentCardProps) {
  const navigate = useNavigate();
  
  const handleSettingsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/agents-hub/agent/${agent.id}`);
  };
  
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="h-2" style={{ backgroundColor: agent.avatarColor }} />
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: agent.avatarColor }}
            >
              {agent.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg">{agent.name}</h3>
              <p className="text-sm text-muted-foreground">{agent.domain} Specialist</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={handleSettingsClick}
          >
            <Settings className="h-4 w-4" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
        
        <div className="space-y-3">
          <p className="italic text-sm text-muted-foreground">"{agent.tagline}"</p>
          <p className="text-sm">{agent.description}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 px-6 py-3">
        <Button 
          variant="outline" 
          className="w-full gap-2" 
          onClick={onSelect}
        >
          <MessageSquare className="h-4 w-4" />
          Chat with {agent.name}
        </Button>
      </CardFooter>
    </Card>
  );
}
