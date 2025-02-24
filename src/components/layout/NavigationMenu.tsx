
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

const workflowItems: MenuItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Box, label: 'Action Studio', href: '/action-studio' },
];

const brandToolkitItems: MenuItem[] = [
  { 
    icon: ShoppingCart, 
    label: 'Sales Center', 
    href: '#',
    status: 'active',
    submenu: [
      { label: 'Sales Hub', href: '/sales-hub' },
      { label: 'My Offers', href: '/my-offers' },
      { label: 'Reports Builder', href: '/reports-builder' },
      { label: 'Financing', href: '/financing' },
    ]
  },
  { 
    icon: BarChart3, 
    label: 'Inventory', 
    href: '#',
    status: 'active',
    submenu: [
      { label: 'My Inventory', href: '/inventory' },
    ]
  },
  { 
    icon: FileText, 
    label: 'Listing Hub', 
    href: '#',
    status: 'active',
    submenu: [
      { label: 'Listing Quality', href: '/listing-quality' },
      { label: 'Listing Builder', href: '/listing-builder' },
    ]
  },
  { 
    icon: Users, 
    label: 'Customers', 
    href: '#',
    status: 'coming-soon',
    submenu: [
      { label: 'Customer Insights', href: '/customer-insights' },
    ]
  },
  { 
    icon: Target, 
    label: 'Competitors', 
    href: '#',
    status: 'coming-soon',
    submenu: [
      { label: 'My Competitors', href: '/my-competitors' },
    ]
  },
  { 
    icon: Megaphone, 
    label: 'Advertising', 
    href: '#',
    status: 'coming-soon',
    submenu: [
      { label: 'Ads Manager', href: '/ads-manager' },
    ]
  },
];

const aiAssistantItems: MenuItem[] = [
  { icon: MessageSquare, label: 'Jarvio Assistant', href: '/ai-assistant' },
];

export function NavigationMenu() {
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();

  useEffect(() => {
    const newExpandedMenus: { [key: string]: boolean } = {};
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

  const renderStatusDot = (status?: 'active' | 'coming-soon') => {
    if (!status) return null;

    return (
      <div 
        className={cn(
          "w-1.5 h-1.5 rounded-full ml-2",
          status === 'active' ? "bg-green-500" : "bg-amber-500",
          "relative",
          "after:content-[''] after:absolute after:top-[-2px] after:left-[-2px] after:rounded-full after:w-2 after:h-2",
          status === 'active' 
            ? "after:animate-[pulse_2s_ease-in-out_infinite] after:bg-green-500/30" 
            : "after:animate-[pulse_3s_ease-in-out_infinite] after:bg-amber-500/30"
        )}
      />
    );
  };

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item, index) => (
      <SidebarMenuItem key={index}>
        {item.submenu ? (
          <div className="w-full">
            <SidebarMenuButton
              onClick={() => toggleSubmenu(item.label)}
              tooltip={item.status === 'coming-soon' ? 'Demo Data' : item.label}
              className="w-full relative p-2"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="ml-2 group-data-[collapsible=icon]:hidden">{item.label}</span>
                  {renderStatusDot(item.status)}
                </div>
                <ChevronDown className="w-4 h-4 transition-transform duration-200 group-data-[collapsible=icon]:hidden" />
              </div>
            </SidebarMenuButton>
            <div className="group-data-[collapsible=icon]:hidden">
              {expandedMenus[item.label] && (
                <SidebarMenu className="ml-6 mt-2 relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200" />
                  {item.submenu.map((subitem, subindex) => (
                    <SidebarMenuItem key={`${index}-${subindex}`}>
                      <SidebarMenuButton 
                        asChild
                        data-active={location.pathname === subitem.href}
                        className="relative"
                      >
                        <Link to={subitem.href} className="text-sm">
                          {subitem.label}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </div>
          </div>
        ) : (
          <SidebarMenuButton 
            asChild
            tooltip={item.label}
            data-active={location.pathname === item.href}
            className="p-2"
          >
            <Link 
              to={item.href} 
              className="flex items-center gap-2"
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    ));
  };

  return (
    <div className="w-full h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
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
        <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">AI Assistant</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {renderMenuItems(aiAssistantItems)}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
}
