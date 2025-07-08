
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavigationVisibilityProvider } from './NavigationSettings';
import { TopNavigation } from './TopNavigation';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
      console.log("User automatically authenticated for demo purposes");
    }
  }, [navigate]);

  // Hide controls in /task/:id pages
  const isTaskPage = /^\/task(\/|$)/.test(location.pathname);

  return (
    <NavigationVisibilityProvider>
      <div className="min-h-screen flex flex-col w-full bg-background">
        <TopNavigation />
        <main className="flex-1 overflow-auto bg-background">
          <div className={
            isTaskPage 
              ? "h-full flex flex-col flex-1 min-h-0 overflow-hidden" 
              : "container py-6 h-full flex flex-col"
          }>
            <div className="flex-1 flex flex-col min-h-0">{children}</div>
          </div>
        </main>
      </div>
    </NavigationVisibilityProvider>
  );
}
