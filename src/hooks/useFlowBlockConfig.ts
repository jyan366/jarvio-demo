
import { useState } from 'react';
import { ToolConfig } from '@/components/agents/tools/toolConfigs';

export function useFlowBlockConfig() {
  const [blockConfigs, setBlockConfigs] = useState<Record<string, ToolConfig>>({});

  const updateBlockConfig = (blockId: string, config: Partial<ToolConfig>) => {
    setBlockConfigs(prev => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        ...config
      }
    }));
  };

  return {
    blockConfigs,
    updateBlockConfig
  };
}
