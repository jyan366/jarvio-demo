
export type TaskType = 'task' | 'flow' | 'step';

export interface UnifiedTask {
  id: string;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Done';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  task_type: TaskType;
  parent_id?: string;
  user_id: string;
  created_at: string;
  execution_order: number;
  data?: any;
  
  // Step execution tracking - simplified
  steps_completed?: number[];
  step_execution_log?: Array<{
    stepIndex: number;
    completedAt: string;
    log: string;
  }>;
  
  // For UI compatibility
  date?: string;
}

export interface TaskTreeNode extends UnifiedTask {
  children: TaskTreeNode[];
}
