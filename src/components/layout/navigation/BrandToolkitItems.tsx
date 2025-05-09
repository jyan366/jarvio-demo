
import { ShoppingCart, BarChart3, FileText, Users, Target, Megaphone, GitBranch } from 'lucide-react';
import { MenuItem } from './types';

export const brandToolkitItems: MenuItem[] = [{
  icon: ShoppingCart,
  label: 'Sales Center',
  id: 'sales-center',
  href: '/sales-hub',
  status: 'active',
  submenu: [
    { label: 'Sales Hub', href: '/sales-hub' },
    { label: 'My Offers', href: '/my-offers' },
    { label: 'Reports Builder', href: '/reports-builder' }
  ]
}, {
  icon: BarChart3,
  label: 'Inventory',
  id: 'inventory',
  href: '/inventory',
  status: 'active',
  submenu: [
    { label: 'My Inventory', href: '/inventory' },
    { label: 'Seller Reimbursements', href: '/seller-reimbursements' }
  ]
}, {
  icon: FileText,
  label: 'Listing Hub',
  id: 'listing-hub',
  href: '/listing-quality',
  status: 'active',
  submenu: [
    { label: 'Listing Quality', href: '/listing-quality' },
    { label: 'Listing Builder', href: '/listing-builder' }
  ]
}, {
  icon: Users,
  label: 'Customers',
  id: 'customers',
  href: '/customer-insights',
  status: 'active',
  submenu: [
    { label: 'Customer Insights', href: '/customer-insights' },
    { label: 'All Product Reviews', href: '/all-product-reviews' }
  ]
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
  icon: Target,
  label: 'Competitors',
  id: 'competitors',
  href: '/my-competitors',
  status: 'coming-soon',
  submenu: [
    { label: 'Competitor Insights', href: '/my-competitors' }
  ]
}, {
  icon: Megaphone,
  label: 'Advertising',
  id: 'advertising',
  href: '/ads-performance',
  status: 'coming-soon',
  submenu: [
    { label: 'Ads Performance', href: '/ads-performance' },
    { label: 'Ads Manager', href: '/ads-manager' }
  ]
}];
