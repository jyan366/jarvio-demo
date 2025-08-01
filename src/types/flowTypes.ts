
export interface FlowStep {
  id: string;
  title: string;
  description?: string;
  useDescription?: boolean; // Toggle between description and AI instructions
  completed?: boolean;
  order: number;
  blockId?: string; // Links step to a specific block
  // Canvas-specific fields:
  canvasPosition?: { x: number; y: number };
  isAgentStep?: boolean;
  agentPrompt?: string;
  selectedBlocks?: string[]; // Block IDs for agent steps
  stepType?: 'unselected' | 'agent' | 'block'; // New field to track step type
}

export interface FlowBlock {
  id: string;
  type: 'collect' | 'think' | 'act' | 'agent';
  option: string;
  name: string;
  agentId?: string;
  agentName?: string;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  trigger: 'manual' | 'scheduled' | 'webhook' | 'event' | 'insight';
  blocks: FlowBlock[];
  steps: FlowStep[];
}
