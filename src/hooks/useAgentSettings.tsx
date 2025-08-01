
import * as React from 'react';
const { createContext, useContext, useState, useEffect } = React;
import { supabase } from "@/integrations/supabase/client";

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
  const [userId, setUserId] = useState<string>('00000000-0000-0000-0000-000000000000'); // Default to demo user

  // Ensure we have a user ID
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUserId(session?.user?.id || '00000000-0000-0000-0000-000000000000');
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Extract agent ID from URL immediately when component mounts and when URL changes
  useEffect(() => {
    const extractAgentIdFromUrl = () => {
      const path = window.location.pathname;
      console.log("Current path:", path);
      const match = path.match(/\/agents-hub\/agent\/([^\/]+)/);
      if (match && match[1]) {
        const newAgentId = match[1];
        console.log("Extracted agent ID:", newAgentId);
        setCurrentAgentId(newAgentId);
      } else {
        console.log("No agent ID found in URL");
        setCurrentAgentId(null);
      }
    };

    // Extract ID immediately on mount
    extractAgentIdFromUrl();

    // Set up listener for URL changes
    const handleLocationChange = () => {
      console.log("Location changed, extracting agent ID");
      extractAgentIdFromUrl();
    };

    // Listen for popstate events (browser back/forward)
    window.addEventListener('popstate', handleLocationChange);
    
    // For React Router navigation (doesn't trigger popstate)
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
      const result = originalPushState.apply(this, args);
      handleLocationChange();
      return result;
    };

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      // Restore original pushState
      history.pushState = originalPushState;
    };
  }, []);

  // Load settings from database when agent ID or user ID changes
  useEffect(() => {
    const loadSettings = async () => {
      if (!currentAgentId) {
        console.log("No agent ID available, not loading settings");
        setIsLoading(false);
        return;
      }

      console.log("Loading settings for agent ID:", currentAgentId);
      setIsLoading(true);
      
      try {
        // Get settings for all agents for this user
        const { data, error } = await supabase
          .from('agent_settings')
          .select('agent_id, custom_tools, tools_config')
          .eq('user_id', userId);
        
        if (error) {
          console.error("Error loading agent settings:", error);
          setIsLoading(false);
          return;
        }

        console.log("Settings data loaded:", data);
        
        // Convert array of records to Record<agentId, AgentSettings>
        const settingsMap: Record<string, AgentSettings> = {};
        data.forEach(record => {
          // Fix type conversion issue - ensure toolsConfig is an object
          let parsedToolsConfig: ToolsConfig = {};
          
          if (record.tools_config && typeof record.tools_config === 'object') {
            parsedToolsConfig = record.tools_config as ToolsConfig;
          }
            
          settingsMap[record.agent_id] = {
            agentId: record.agent_id,
            customTools: record.custom_tools || [],
            toolsConfig: parsedToolsConfig
          };
        });
        
        setSettings(settingsMap);
        console.log("Settings loaded and processed:", settingsMap);
      } catch (error) {
        console.error("Error in loadSettings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, [currentAgentId, userId]);

  // Set isReady when settings are loaded and agent ID is determined
  useEffect(() => {
    if (!isLoading && currentAgentId !== null) {
      console.log("Settings are ready for agent:", currentAgentId);
      // Force isReady to true when not loading and we have an agent ID
      setIsReady(true);
    } else {
      console.log("Settings are not ready:", { isLoading, currentAgentId });
      setIsReady(false);
    }
  }, [isLoading, currentAgentId]);

  const toggleTool = (toolId: string, enabled: boolean) => {
    if (!currentAgentId || !isReady) return;
    console.log(`Toggle tool ${toolId} to ${enabled}`);
    
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

  const saveSettings = async () => {
    if (!isReady || !currentAgentId) return;
    
    try {
      const currentSettings = settings[currentAgentId];
      if (!currentSettings) return;
      
      // Check if settings already exist for this agent
      const { data, error: fetchError } = await supabase
        .from('agent_settings')
        .select('id')
        .eq('agent_id', currentAgentId)
        .eq('user_id', userId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        console.error("Error checking agent settings:", fetchError);
        return;
      }
      
      if (data?.id) {
        // Update existing settings
        const { error } = await supabase
          .from('agent_settings')
          .update({
            custom_tools: currentSettings.customTools,
            tools_config: currentSettings.toolsConfig,
            updated_at: new Date().toISOString() // Convert Date to ISO string
          })
          .eq('id', data.id);
          
        if (error) {
          console.error("Error updating agent settings:", error);
        }
      } else {
        // Insert new settings
        const { error } = await supabase
          .from('agent_settings')
          .insert({
            agent_id: currentAgentId,
            user_id: userId,
            custom_tools: currentSettings.customTools,
            tools_config: currentSettings.toolsConfig
          });
          
        if (error) {
          console.error("Error inserting agent settings:", error);
        }
      }
    } catch (error) {
      console.error("Error saving agent settings:", error);
    }
  };

  // Create default settings if none exist for current agent
  useEffect(() => {
    if (currentAgentId && !settings[currentAgentId] && !isLoading) {
      console.log("Creating default settings for agent:", currentAgentId);
      setSettings(prev => ({
        ...prev,
        [currentAgentId]: {
          agentId: currentAgentId,
          customTools: [],
          toolsConfig: {}
        }
      }));
    }
  }, [currentAgentId, settings, isLoading]);

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
