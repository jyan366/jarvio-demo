
import { InsightData } from '@/components/tasks/InsightCard';

export function mapInsightToTask(insight: InsightData, suggestedTasks?: any[]) {
  return {
    title: insight.title,
    description: insight.description,
    status: "Not Started" as const,
    priority: insight.severity === 'HIGH' ? 'HIGH' : insight.severity === 'MEDIUM' ? 'MEDIUM' : 'LOW',
    category: insight.category,
    insight_id: insight.id,
  };
}
