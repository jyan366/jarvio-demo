
import { InsightCategory } from '@/pages/ActionStudio';

export type SeverityLevel = 'high' | 'medium' | 'low' | 'info';

export interface Insight {
  id: string;
  title: string;
  summary: string;
  category: Exclude<InsightCategory, 'All'>;
  severity: SeverityLevel;
  date: string;
}

export interface InsightCluster {
  id: string;
  title: string;
  description: string;
  insights: Insight[];
  category: Exclude<InsightCategory, 'All'>;
  severity: SeverityLevel;
}
