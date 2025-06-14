
export interface FlowStep {
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  order: number;
}

export interface FlowBlock {
  id: string;
  type: string;
  option: string;
  name: string;
  agentId?: string;
  agentName?: string;
  steps?: FlowStep[];
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  trigger: 'manual' | 'scheduled';
  blocks: FlowBlock[];
}
