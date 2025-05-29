
import { Zap, GitBranch, BarChart3, Settings, Users, Globe } from 'lucide-react';
import { MenuItem } from './types';

export const workflowItems: MenuItem[] = [
  {
    label: 'My Flows',
    icon: Zap,
    href: '/jarvi-flows',
    id: 'my-flows',
    description: 'Create and manage your automated workflows'
  },
  {
    label: 'Community Templates',
    icon: Users,
    href: '/community-templates',
    id: 'community-templates',
    description: 'Browse thousands of proven workflow templates'
  },
  {
    label: 'Flow Builder',
    icon: GitBranch,
    href: '/flow-builder',
    id: 'flow-builder',
    description: 'Visual workflow builder with drag & drop'
  },
  {
    label: 'Analytics Studio',
    icon: BarChart3,
    href: '/analytics-studio',
    id: 'analytics-studio',
    description: 'Advanced workflow analytics and insights'
  },
  {
    label: 'Action Studio',
    icon: Settings,
    href: '/action-studio',
    id: 'action-studio',
    description: 'Task prioritization and process automation'
  },
  {
    label: 'Pitch Deck',
    icon: Globe,
    href: '/pitch-deck',
    id: 'pitch-deck',
    description: 'Product showcase and integrations'
  }
];
