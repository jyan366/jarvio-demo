
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

    // Validate the response to ensure it has required fields
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response from task suggestions service');
    }

    // Ensure subtasks always have valid titles
    const validSubtasks = Array.isArray(data.subtasks)
      ? data.subtasks
          .filter(subtask => subtask && typeof subtask === 'object' && subtask.title)
          .map(subtask => ({
            title: String(subtask.title || '').trim() || 'Untitled subtask',
            description: String(subtask.description || '').trim() || 'No description provided'
          }))
      : [];

    // If there are no valid subtasks, use default ones
    const subtasks = validSubtasks.length > 0 
      ? validSubtasks
      : [
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
        ];

    return {
      title: data.title || taskContext.title || '',
      description: data.description || taskContext.description || '',
      category: data.category || taskContext.category,
      priority: data.priority || 'MEDIUM',
      subtasks
    };
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
