
import { Zap, GitBranch, BarChart3, Settings, Users, Globe } from 'lucide-react';
import { MenuItem } from './types';

export const workflowItems: MenuItem[] = [
  {
    label: 'My Flows',
    icon: Zap,
    href: '/jarvi-flows',
    id: 'my-flows'
  },
  {
    label: 'Community Templates',
    icon: Users,
    href: '/community-templates',
    id: 'community-templates'
  },
  {
    label: 'Flow Builder',
    icon: GitBranch,
    href: '/flow-builder',
    id: 'flow-builder'
  },
  {
    label: 'Analytics Studio',
    icon: BarChart3,
    href: '/analytics-studio',
    id: 'analytics-studio'
  },
  {
    label: 'Action Studio',
    icon: Settings,
    href: '/action-studio',
    id: 'action-studio'
  },
  {
    label: 'Pitch Deck',
    icon: Globe,
    href: '/pitch-deck',
    id: 'pitch-deck'
  }
];
