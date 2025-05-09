
import { Home, Zap, FileText, Brain, GitBranch, Users } from 'lucide-react';
import { MenuItem } from './types';

export const workflowItems: MenuItem[] = [{
  icon: Home,
  label: 'Task Manager',
  id: 'task-manager',
  href: '/task-manager',
  status: 'active',
}, {
  icon: Zap,
  label: 'Action Studio',
  id: 'action-studio',
  href: '/action-studio',
  status: 'active',
}, {
  icon: GitBranch,
  label: 'JarviFlows',
  id: 'jarviflows',
  href: '/jarvi-flows',
  status: 'active',
  submenu: [
    { label: 'My Flows', href: '/jarvi-flows' },
    { label: 'Flow Builder', href: '/jarvi-flows/builder' }
  ]
}, {
  icon: FileText,
  label: 'Knowledge Base',
  id: 'knowledge-base',
  href: '/knowledge-base',
  status: 'active',
}, {
  icon: Brain,
  label: 'Agents Hub',
  id: 'agents-hub',
  href: '/agents-hub',
  status: 'active',
}];
