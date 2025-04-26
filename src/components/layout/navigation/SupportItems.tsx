
import { MessageSquare, HelpCircle } from 'lucide-react';
import { MenuItem } from './types';

export const supportItems: MenuItem[] = [{
  icon: MessageSquare,
  label: 'Jarvio Assistant',
  id: 'jarvio-assistant',
  href: '/ai-assistant'
}, {
  icon: HelpCircle,
  label: 'Get Support',
  id: 'get-support',
  href: '/get-support'
}];
