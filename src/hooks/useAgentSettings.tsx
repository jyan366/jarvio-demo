
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Agent } from '@/components/agents/types';

type AgentSettings = {
  agentId: string;
  enabledFlows: string[];
  customTools: string[];
};

type AgentSettingsContextType = {
  settings: Record<string, AgentSettings>;
  selectedAgent: Agent | null;
  isSettingsOpen: boolean;
  openAgentSettings: (agent: Agent) => void;
  closeAgentSettings: () => void;
  toggleFlow: (flowId: string, enabled: boolean) => void;
  toggleTool: (toolId: string, enabled: boolean) => void;
  saveSettings: () => void;
};

const AgentSettingsContext = createContext<AgentSettingsContextType | undefined>(undefined);

export const AgentSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Record<string, AgentSettings>>({});
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('agentSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const openAgentSettings = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsSettingsOpen(true);
    
    // Initialize settings for this agent if they don't exist yet
    if (!settings[agent.id]) {
      setSettings(prev => ({
        ...prev,
        [agent.id]: {
          agentId: agent.id,
          enabledFlows: [],
          customTools: []
        }
      }));
    }
  };

  const closeAgentSettings = () => {
    setIsSettingsOpen(false);
    setSelectedAgent(null);
  };

  const toggleFlow = (flowId: string, enabled: boolean) => {
    if (!selectedAgent) return;

    setSettings(prev => {
      const currentSettings = prev[selectedAgent.id] || {
        agentId: selectedAgent.id,
        enabledFlows: [],
        customTools: []
      };

      const enabledFlows = enabled 
        ? [...currentSettings.enabledFlows, flowId]
        : currentSettings.enabledFlows.filter(id => id !== flowId);

      return {
        ...prev,
        [selectedAgent.id]: {
          ...currentSettings,
          enabledFlows
        }
      };
    });
  };

  const toggleTool = (toolId: string, enabled: boolean) => {
    if (!selectedAgent) return;

    setSettings(prev => {
      const currentSettings = prev[selectedAgent.id] || {
        agentId: selectedAgent.id,
        enabledFlows: [],
        customTools: []
      };

      const customTools = enabled 
        ? [...currentSettings.customTools, toolId]
        : currentSettings.customTools.filter(id => id !== toolId);

      return {
        ...prev,
        [selectedAgent.id]: {
          ...currentSettings,
          customTools
        }
      };
    });
  };

  const saveSettings = () => {
    localStorage.setItem('agentSettings', JSON.stringify(settings));
    closeAgentSettings();
  };

  return (
    <AgentSettingsContext.Provider value={{
      settings,
      selectedAgent,
      isSettingsOpen,
      openAgentSettings,
      closeAgentSettings,
      toggleFlow,
      toggleTool,
      saveSettings
    }}>
      {children}
    </AgentSettingsContext.Provider>
  );
};

export const useAgentSettings = () => {
  const context = useContext(AgentSettingsContext);
  if (context === undefined) {
    throw new Error('useAgentSettings must be used within an AgentSettingsProvider');
  }
  return context;
};
