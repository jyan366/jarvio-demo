
export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Not Started' | 'In Progress' | 'Done';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  products?: any[];
  subtasks?: any[];
  comments?: any[];
  date: string;
  commentsCount?: number;
}
