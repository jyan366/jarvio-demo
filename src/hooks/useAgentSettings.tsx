
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Agent } from '@/components/agents/types';

type AgentSettings = {
  agentId: string;
  enabledFlows: string[];
  customTools: string[];
};

type AgentSettingsContextType = {
  settings: Record<string, AgentSettings>;
  toggleTool: (toolId: string, enabled: boolean) => void;
  saveSettings: () => void;
};

const AgentSettingsContext = createContext<AgentSettingsContextType | undefined>(undefined);

export const AgentSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Record<string, AgentSettings>>({});
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('agentSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Extract agent ID from URL if on agent profile page
  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/\/agents-hub\/agent\/([^\/]+)/);
    if (match && match[1]) {
      setCurrentAgentId(match[1]);
    } else {
      setCurrentAgentId(null);
    }
  }, [window.location.pathname]);

  const toggleTool = (toolId: string, enabled: boolean) => {
    if (!currentAgentId) return;

    setSettings(prev => {
      const currentSettings = prev[currentAgentId] || {
        agentId: currentAgentId,
        enabledFlows: [],
        customTools: []
      };

      const customTools = enabled 
        ? [...currentSettings.customTools, toolId]
        : currentSettings.customTools.filter(id => id !== toolId);

      return {
        ...prev,
        [currentAgentId]: {
          ...currentSettings,
          customTools
        }
      };
    });
  };

  const saveSettings = () => {
    localStorage.setItem('agentSettings', JSON.stringify(settings));
  };

  return (
    <AgentSettingsContext.Provider value={{
      settings,
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
