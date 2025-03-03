
import { LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  inverseColor?: boolean;
}

export interface NotificationCardProps {
  title: string;
  message: string;
  actionLabel: string;
  actionLink: string;
}

export interface TaskGroupProps {
  label: string;
  count: number;
  icon: LucideIcon;
  link: string;
}

export interface ChartDataPoint {
  day: string;
  value: number;
  [key: string]: string | number;
}
