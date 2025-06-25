
import { 
  CheckSquare, 
  Zap, 
  GitBranch, 
  BookOpen, 
  BarChart3, 
  Users, 
  Target,
  Brain
} from 'lucide-react';
import { MenuItem } from './types';

export const workflowItems: MenuItem[] = [
  {
    id: 'task-manager',
    label: 'Task Manager',
    href: '/task-manager',
    icon: CheckSquare
  },
  {
    id: 'insights-studio',
    label: 'Insights Studio',
    href: '/action-studio',
    icon: Brain
  },
  {
    id: 'jarvi-flows',
    label: 'Jarvi Flows',
    href: '/jarvi-flows',
    icon: GitBranch
  },
  {
    id: 'knowledge-base',
    label: 'Knowledge Base',
    href: '/knowledge-base',
    icon: BookOpen
  },
  {
    id: 'sales-hub',
    label: 'Sales Hub',
    href: '/sales-hub',
    icon: BarChart3
  },
  {
    id: 'agents-hub',
    label: 'Agents Hub',
    href: '/agents-hub',
    icon: Users
  },
  {
    id: 'ads-manager',
    label: 'Ads Manager',
    href: '/ads-manager',
    icon: Target
  }
];
