import { LayoutDashboard, Box, BarChart3, ShoppingCart, Settings, FileText, ChevronDown, Users, Target, Megaphone, MessageSquare, ChevronRight, HelpCircle, DollarSign, CheckSquare } from 'lucide-react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavigationVisibilityContext } from './NavigationSettings';

interface SubMenuItem {
  label: string;
  href: string;
}

interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  id: string;
  submenu?: SubMenuItem[];
  status?: 'active' | 'coming-soon';
}

const workflowItems: MenuItem[] = [{
  icon: LayoutDashboard,
  label: 'Dashboard',
  id: 'dashboard',
  href: '/'
}, {
  icon: CheckSquare,
  label: 'Task Manager',
  id: 'task-manager',
  href: '/task-manager',
  status: 'active'
}, {
  icon: Box,
  label: 'Action Studio',
  id: 'action-studio',
  href: '/action-studio'
}];

const brandToolkitItems: MenuItem[] = [{
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

const aiAssistantItems: MenuItem[] = [{
  icon: MessageSquare,
  label: 'Jarvio Assistant',
  id: 'jarvio-assistant',
  href: '/ai-assistant'
}, {
  icon: DollarSign,
  label: 'Financing',
  id: 'financing',
  href: '/financing'
}, {
  icon: HelpCircle,
  label: 'Get Support',
  id: 'get-support',
  href: '/get-support'
}];

export function NavigationMenu() {
  const [expandedMenus, setExpandedMenus] = useState<{
    [key: string]: boolean;
  }>({});
  const location = useLocation();
  const { isItemVisible, isSectionVisible } = useContext(NavigationVisibilityContext);

  useEffect(() => {
    const newExpandedMenus: {
      [key: string]: boolean;
    } = {};
    [...workflowItems, ...brandToolkitItems, ...aiAssistantItems].forEach(item => {
      if (item.submenu) {
        const isSubmenuActive = item.submenu.some(subitem => location.pathname === subitem.href);
        if (isSubmenuActive) {
          newExpandedMenus[item.label] = true;
        }
      }
    });
    setExpandedMenus(prev => ({
      ...prev,
      ...newExpandedMenus
    }));
  }, [location.pathname]);

  const toggleSubmenu = (label: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const renderStatusIndicator = (status?: 'active' | 'coming-soon') => {
    if (!status) return null;
    return <div className="ml-auto flex items-center gap-1.5 text-xs group-data-[collapsible=icon]:hidden">
        <div className={cn("h-4 flex items-center rounded-full px-2 transition-colors duration-150", status === 'active' ? "bg-gradient-to-r from-green-500/10 to-green-500/5 text-green-600 hover:from-green-500/20 hover:to-green-500/10" : "bg-gradient-to-r from-amber-500/10 to-amber-500/5 text-amber-600 hover:from-amber-500/20 hover:to-amber-500/10")} title={status === 'active' ? 'Feature is live' : 'Demo data available'}>
          <div className={cn("w-1 h-1 rounded-full mr-1.5", status === 'active' ? "bg-green-500" : "bg-amber-500")} />
          {status === 'active' ? 'Live' : 'Demo'}
        </div>
      </div>;
  };

  const renderMenuItems = (items: MenuItem[], sectionId: string) => {
    return items.map((item, index) => {
      // Skip this item if it's not visible
      if (!isItemVisible(item.id, sectionId)) return null;
      
      return (
        <SidebarMenuItem key={index}>
          <SidebarMenuButton 
            asChild 
            tooltip={item.label} 
            data-active={location.pathname === item.href}
            className={cn(
              "p-2",
              item.id === 'task-manager' && location.pathname === item.href 
                ? "bg-[#4457ff]/20 text-[#4457ff] font-bold" 
                : item.id === 'task-manager' 
                ? "bg-[#4457ff]/10 hover:bg-[#4457ff]/20"
                : ""
            )}
          >
            <Link to={item.href} className="flex items-center gap-2">
              <item.icon className={cn(
                "w-4 h-4 shrink-0",
                item.id === 'task-manager' && location.pathname === item.href 
                  ? "text-[#4457ff] font-bold" 
                  : item.id === 'task-manager'
                  ? ""
                  : ""
              )} />
              <span className={cn(
                "group-data-[collapsible=icon]:hidden",
                item.id === 'task-manager' && location.pathname === item.href 
                  ? "font-bold" 
                  : ""
              )}>
                {item.label}
              </span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    }).filter(Boolean);
  };

  return (
    <div className="w-full h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
      {isSectionVisible("workflow") && (
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Workflow</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(workflowItems, "workflow")}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {isSectionVisible("brand") && (
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Brand Toolkit</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(brandToolkitItems, "brand")}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {isSectionVisible("support") && (
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenuItems(aiAssistantItems, "support")}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}
    </div>
  );
}
