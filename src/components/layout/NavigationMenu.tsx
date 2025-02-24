import { LayoutDashboard, Box, BarChart3, ShoppingCart, Settings, FileText, ChevronDown, Users, Target, Megaphone, MessageSquare, ChevronRight } from 'lucide-react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
interface SubMenuItem {
  label: string;
  href: string;
}
interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  submenu?: SubMenuItem[];
  status?: 'active' | 'coming-soon';
}
const workflowItems: MenuItem[] = [{
  icon: LayoutDashboard,
  label: 'Dashboard',
  href: '/'
}, {
  icon: Box,
  label: 'Action Studio',
  href: '/action-studio'
}];
const brandToolkitItems: MenuItem[] = [{
  icon: ShoppingCart,
  label: 'Sales Center',
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
  }, {
    label: 'Financing',
    href: '/financing'
  }]
}, {
  icon: BarChart3,
  label: 'Inventory',
  href: '#',
  status: 'active',
  submenu: [{
    label: 'My Inventory',
    href: '/inventory'
  }]
}, {
  icon: FileText,
  label: 'Listing Hub',
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
  href: '#',
  status: 'coming-soon',
  submenu: [{
    label: 'Customer Insights',
    href: '/customer-insights'
  }]
}, {
  icon: Target,
  label: 'Competitors',
  href: '#',
  status: 'coming-soon',
  submenu: [{
    label: 'My Competitors',
    href: '/my-competitors'
  }]
}, {
  icon: Megaphone,
  label: 'Advertising',
  href: '#',
  status: 'coming-soon',
  submenu: [{
    label: 'Ads Manager',
    href: '/ads-manager'
  }]
}];
const aiAssistantItems: MenuItem[] = [{
  icon: MessageSquare,
  label: 'Jarvio Assistant',
  href: '/ai-assistant'
}];
export function NavigationMenu() {
  const [expandedMenus, setExpandedMenus] = useState<{
    [key: string]: boolean;
  }>({});
  const location = useLocation();
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
  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item, index) => <SidebarMenuItem key={index}>
        {item.submenu ? <div className="w-full">
            <SidebarMenuButton onClick={() => toggleSubmenu(item.label)} tooltip={item.status === 'coming-soon' ? 'Demo data available' : item.label} className="w-full relative p-2">
              <div className="flex items-center w-full pr-2">
                <div className="flex items-center min-w-0">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="ml-2 truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                </div>
                {renderStatusIndicator(item.status)}
                <ChevronRight className={cn("w-4 h-4 ml-2 transition-transform duration-200 group-data-[collapsible=icon]:hidden", expandedMenus[item.label] ? "rotate-90" : "rotate-0")} />
              </div>
            </SidebarMenuButton>
            <div className="group-data-[collapsible=icon]:hidden">
              {expandedMenus[item.label] && <SidebarMenu className="ml-6 mt-2 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
                  {item.submenu.map((subitem, subindex) => <SidebarMenuItem key={`${index}-${subindex}`}>
                      <SidebarMenuButton asChild data-active={location.pathname === subitem.href} className="relative">
                        <Link to={subitem.href} className="text-sm">
                          {subitem.label}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>)}
                </SidebarMenu>}
            </div>
          </div> : <SidebarMenuButton asChild tooltip={item.label} data-active={location.pathname === item.href} className="p-2">
            <Link to={item.href} className="flex items-center gap-2">
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
            </Link>
          </SidebarMenuButton>}
      </SidebarMenuItem>);
  };
  return <div className="w-full h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
      <SidebarGroup>
        <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Workflow</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {renderMenuItems(workflowItems)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Brand Toolkit</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {renderMenuItems(brandToolkitItems)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">Support</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {renderMenuItems(aiAssistantItems)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>;
}