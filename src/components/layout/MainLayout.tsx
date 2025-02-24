
import React, { useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { NavigationMenu } from './NavigationMenu';
import { ThemeToggle } from '../ThemeToggle';
import { MarketplaceSelector } from '../marketplace/MarketplaceSelector';
import { LogOut, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/auth');
      }
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      // First get the session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/auth');
        return;
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      navigate('/auth');
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive"
      });
    }
  };

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
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium">User Profile</p>
                  <p className="text-xs text-muted-foreground">user@example.com</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
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
