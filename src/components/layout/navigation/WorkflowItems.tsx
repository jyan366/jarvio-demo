
import { CheckSquare, Lightbulb, Shuffle, BookOpen, MessageCirclePlus, FileText } from 'lucide-react';
import { MenuItem } from './types';

export const workflowItems: MenuItem[] = [
  {
    id: 'task-manager',
    label: 'Tasks',
    href: '/task-manager',
    icon: CheckSquare,
  },
  {
    id: 'action-studio',
    label: 'Insights',
    href: '/action-studio',
    icon: Lightbulb,
  },
  {
    id: 'jarvi-flows',
    label: 'Flows',
    href: '/jarvi-flows',
    icon: Shuffle,
  },
  {
    id: 'knowledge-base',
    label: 'Knowledge Base',
    href: '/knowledge-base',
    icon: BookOpen,
  },
  {
    id: 'new-conversation',
    label: 'Chat',
    href: '/new-conversation',
    icon: MessageCirclePlus,
  },
  {
    id: 'my-docs',
    label: 'My Docs',
    href: '/my-docs',
    icon: FileText,
  },
];
