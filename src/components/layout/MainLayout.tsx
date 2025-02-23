
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { NavigationMenu } from './NavigationMenu';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r" collapsible="icon">
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-6 shrink-0">
                <img 
                  src="/lovable-uploads/983c698c-2767-4609-b0fe-48e16d5a1fc0.png" 
                  alt="Logo" 
                  className="w-full object-contain"
                />
              </div>
              <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Jarvio</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <NavigationMenu />
          </SidebarContent>
          <SidebarFooter className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
              <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium">User Profile</p>
                <p className="text-xs text-muted-foreground">user@example.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <SidebarTrigger />
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
