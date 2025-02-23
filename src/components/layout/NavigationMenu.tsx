
import { LayoutDashboard, Box, BarChart3, ShoppingCart, Settings, FileText, PlusSquare } from 'lucide-react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Box, label: 'Action Studio', href: '#' },
  { icon: ShoppingCart, label: 'Sales Center', href: '#', 
    submenu: [
      { label: 'Sales Hub', href: '#' },
      { label: 'My Offers', href: '#' },
      { label: 'Reports Builder', href: '#' },
    ]
  },
  { icon: BarChart3, label: 'Inventory', href: '#',
    submenu: [
      { label: 'My Inventory', href: '#' },
    ]
  },
  { icon: FileText, label: 'Listing Hub', href: '#',
    submenu: [
      { label: 'Listing Quality', href: '#' },
      { label: 'Listing Builder', href: '#' },
    ]
  },
];

export function NavigationMenu() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item, index) => (
            <SidebarMenuItem key={index}>
              <SidebarMenuButton asChild>
                <a href={item.href} className="flex items-center space-x-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
              {item.submenu && (
                <SidebarMenu className="ml-6 mt-2">
                  {item.submenu.map((subitem, subindex) => (
                    <SidebarMenuItem key={`${index}-${subindex}`}>
                      <SidebarMenuButton asChild>
                        <a href={subitem.href} className="text-sm">
                          {subitem.label}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
