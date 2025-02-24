
import { LayoutDashboard, Box, BarChart3, ShoppingCart, Settings, FileText, ChevronDown, Users, Target, Megaphone, MessageSquare, ChevronRight } from 'lucide-react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Box, label: 'Action Studio', href: '/action-studio' },
  { 
    icon: ShoppingCart, 
    label: 'Sales Center', 
    href: '#',
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
    submenu: [
      { label: 'My Inventory', href: '/inventory' },
    ]
  },
  { 
    icon: FileText, 
    label: 'Listing Hub', 
    href: '#',
    submenu: [
      { label: 'Listing Quality', href: '/listing-quality' },
      { label: 'Listing Builder', href: '/listing-builder' },
    ]
  },
  { 
    icon: Users, 
    label: 'Customers', 
    href: '#',
    submenu: [
      { label: 'Customer Insights', href: '/customer-insights' },
    ]
  },
  { 
    icon: Target, 
    label: 'Competitors', 
    href: '#',
    submenu: [
      { label: 'My Competitors', href: '/my-competitors' },
    ]
  },
  { 
    icon: Megaphone, 
    label: 'Advertising', 
    href: '#',
    submenu: [
      { label: 'Ads Manager', href: '/ads-manager' },
    ]
  },
  { icon: MessageSquare, label: 'AI Assistant', href: '/ai-assistant' },
];

export function NavigationMenu() {
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});
  const location = useLocation();

  useEffect(() => {
    const newExpandedMenus: { [key: string]: boolean } = {};
    menuItems.forEach(item => {
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

  return (
    <div className="w-full h-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
      <SidebarGroup>
        <SidebarGroupLabel className="data-[collapsible=icon]:hidden">Platform</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                {item.submenu ? (
                  <div className="w-full">
                    <SidebarMenuButton
                      onClick={() => toggleSubmenu(item.label)}
                      tooltip={item.label}
                      className="w-full relative p-2"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 shrink-0" />
                          <span className="data-[collapsible=icon]:hidden">{item.label}</span>
                        </div>
                        {expandedMenus[item.label] ? (
                          <ChevronDown className="w-4 h-4 transition-transform duration-200 data-[collapsible=icon]:hidden" />
                        ) : (
                          <ChevronRight className="w-4 h-4 transition-transform duration-200 data-[collapsible=icon]:hidden" />
                        )}
                      </div>
                    </SidebarMenuButton>
                    <div className="data-[collapsible=icon]:hidden">
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
                      <span className="data-[collapsible=icon]:hidden">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  );
}
