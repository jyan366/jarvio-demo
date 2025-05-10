
import { useState } from 'react';

export type FlowBlockConfigType = {
  // Upload Sheet config
  fileUploaded?: boolean;
  fileName?: string;
  
  // Scrape Sheet config
  sheetUrl?: string;
  
  // Email Parsing config
  emailParsing?: boolean;
  parsingEmailAddress?: string;
  
  // AI Summary config
  promptTemplate?: string;
  
  // Send Email config
  emailAddress?: string;
  emailRecipients?: string;
  emailSubject?: string;
  emailTemplate?: string;
};

interface BlockConfig {
  [blockId: string]: FlowBlockConfigType;
}

export function useFlowBlockConfig(initialConfig: BlockConfig = {}) {
  const [blockConfigs, setBlockConfigs] = useState<BlockConfig>(initialConfig);

  const getBlockConfig = (blockId: string): FlowBlockConfigType => {
    return blockConfigs[blockId] || {};
  };

  const updateBlockConfig = (blockId: string, config: Partial<FlowBlockConfigType>) => {
    setBlockConfigs(prev => ({
      ...prev,
      [blockId]: {
        ...prev[blockId],
        ...config
      }
    }));
  };

  const removeBlockConfig = (blockId: string) => {
    setBlockConfigs(prev => {
      const newConfig = { ...prev };
      delete newConfig[blockId];
      return newConfig;
    });
  };

  return {
    blockConfigs,
    getBlockConfig,
    updateBlockConfig,
    removeBlockConfig
  };
}
