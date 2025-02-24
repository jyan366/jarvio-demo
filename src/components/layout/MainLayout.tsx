
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { NavigationMenu } from './NavigationMenu';
import { ThemeToggle } from '../ThemeToggle';
import { MarketplaceSelector } from '../marketplace/MarketplaceSelector';
import { User } from 'lucide-react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r" collapsible="icon">
          <SidebarHeader className="p-4 border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
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
          <SidebarFooter className="p-4 border-t bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="group-data-[collapsible=icon]:hidden">
                <p className="text-sm font-medium">User Profile</p>
                <p className="text-xs text-muted-foreground">user@example.com</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-auto">
          <div className="container py-6">
            <div className="flex justify-between items-center mb-6">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                <MarketplaceSelector />
                <ThemeToggle />
              </div>
            </div>
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
