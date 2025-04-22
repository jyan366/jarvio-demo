
import { TrendingDown, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import type { InsightCategory } from '@/pages/ActionStudio';
import type { SeverityLevel } from '../types';

export const categoryColors: Record<Exclude<InsightCategory, 'All'>, string> = {
  Sales: 'bg-red-100 text-red-800',
  Inventory: 'bg-blue-100 text-blue-800',
  Listings: 'bg-green-100 text-green-800',
  Customers: 'bg-purple-100 text-purple-800',
  Competitors: 'bg-orange-100 text-orange-800',
  Advertising: 'bg-yellow-100 text-yellow-800'
};

export const getSeverityIcon = (severity: SeverityLevel) => {
  switch (severity) {
    case 'high':
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    case 'medium':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'low':
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};
