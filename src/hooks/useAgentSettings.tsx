
import React, { createContext, useContext, useState, useEffect } from 'react';

// Extended tool config types
type ToolConfig = {
  enabled: boolean;
  config: Record<string, any>;
};

type ToolsConfig = {
  uploadSheet?: {
    fileUploaded?: boolean;
    fileName?: string;
  };
  scrapeSheet?: {
    sheetUrl?: string;
  };
  emailParsing?: {
    emailAddress?: string;
  };
  aiSummary?: {
    promptTemplate?: string;
  };
  sendEmail?: {
    emailAddress?: string;
  };
};

type AgentSettings = {
  agentId: string;
  customTools: string[];
  toolsConfig: ToolsConfig;
};

type AgentSettingsContextType = {
  settings: Record<string, AgentSettings>;
  toggleTool: (toolId: string, enabled: boolean) => void;
  updateToolConfig: (toolId: string, config: Record<string, any>) => void;
  saveSettings: () => void;
  getToolConfig: (toolId: string) => Record<string, any>;
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
        customTools: [],
        toolsConfig: {}
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

  const updateToolConfig = (toolId: string, config: Record<string, any>) => {
    if (!currentAgentId) return;
    
    setSettings(prev => {
      const currentSettings = prev[currentAgentId] || {
        agentId: currentAgentId,
        customTools: [],
        toolsConfig: {}
      };
      
      const toolType = toolId.split('-')[0]; // extract 'collect', 'think', 'act'
      const toolName = toolId.split('-')[1]; // extract the actual tool name
      
      return {
        ...prev,
        [currentAgentId]: {
          ...currentSettings,
          toolsConfig: {
            ...currentSettings.toolsConfig,
            [toolName]: {
              ...(currentSettings.toolsConfig[toolName] || {}),
              ...config
            }
          }
        }
      };
    });
  };

  const getToolConfig = (toolId: string): Record<string, any> => {
    if (!currentAgentId) return {};
    
    const currentSettings = settings[currentAgentId];
    if (!currentSettings) return {};
    
    const toolName = toolId.split('-')[1]; // extract the actual tool name
    return currentSettings.toolsConfig[toolName] || {};
  };

  const saveSettings = () => {
    localStorage.setItem('agentSettings', JSON.stringify(settings));
  };

  return (
    <AgentSettingsContext.Provider value={{
      settings,
      toggleTool,
      updateToolConfig,
      saveSettings,
      getToolConfig
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
