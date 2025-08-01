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
import { LogOut, User, Settings, Sun, Moon, Package, BookOpen } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { useTheme } from '../ThemeProvider';

export function TopNavigation() {
  const { isItemVisible, isSectionVisible } = useContext(NavigationVisibilityContext);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/auth');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Show Chat, Tasks, Flows, Insights Studio, My Products, and Docs
  const selectedItems = [
    workflowItems.find(item => item.id === 'new-conversation'), // Chat
    workflowItems.find(item => item.id === 'task-manager'), // Tasks
    workflowItems.find(item => item.id === 'jarvi-flows'), // Flows
    workflowItems.find(item => item.id === 'action-studio'), // Insights Studio
    { id: 'my-products', label: 'My Products', href: '/my-offers', icon: Package }, // My Products
    workflowItems.find(item => item.id === 'my-docs'), // Docs
  ].filter(Boolean);

  const isTaskPage = /^\/task(\/|$)/.test(location.pathname);

  if (isTaskPage) {
    return null; // Hide navigation on task pages
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-center py-4">
        {/* Centered Navigation */}
        <div className="flex items-center justify-center flex-1">
          {/* Logo on the left */}
          <div className="absolute left-6 flex items-center gap-3">
            <img 
              src="/lovable-uploads/983c698c-2767-4609-b0fe-48e16d5a1fc0.png" 
              alt="Logo" 
              className="w-6 h-6 object-contain"
            />
            <span className="font-semibold text-lg">Jarvio</span>
          </div>

          {/* Centered Navigation Pills */}
          <nav className="flex items-center gap-2 bg-muted/30 rounded-full p-1">
            {selectedItems.map((item) => {
              const isActive = location.pathname === item.href;
              const IconComponent = item.icon;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.href)}
                  className={`group rounded-full px-3 py-2 font-medium transition-all duration-200 overflow-hidden ${
                    isActive 
                      ? "bg-background text-foreground shadow-sm hover:bg-background" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <IconComponent className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-nav-active' : ''}`} />
                    <span className="opacity-0 group-hover:opacity-100 max-w-0 group-hover:max-w-24 transition-all duration-200 whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                  </div>
                </Button>
              );
            })}
          </nav>

          {/* Profile Menu */}
          <div className="absolute right-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="w-8 h-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={toggleTheme}>
                  {theme === 'light' ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
                  {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <div className="w-full">
                    <MarketplaceSelector />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <div className="w-full">
                    <NavigationSettings />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="h-4 w-4 mr-2" />
                  Demo User
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}