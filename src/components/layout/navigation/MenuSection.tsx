
import React from 'react';
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu } from '@/components/ui/sidebar';
import { MenuItem } from './types';
import { MenuItems } from './MenuItems';

interface MenuSectionProps {
  sectionId: string;
  label?: string;
  items: MenuItem[];
}

export function MenuSection({ sectionId, label, items }: MenuSectionProps) {
  return (
    <SidebarGroup>
      {label && (
        <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
          {label}
        </SidebarGroupLabel>
      )}
      <SidebarGroupContent>
        <SidebarMenu>
          <MenuItems items={items} sectionId={sectionId} />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
