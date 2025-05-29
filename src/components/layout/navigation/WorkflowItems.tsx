
import { Zap, GitBranch, BarChart3, Settings, Users, Globe } from 'lucide-react';
import { MenuItem } from './types';

export const workflowItems: MenuItem[] = [
  {
    title: 'My Flows',
    icon: Zap,
    href: '/jarvi-flows',
    description: 'Create and manage your automated workflows'
  },
  {
    title: 'Community Templates',
    icon: Users,
    href: '/community-templates',
    description: 'Browse thousands of proven workflow templates'
  },
  {
    title: 'Flow Builder',
    icon: GitBranch,
    href: '/flow-builder',
    description: 'Visual workflow builder with drag & drop'
  },
  {
    title: 'Analytics Studio',
    icon: BarChart3,
    href: '/analytics-studio',
    description: 'Advanced workflow analytics and insights'
  },
  {
    title: 'Action Studio',
    icon: Settings,
    href: '/action-studio',
    description: 'Task prioritization and process automation'
  },
  {
    title: 'Pitch Deck',
    icon: Globe,
    href: '/pitch-deck',
    description: 'Product showcase and integrations'
  }
];
