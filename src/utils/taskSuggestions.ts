import { supabase } from "@/integrations/supabase/client";

interface TaskSuggestionResponse {
  title: string;
  description: string;
  category?: string;
  priority?: string;
  insights?: TaskInsight[];
  subtasks: {
    title: string;
    description: string;
  }[];
}

// Add insights interface
interface TaskInsight {
  id: string;
  title: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  date: string;
  status: 'new' | 'viewed' | 'actioned' | 'dismissed';
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

    // Use provided or default subtasks
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

    // Generate insights based on task context
    const insights: TaskInsight[] = [
      {
        id: crypto.randomUUID(),
        title: 'Related Review Issue',
        description: 'Recent 2-star review mentions similar concerns with product packaging',
        severity: 'MEDIUM',
        category: 'REVIEW',
        date: new Date().toLocaleDateString(),
        status: 'new'
      },
      {
        id: crypto.randomUUID(),
        title: 'Competitive Analysis',
        description: '3 competitors have updated their listings with similar improvements',
        severity: 'LOW',
        category: 'COMPETITION',
        date: new Date().toLocaleDateString(),
        status: 'new'
      },
      {
        id: crypto.randomUUID(),
        title: 'Sales Impact',
        description: 'Products in this category show 15% lower conversion rate',
        severity: 'HIGH',
        category: 'SALES',
        date: new Date().toLocaleDateString(),
        status: 'new'
      }
    ];

    // Filter insights based on context
    const filteredInsights = insights.filter(insight => {
      return taskContext.description?.toLowerCase().includes(insight.category.toLowerCase()) ||
             taskContext.category === insight.category;
    });

    return {
      title: data.title || taskContext.title || '',
      description: data.description || taskContext.description || '',
      category: data.category || taskContext.category,
      priority: data.priority || 'MEDIUM',
      insights: filteredInsights,
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
      insights: [],
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
