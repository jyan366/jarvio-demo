
import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { NavigationVisibilityContext } from '../NavigationSettings';
import { MenuItem } from './types';
import { 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarMenu 
} from '@/components/ui/sidebar';

interface MenuItemsProps {
  items: MenuItem[];
  sectionId: string;
}

export function MenuItems({ items, sectionId }: MenuItemsProps) {
  const location = useLocation();
  const { isItemVisible } = useContext(NavigationVisibilityContext);
  const [expandedMenus, setExpandedMenus] = React.useState<{[key: string]: boolean}>({});

  const toggleSubmenu = (label: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const renderStatusIndicator = (status?: 'active' | 'coming-soon', sectionId: string) => {
    // Only show status indicators for Brand Toolkit section
    if (!status || sectionId !== 'brand') return null;
    
    return (
      <div className="ml-auto flex items-center gap-1.5 text-xs group-data-[collapsible=icon]:hidden">
        <div className={cn(
          "h-4 flex items-center rounded-full px-2 transition-colors duration-150",
          status === 'active' 
            ? "bg-gradient-to-r from-green-500/10 to-green-500/5 text-green-600 hover:from-green-500/20 hover:to-green-500/10" 
            : "bg-gradient-to-r from-amber-500/10 to-amber-500/5 text-amber-600 hover:from-amber-500/20 hover:to-amber-500/10"
        )} title={status === 'active' ? 'Feature is live' : 'Demo data available'}>
          <div className={cn(
            "w-1 h-1 rounded-full mr-1.5",
            status === 'active' ? "bg-green-500" : "bg-amber-500"
          )} />
          {status === 'active' ? 'Live' : 'Demo'}
        </div>
      </div>
    );
  };

  return items.map((item, index) => {
    if (!isItemVisible(item.id, sectionId)) return null;
    
    return (
      <SidebarMenuItem key={index}>
        {item.submenu ? (
          <div className="w-full">
            <SidebarMenuButton 
              onClick={() => toggleSubmenu(item.label)} 
              tooltip={item.status === 'coming-soon' ? 'Demo data available' : item.label} 
              className="w-full relative p-2"
            >
              <div className="flex items-center w-full pr-2">
                <div className="flex items-center min-w-0">
                  <item.icon className="w-4 h-4 shrink-0" />
                  <span className="ml-2 truncate group-data-[collapsible=icon]:hidden">{item.label}</span>
                </div>
                {renderStatusIndicator(item.status, sectionId)}
                <ChevronRight className={cn(
                  "w-4 h-4 ml-2 transition-transform duration-200 group-data-[collapsible=icon]:hidden",
                  expandedMenus[item.label] ? "rotate-90" : "rotate-0"
                )} />
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
            className={cn(
              "p-2",
              item.id === 'task-manager' && "bg-[#4457ff]/10 hover:bg-[#4457ff]/20 text-[#4457ff] font-semibold"
            )}
          >
            <Link to={item.href} className="flex items-center gap-2">
              <item.icon className={cn(
                "w-4 h-4 shrink-0",
                item.id === 'task-manager' && "text-[#4457ff]"
              )} />
              <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
              {renderStatusIndicator(item.status, sectionId)}
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    );
  });
}
