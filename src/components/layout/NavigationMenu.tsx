import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { NavigationMenu as NavigationMenuRoot } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  BarChart3,
  Bot,
  Building2,
  CircleDollarSign,
  ClipboardList,
  Command,
  FileText,
  FolderKanban,
  Gift,
  History,
  LayoutDashboard,
  LucideIcon,
  MessageSquare,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Star,
  Tags,
  Trophy,
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

const mainNavigation: NavigationItem[] = [
  {
    label: 'Dashboard',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Sales Hub',
    path: '/sales-hub',
    icon: CircleDollarSign,
  },
  {
    label: 'My Inventory',
    path: '/my-inventory',
    icon: Package,
  },
  {
    label: 'My Offers',
    path: '/my-offers',
    icon: Tags,
  },
];

const sellingToolsNavigation: NavigationItem[] = [
  {
    label: 'Action Studio',
    path: '/action-studio',
    icon: Command,
  },
  {
    label: 'Listing Builder',
    path: '/listing-builder',
    icon: FileText,
  },
  {
    label: 'Reports Builder',
    path: '/reports-builder',
    icon: ClipboardList,
  },
];

const insightsNavigation: NavigationItem[] = [
  {
    label: 'Advertising Insights',
    path: '/advertising-insights',
    icon: BarChart3,
  },
  {
    label: 'Competitor Insights',
    path: '/competitor-insights',
    icon: Search,
  },
  {
    label: 'Customer Insights',
    path: '/customer-insights',
    icon: Star,
  },
  {
    label: 'Listing Quality',
    path: '/listing-quality',
    icon: Trophy,
  },
];

const otherNavigation: NavigationItem[] = [
  {
    label: 'Jarvio Assistant',
    path: '/ai-assistant',
    icon: MessageSquare,
  },
  {
    label: 'Financing',
    path: '/financing',
    icon: Building2,
  },
];

export function NavigationMenu() {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <NavigationMenuRoot className="max-w-none w-full justify-start px-2">
      <div className="flex flex-col w-full gap-2">
        {mainNavigation.map(({ label, path, icon: Icon }) => (
          <Button
            key={path}
            variant={location.pathname === path ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-2"
            asChild
          >
            <Link to={path}>
              <Icon className="w-4 h-4" />
              <span className="data-[collapsible=icon]:hidden">{label}</span>
            </Link>
          </Button>
        ))}

        <Separator className="my-2" />

        <div className="px-3 mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            SELLING TOOLS
          </span>
        </div>

        {sellingToolsNavigation.map(({ label, path, icon: Icon }) => (
          <Button
            key={path}
            variant={location.pathname === path ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-2"
            asChild
          >
            <Link to={path}>
              <Icon className="w-4 h-4" />
              <span className="data-[collapsible=icon]:hidden">{label}</span>
            </Link>
          </Button>
        ))}

        <Separator className="my-2" />

        <div className="px-3 mb-2">
          <span className="text-xs font-medium text-muted-foreground">
            INSIGHTS
          </span>
        </div>

        {insightsNavigation.map(({ label, path, icon: Icon }) => (
          <Button
            key={path}
            variant={location.pathname === path ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-2"
            asChild
          >
            <Link to={path}>
              <Icon className="w-4 h-4" />
              <span className="data-[collapsible=icon]:hidden">{label}</span>
            </Link>
          </Button>
        ))}

        <Separator className="my-2" />

        {otherNavigation.map(({ label, path, icon: Icon }) => (
          <Button
            key={path}
            variant={location.pathname === path ? 'secondary' : 'ghost'}
            className="w-full justify-start gap-2"
            asChild
          >
            <Link to={path}>
              <Icon className="w-4 h-4" />
              <span className="data-[collapsible=icon]:hidden">{label}</span>
            </Link>
          </Button>
        ))}
      </div>
    </NavigationMenuRoot>
  );
}
