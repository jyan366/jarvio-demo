
import { Zap, GitBranch, BarChart3, Settings, Users, Globe, CheckSquare, ShoppingCart, Package, Star, FileText, TrendingUp, Eye, Target, DollarSign, CreditCard, Bot } from 'lucide-react';
import { MenuItem } from './types';

export const workflowItems: MenuItem[] = [
  {
    label: 'Task Manager',
    icon: CheckSquare,
    href: '/task-manager',
    id: 'task-manager'
  },
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
    label: 'Sales Hub',
    icon: ShoppingCart,
    href: '/sales-hub',
    id: 'sales-hub'
  },
  {
    label: 'My Inventory',
    icon: Package,
    href: '/my-inventory',
    id: 'my-inventory'
  },
  {
    label: 'Product Reviews',
    icon: Star,
    href: '/product-reviews',
    id: 'product-reviews'
  },
  {
    label: 'Listing Quality',
    icon: FileText,
    href: '/listing-quality',
    id: 'listing-quality'
  },
  {
    label: 'Listing Builder',
    icon: FileText,
    href: '/listing-builder',
    id: 'listing-builder'
  },
  {
    label: 'Competitor Insights',
    icon: TrendingUp,
    href: '/competitor-insights',
    id: 'competitor-insights'
  },
  {
    label: 'Customer Insights',
    icon: Eye,
    href: '/customer-insights',
    id: 'customer-insights'
  },
  {
    label: 'Advertising Insights',
    icon: Target,
    href: '/advertising-insights',
    id: 'advertising-insights'
  },
  {
    label: 'Ads Manager',
    icon: Target,
    href: '/ads-manager',
    id: 'ads-manager'
  },
  {
    label: 'Ads Performance',
    icon: BarChart3,
    href: '/ads-performance',
    id: 'ads-performance'
  },
  {
    label: 'Reports Builder',
    icon: FileText,
    href: '/reports-builder',
    id: 'reports-builder'
  },
  {
    label: 'My Offers',
    icon: DollarSign,
    href: '/my-offers',
    id: 'my-offers'
  },
  {
    label: 'Seller Reimbursements',
    icon: CreditCard,
    href: '/seller-reimbursements',
    id: 'seller-reimbursements'
  },
  {
    label: 'Financing',
    icon: CreditCard,
    href: '/financing',
    id: 'financing'
  },
  {
    label: 'AI Assistant',
    icon: Bot,
    href: '/ai-assistant',
    id: 'ai-assistant'
  },
  {
    label: 'Agents Hub',
    icon: Users,
    href: '/agents-hub',
    id: 'agents-hub'
  },
  {
    label: 'Pitch Deck',
    icon: Globe,
    href: '/pitch-deck',
    id: 'pitch-deck'
  }
];
