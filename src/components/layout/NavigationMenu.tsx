
import { LayoutDashboard, Box, BarChart3, ShoppingCart, Settings, FileText, ChevronDown } from 'lucide-react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { useState } from 'react';
import { Link } from 'react-router-dom';

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
];

export function NavigationMenu() {
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({});

  const toggleSubmenu = (label: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <div className="relative w-full">
                {item.submenu ? (
                  <div className="w-full">
                    <SidebarMenuButton
                      onClick={() => toggleSubmenu(item.label)}
                      className="w-full group"
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <item.icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform duration-200 ${
                            expandedMenus[item.label] ? 'transform rotate-180' : ''
                          }`}
                        />
                      </div>
                    </SidebarMenuButton>
                    {expandedMenus[item.label] && (
                      <SidebarMenu className="ml-6 mt-2">
                        {item.submenu.map((subitem, subindex) => (
                          <SidebarMenuItem key={`${index}-${subindex}`}>
                            <SidebarMenuButton asChild>
                              <Link to={subitem.href} className="text-sm">
                                {subitem.label}
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    )}
                  </div>
                ) : (
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.href} 
                      className="flex items-center gap-2"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
