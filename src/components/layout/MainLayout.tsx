
import React, { useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { NavigationMenu } from './NavigationMenu';
import { ThemeToggle } from '../ThemeToggle';
import { MarketplaceSelector } from '../marketplace/MarketplaceSelector';
import { LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      // For demo purposes, automatically authenticate the user
      localStorage.setItem('isAuthenticated', 'true');
      console.log("User automatically authenticated for demo purposes");
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/auth');
  };

  // Determine if we are in task-view mode: route matches /task/{id}
  const isTaskView = location.pathname.match(/^\/task\/[^\/]+$/);

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
          <SidebarFooter className="p-4 border-t bg-white/90 dark:bg-gray-900/90 backdrop-blur-md group-data-[collapsible=icon]:p-2">
            <div className="flex items-center justify-between group-data-[collapsible=icon]:justify-center">
              <div className="flex items-center space-x-2 group-data-[collapsible=icon]:space-x-0">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium">Demo User</p>
                  <p className="text-xs text-muted-foreground">demo@jarvio.io</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleSignOut}
                className="group-data-[collapsible=icon]:hidden"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-auto flex flex-col">
          <div className="container py-6 flex flex-col flex-1">
            <div className="flex justify-between items-center mb-6">
              <SidebarTrigger />
              <div className="flex items-center gap-2">
                {!isTaskView && (
                  <>
                    <MarketplaceSelector />
                    <ThemeToggle />
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
