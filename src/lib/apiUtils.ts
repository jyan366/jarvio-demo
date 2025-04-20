
import { InsightData } from "@/components/tasks/InsightCard";
import { supabase } from "@/integrations/supabase/client";

interface SuggestedTask {
  id: string;
  name: string;
  completed: boolean;
}

export async function suggestTasks(insight: InsightData): Promise<SuggestedTask[]> {
  try {
    console.log("Suggesting tasks for insight:", insight);
    
    // Try to call the edge function first
    const { data, error } = await supabase.functions.invoke('suggest-tasks', {
      body: { insight }
    });

    if (data?.tasks && Array.isArray(data.tasks) && data.tasks.length > 0 && !error) {
      console.log("Successfully received tasks from edge function:", data.tasks);
      return data.tasks.map((task: any) => ({
        id: task.id || crypto.randomUUID(),
        name: task.name || "Task",
        completed: task.completed === true ? task.completed : false
      }));
    } else if (error) {
      console.warn("Edge function error, using local fallback:", error.message);
    }

    // Local fallback implementation if edge function fails
    console.log("Using local fallback for task suggestions based on category:", insight.category);
    switch (insight.category) {
      case 'REVIEW':
        return [
          { id: crypto.randomUUID(), name: 'Contact customer to resolve the issue', completed: false },
          { id: crypto.randomUUID(), name: 'Update product listing to address concerns', completed: false },
          { id: crypto.randomUUID(), name: 'Investigate shipping process for improvements', completed: false }
        ];
      case 'PRICING':
        return [
          { id: crypto.randomUUID(), name: 'Analyze competitor pricing strategy', completed: false },
          { id: crypto.randomUUID(), name: 'Adjust pricing to remain competitive', completed: false },
          { id: crypto.randomUUID(), name: 'Monitor Buy Box status after price changes', completed: false }
        ];
      case 'LISTING':
        return [
          { id: crypto.randomUUID(), name: 'Research keyword opportunities for new listing', completed: false },
          { id: crypto.randomUUID(), name: 'Create product listing with optimized content', completed: false },
          { id: crypto.randomUUID(), name: 'Add high-quality product images', completed: false }
        ];
      case 'COMPETITION':
        return [
          { id: crypto.randomUUID(), name: 'Analyze competitor price changes', completed: false },
          { id: crypto.randomUUID(), name: 'Update competitive positioning strategy', completed: false },
          { id: crypto.randomUUID(), name: 'Monitor market share and adjust tactics', completed: false }
        ];
      default:
        return [
          { id: crypto.randomUUID(), name: 'Review insight details thoroughly', completed: false },
          { id: crypto.randomUUID(), name: 'Create action plan to address findings', completed: false },
          { id: crypto.randomUUID(), name: 'Schedule follow-up to verify resolution', completed: false }
        ];
    }
  } catch (error) {
    console.error("Error in suggestTasks function:", error);
    // Return generic fallback tasks in case of any error
    return [
      { id: crypto.randomUUID(), name: 'Review insight details', completed: false },
      { id: crypto.randomUUID(), name: 'Create action plan', completed: false },
      { id: crypto.randomUUID(), name: 'Schedule follow-up', completed: false }
    ];
  }
}
