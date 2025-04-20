import { InsightData } from "@/components/tasks/InsightCard";
import { supabase } from "@/integrations/supabase/client";

export interface SuggestedTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  // selected?: boolean; // Don't add here; selection is UI state
}

export interface GeneratedStep {
  id: string;
  title: string;
  description: string;
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
      // Robust mapping for safety from any kind of structure (future-proofing)
      return data.tasks.map((task: any) => ({
        id: task.id || crypto.randomUUID(),
        title: typeof task.title === "string" ? task.title : (task.name || "Task"),
        description: typeof task.description === "string" ? task.description : "",
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
          { id: crypto.randomUUID(), title: 'Contact customer', description: 'Reach out to the customer to resolve the issue.', completed: false },
          { id: crypto.randomUUID(), title: 'Update product listing', description: 'Revise the listing to address the concerns.', completed: false },
          { id: crypto.randomUUID(), title: 'Investigate shipping', description: 'Check if the shipping process may be improved.', completed: false }
        ];
      case 'PRICING':
        return [
          { id: crypto.randomUUID(), title: 'Analyze pricing', description: 'Research competitor pricing strategy and adjust if needed.', completed: false },
          { id: crypto.randomUUID(), title: 'Adjust pricing', description: 'Update product price to remain competitive.', completed: false },
          { id: crypto.randomUUID(), title: 'Monitor Buy Box', description: 'Track Buy Box status after price changes.', completed: false }
        ];
      case 'LISTING':
        return [
          { id: crypto.randomUUID(), title: 'Research keywords', description: 'Identify keyword opportunities for a new listing.', completed: false },
          { id: crypto.randomUUID(), title: 'Create optimized listing', description: 'Develop listing content with best practices.', completed: false },
          { id: crypto.randomUUID(), title: 'Add images', description: 'Add high-quality product photos.', completed: false }
        ];
      case 'COMPETITION':
        return [
          { id: crypto.randomUUID(), title: 'Analyze competitors', description: 'Review competitor price changes.', completed: false },
          { id: crypto.randomUUID(), title: 'Update strategy', description: 'Refine competitive positioning.', completed: false },
          { id: crypto.randomUUID(), title: 'Monitor share', description: 'Track market share and adapt tactics.', completed: false }
        ];
      default:
        return [
          { id: crypto.randomUUID(), title: 'Review details', description: 'Read insight details thoroughly.', completed: false },
          { id: crypto.randomUUID(), title: 'Create action plan', description: 'Develop a plan to address the findings.', completed: false },
          { id: crypto.randomUUID(), title: 'Schedule follow-up', description: 'Check back to ensure the issue is resolved.', completed: false }
        ];
    }
  } catch (error) {
    console.error("Error in suggestTasks function:", error);
    // Return generic fallback tasks
    return [
      { id: crypto.randomUUID(), title: 'Review details', description: 'Review the insight details.', completed: false },
      { id: crypto.randomUUID(), title: 'Create action plan', description: 'Create a step-by-step plan.', completed: false },
      { id: crypto.randomUUID(), title: 'Schedule follow-up', description: 'Verify completion.', completed: false }
    ];
  }
}

export async function generateTaskSteps(task: { title: string; description: string }): Promise<GeneratedStep[]> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-task-steps', {
      body: { title: task.title, description: task.description }
    });
    if (!error && data?.steps && Array.isArray(data.steps)) {
      return data.steps.map((s: any) => ({
        id: s.id ?? crypto.randomUUID(),
        title: typeof s.title === "string" ? s.title : "",
        description: typeof s.description === "string" ? s.description : "",
      }));
    }
    return [];
  } catch (err) {
    console.error("generateTaskSteps error", err);
    return [];
  }
}
