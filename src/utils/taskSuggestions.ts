
import { supabase } from "@/integrations/supabase/client";

interface TaskSuggestionResponse {
  title: string;
  description: string;
  category?: string;
  priority?: string;
  subtasks: {
    title: string;
    description: string;
  }[];
}

export async function generateEnhancedTaskSuggestions(
  taskContext: {
    title?: string;
    description?: string;
    category?: string;
    source?: string;
    data?: any;
  }
): Promise<TaskSuggestionResponse | null> {
  try {
    const { data, error } = await supabase.functions.invoke('enhanced-task-suggestions', {
      body: { context: taskContext }
    });

    if (error) {
      console.error('Error getting task suggestions:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Failed to generate task suggestions:', error);
    return null;
  }
}
