
import { ShoppingCart, BarChart3, FileText, Users, Target, Megaphone } from 'lucide-react';
import { MenuItem } from './types';

export const brandToolkitItems: MenuItem[] = [{
  icon: ShoppingCart,
  label: 'Sales Center',
  id: 'sales-center',
  href: '/sales-hub',
  status: 'active',
}, {
  icon: BarChart3,
  label: 'Inventory',
  id: 'inventory',
  href: '/inventory',
  status: 'active',
}, {
  icon: FileText,
  label: 'Listing Hub',
  id: 'listing-hub',
  href: '/listing-quality',
  status: 'active',
}, {
  icon: Users,
  label: 'Customers',
  id: 'customers',
  href: '/customer-insights',
  status: 'active',
}, {
  icon: Target,
  label: 'Competitors',
  id: 'competitors',
  href: '/my-competitors',
  status: 'coming-soon',
}, {
  icon: Megaphone,
  label: 'Advertising',
  id: 'advertising',
  href: '/ads-performance',
  status: 'coming-soon',
}];
