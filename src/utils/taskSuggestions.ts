
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
    // Don't make API calls for empty or very short descriptions
    if (!taskContext.description || taskContext.description.length < 10) {
      return null;
    }
    
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
    // Return default structure instead of null to avoid downstream errors
    return {
      title: taskContext.title || '',
      description: taskContext.description || '',
      category: taskContext.category,
      priority: 'MEDIUM',
      subtasks: [
        {
          title: 'Review requirements',
          description: 'Analyze the task details and identify key requirements.'
        },
        {
          title: 'Create action plan',
          description: 'Outline steps needed to complete the task.'
        },
        {
          title: 'Implement solution',
          description: 'Execute the plan and resolve the task.'
        }
      ]
    };
  }
}
