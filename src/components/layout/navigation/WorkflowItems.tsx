
import { Zap, GitBranch, BarChart3, Settings, Users, Globe } from 'lucide-react';
import { MenuItem } from './types';

export const workflowItems: MenuItem[] = [
  {
    name: 'My Flows',
    icon: Zap,
    href: '/jarvi-flows',
    description: 'Create and manage your automated workflows'
  },
  {
    name: 'Community Templates',
    icon: Users,
    href: '/community-templates',
    description: 'Browse thousands of proven workflow templates'
  },
  {
    name: 'Flow Builder',
    icon: GitBranch,
    href: '/flow-builder',
    description: 'Visual workflow builder with drag & drop'
  },
  {
    name: 'Analytics Studio',
    icon: BarChart3,
    href: '/analytics-studio',
    description: 'Advanced workflow analytics and insights'
  },
  {
    name: 'Action Studio',
    icon: Settings,
    href: '/action-studio',
    description: 'Task prioritization and process automation'
  },
  {
    name: 'Pitch Deck',
    icon: Globe,
    href: '/pitch-deck',
    description: 'Product showcase and integrations'
  }
];
