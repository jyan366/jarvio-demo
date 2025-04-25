
export interface TaskFormData {
  title: string;
  description: string;
  category: string;
  priority: string;
  status: string;
  source?: 'manual' | 'insight' | 'suggested';
  sourceData?: any;
}

export interface CreateTaskStepProps {
  taskData: TaskFormData;
  setTaskData: (data: TaskFormData) => void;
  errors: Record<string, string>;
  setErrors: (errors: Record<string, string>) => void;
  isSuggesting?: boolean;
}
