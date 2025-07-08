import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavigationVisibilityContext } from './NavigationSettings';
import { workflowItems } from './navigation/WorkflowItems';
import { brandToolkitItems } from './navigation/BrandToolkitItems';
import { supportItems } from './navigation/SupportItems';
import { Button } from '../ui/button';
import { NavigationSettings } from './NavigationSettings';
import { ThemeToggle } from '../ThemeToggle';
import { MarketplaceSelector } from '../marketplace/MarketplaceSelector';
import { LogOut, User } from 'lucide-react';

export function TopNavigation() {
  const { isItemVisible, isSectionVisible } = useContext(NavigationVisibilityContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/auth');
  };

  const allItems = [
    ...(isSectionVisible("workflow") ? workflowItems.filter(item => isItemVisible(item.id, 'workflow')) : []),
    ...(isSectionVisible("brand") ? brandToolkitItems.filter(item => isItemVisible(item.id, 'brand')) : []),
    ...(isSectionVisible("support") ? supportItems.filter(item => isItemVisible(item.id, 'support')) : [])
  ];

  const isTaskPage = /^\/task(\/|$)/.test(location.pathname);

  if (isTaskPage) {
    return null; // Hide navigation on task pages
  }

  return (
    <header className="border-b bg-white/90 dark:bg-gray-900/90 backdrop-blur-md">
      <div className="container flex items-center justify-between py-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img 
            src="/lovable-uploads/983c698c-2767-4609-b0fe-48e16d5a1fc0.png" 
            alt="Logo" 
            className="w-6 h-6 object-contain"
          />
          <span className="font-semibold text-lg">Jarvio</span>
        </div>

        {/* Navigation Icons */}
        <nav className="flex items-center gap-1">
          {allItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                size="sm"
                onClick={() => navigate(item.href)}
                className="flex items-center gap-2 px-3"
                title={item.label}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          <MarketplaceSelector />
          <ThemeToggle />
          <NavigationSettings />
          
          {/* User menu */}
          <div className="flex items-center gap-2 pl-2 border-l">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Demo User</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSignOut}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}