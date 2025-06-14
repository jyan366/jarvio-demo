
export interface FlowStep {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  order: number;
}

export interface FlowBlock {
  id: string;
  type: 'collect' | 'think' | 'act' | 'agent';
  option: string;
  name: string;
  agentId?: string;
  agentName?: string;
  stepId?: string; // Added to link blocks to steps
  steps?: FlowStep[];
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  trigger: 'manual' | 'scheduled' | 'event';
  blocks: FlowBlock[];
  steps?: FlowStep[]; // Added steps to flow
}
