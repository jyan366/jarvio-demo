
import { CheckSquare, Box } from 'lucide-react';
import { MenuItem } from './types';

export const workflowItems: MenuItem[] = [{
  icon: CheckSquare,
  label: 'Home',
  id: 'task-manager',
  href: '/task-manager'
}, {
  icon: Box,
  label: 'Action Studio',
  id: 'action-studio',
  href: '/action-studio'
}];
