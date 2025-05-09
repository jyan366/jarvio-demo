
import React, { createContext, useContext, useState, useEffect } from 'react';

type ToolsConfig = Record<string, any>;

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
  isReady: boolean;
};

const AgentSettingsContext = createContext<AgentSettingsContextType | undefined>(undefined);

export const AgentSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Record<string, AgentSettings>>({});
  const [currentAgentId, setCurrentAgentId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  // Load saved settings from localStorage on mount
  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      const savedSettings = localStorage.getItem('agentSettings');
      if (savedSettings) {
        try {
          setSettings(JSON.parse(savedSettings));
        } catch (error) {
          console.error("Error parsing agent settings:", error);
        }
      }
      setIsLoading(false);
    };

    loadSettings();
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

  // Set isReady when both settings are loaded and agent ID is determined
  useEffect(() => {
    if (!isLoading && currentAgentId !== null) {
      setIsReady(true);
    }
  }, [isLoading, currentAgentId]);

  const toggleTool = (toolId: string, enabled: boolean) => {
    if (!currentAgentId || !isReady) return;

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
    if (!currentAgentId || !isReady) return;
    
    setSettings(prev => {
      const currentSettings = prev[currentAgentId] || {
        agentId: currentAgentId,
        customTools: [],
        toolsConfig: {}
      };
      
      const toolName = toolId.split('-')[1]; // extract the actual tool name like 'send-email' -> 'email'
      
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
    if (!currentAgentId || !isReady) return {};
    
    const currentSettings = settings[currentAgentId];
    if (!currentSettings) return {};
    
    const toolName = toolId.split('-')[1]; // extract the actual tool name
    return currentSettings.toolsConfig[toolName] || {};
  };

  const saveSettings = () => {
    if (!isReady) return;
    
    try {
      localStorage.setItem('agentSettings', JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving agent settings:", error);
    }
  };

  return (
    <AgentSettingsContext.Provider value={{
      settings,
      toggleTool,
      updateToolConfig,
      saveSettings,
      getToolConfig,
      isReady
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
