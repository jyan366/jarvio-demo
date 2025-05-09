
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Done';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  products?: any[];
  subtasks?: any[];
  comments?: any[];
  date: string;
  commentsCount?: number;
  created_at?: string;
  data?: {
    flowId?: string;
    flowTrigger?: string;
  } | any; // Allow for more flexible data type to accommodate Supabase's Json type
}
