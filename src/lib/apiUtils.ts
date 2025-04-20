
import { InsightData } from "@/components/tasks/InsightCard";

interface SuggestedTask {
  id: string;
  name: string;
  completed: boolean;
}

export async function suggestTasks(insight: InsightData): Promise<SuggestedTask[]> {
  // Local implementation that simulates the suggest-tasks edge function
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
}
