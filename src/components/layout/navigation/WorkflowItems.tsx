
import { CheckSquare, Lightbulb, Shuffle, BookOpen, MessageCirclePlus } from 'lucide-react';
import { MenuItem } from './types';

export const workflowItems: MenuItem[] = [
  {
    id: 'task-manager',
    title: 'Tasks',
    path: '/task-manager',
    icon: CheckSquare,
  },
  {
    id: 'action-studio',
    title: 'Insights Studio',
    path: '/action-studio',
    icon: Lightbulb,
  },
  {
    id: 'jarvi-flows',
    title: 'Flows',
    path: '/jarvi-flows',
    icon: Shuffle,
  },
  {
    id: 'knowledge-base',
    title: 'Knowledge Base',
    path: '/knowledge-base',
    icon: BookOpen,
  },
  {
    id: 'new-conversation',
    title: '+ New Conversation',
    path: '/ai-assistant',
    icon: MessageCirclePlus,
  },
];
