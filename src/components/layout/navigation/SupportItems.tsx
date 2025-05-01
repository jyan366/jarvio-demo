
import { Users, HelpCircle } from 'lucide-react';
import { MenuItem } from './types';

export const supportItems: MenuItem[] = [{
  icon: Users,
  label: 'Agents Hub',
  id: 'agents-hub',
  href: '/agents-hub'
}, {
  icon: HelpCircle,
  label: 'Get Support',
  id: 'get-support',
  href: '/get-support'
}];
