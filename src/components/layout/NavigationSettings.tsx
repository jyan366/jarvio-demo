import * as React from "react";
import { Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Create a context to share visibility settings across components
interface NavigationVisibilityContextType {
  visibleSections: string[];
  visibleItems: string[];
  toggleSection: (sectionId: string) => void;
  toggleItem: (itemId: string) => void;
  isItemVisible: (itemId: string, sectionId: string) => boolean;
  isSectionVisible: (sectionId: string) => boolean;
}

export const NavigationVisibilityContext = React.createContext<NavigationVisibilityContextType>({
  visibleSections: [],
  visibleItems: [],
  toggleSection: () => {},
  toggleItem: () => {},
  isItemVisible: () => true,
  isSectionVisible: () => true,
});

export function NavigationVisibilityProvider({ children }: { children: React.ReactNode }) {
  // Default navigation settings
  const defaultSections = ["workflow", "brand", "support"];
  const defaultItems = [
    "task-manager", "action-studio", "knowledge-base",  // Make sure knowledge-base is included
    "sales-center", "inventory", "listing-hub", "customers", "competitors", "advertising",
    "jarvio-assistant", "financing", "get-support"
  ];

  // Initialize state from localStorage or use defaults
  const [visibleSections, setVisibleSections] = React.useState<string[]>(() => {
    const stored = localStorage.getItem('visibleNavSections');
    return stored ? JSON.parse(stored) : defaultSections;
  });

  const [visibleItems, setVisibleItems] = React.useState<string[]>(() => {
    const stored = localStorage.getItem('visibleNavItems');
    return stored ? JSON.parse(stored) : defaultItems;
  });

  // Save to localStorage whenever state changes
  React.useEffect(() => {
    localStorage.setItem('visibleNavSections', JSON.stringify(visibleSections));
  }, [visibleSections]);

  React.useEffect(() => {
    localStorage.setItem('visibleNavItems', JSON.stringify(visibleItems));
  }, [visibleItems]);

  const toggleSection = (sectionId: string) => {
    setVisibleSections(current =>
      current.includes(sectionId)
        ? current.filter(id => id !== sectionId)
        : [...current, sectionId]
    );
  };

  const toggleItem = (itemId: string) => {
    setVisibleItems(current =>
      current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId]
    );
  };

  const isItemVisible = (itemId: string, sectionId: string) => {
    return visibleItems.includes(itemId) && visibleSections.includes(sectionId);
  };

  const isSectionVisible = (sectionId: string) => {
    return visibleSections.includes(sectionId);
  };

  return (
    <NavigationVisibilityContext.Provider 
      value={{ 
        visibleSections, 
        visibleItems, 
        toggleSection, 
        toggleItem, 
        isItemVisible,
        isSectionVisible 
      }}
    >
      {children}
    </NavigationVisibilityContext.Provider>
  );
}

// Navigation sections with grouped items
const navigationItems = [
  {
    section: "workflow",
    sectionLabel: "Workflow",
    items: [
      { id: "task-manager", label: "Task Manager" },
      { id: "action-studio", label: "Action Studio" },
      { id: "knowledge-base", label: "Knowledge Base" },  // Make sure Knowledge Base is included
    ]
  },
  {
    section: "brand",
    sectionLabel: "Brand Toolkit",
    items: [
      { id: "sales-center", label: "Sales Center" },
      { id: "inventory", label: "Inventory" },
      { id: "listing-hub", label: "Listing Hub" },
      { id: "customers", label: "Customers" },
      { id: "competitors", label: "Competitors" },
      { id: "advertising", label: "Advertising" },
    ]
  },
  {
    section: "support",
    sectionLabel: "Support",
    items: [
      { id: "jarvio-assistant", label: "Jarvio Assistant" },
      { id: "financing", label: "Financing" },
      { id: "get-support", label: "Get Support" },
    ]
  }
];

export function NavigationSettings() {
  const { 
    visibleSections, 
    visibleItems, 
    toggleSection, 
    toggleItem 
  } = React.useContext(NavigationVisibilityContext);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="group-data-[collapsible=icon]:hidden"
        >
          <Cog className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start" side="top">
        <div className="space-y-4">
          <h4 className="font-medium leading-none">Navigation Settings</h4>
          <Separator />
          
          {navigationItems.map((sectionGroup) => (
            <div key={sectionGroup.section} className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor={sectionGroup.section} className="font-medium">
                  {sectionGroup.sectionLabel}
                </Label>
                <Switch
                  id={sectionGroup.section}
                  checked={visibleSections.includes(sectionGroup.section)}
                  onCheckedChange={() => toggleSection(sectionGroup.section)}
                />
              </div>
              
              {visibleSections.includes(sectionGroup.section) && (
                <div className="pl-4 space-y-2 border-l border-gray-100 dark:border-gray-800">
                  {sectionGroup.items.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center justify-between"
                    >
                      <Label htmlFor={item.id} className="text-sm">
                        {item.label}
                      </Label>
                      <Switch
                        id={item.id}
                        checked={visibleItems.includes(item.id)}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="scale-75" // Using className for smaller switch instead of size prop
                      />
                    </div>
                  ))}
                </div>
              )}
              
              <Separator />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
