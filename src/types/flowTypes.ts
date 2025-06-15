export interface FlowStep {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  order: number;
  blockId?: string; // Links step to a specific block
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
  trigger: 'manual' | 'scheduled' | 'webhook' | 'event';
  blocks: FlowBlock[];
  steps: FlowStep[];
}
