
import { ShoppingCart, BarChart3, FileText, Users, Target, Megaphone } from 'lucide-react';
import { MenuItem } from './types';

export const brandToolkitItems: MenuItem[] = [{
  icon: ShoppingCart,
  label: 'Sales Center',
  id: 'sales-center',
  href: '#',
  status: 'active',
  submenu: [{
    label: 'Sales Hub',
    href: '/sales-hub'
  }, {
    label: 'My Offers',
    href: '/my-offers'
  }, {
    label: 'Reports Builder',
    href: '/reports-builder'
  }]
}, {
  icon: BarChart3,
  label: 'Inventory',
  id: 'inventory',
  href: '#',
  status: 'active',
  submenu: [{
    label: 'My Inventory',
    href: '/inventory'
  }, {
    label: 'Reimbursements',
    href: '/seller-reimbursements'
  }]
}, {
  icon: FileText,
  label: 'Listing Hub',
  id: 'listing-hub',
  href: '#',
  status: 'active',
  submenu: [{
    label: 'Listing Quality',
    href: '/listing-quality'
  }, {
    label: 'Listing Builder',
    href: '/listing-builder'
  }]
}, {
  icon: Users,
  label: 'Customers',
  id: 'customers',
  href: '#',
  status: 'active',
  submenu: [{
    label: 'Customer Insights',
    href: '/customer-insights'
  }]
}, {
  icon: Target,
  label: 'Competitors',
  id: 'competitors',
  href: '#',
  status: 'coming-soon',
  submenu: [{
    label: 'My Competitors',
    href: '/my-competitors'
  }]
}, {
  icon: Megaphone,
  label: 'Advertising',
  id: 'advertising',
  href: '#',
  status: 'coming-soon',
  submenu: [{
    label: 'Ads Performance',
    href: '/ads-performance'
  }, {
    label: 'Ads Manager',
    href: '/ads-manager'
  }]
}];
