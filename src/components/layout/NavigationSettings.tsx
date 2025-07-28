
import * as React from 'react';
const { createContext, useState, useContext } = React;
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface NavigationVisibilityState {
  workflow: {
    'task-manager': boolean;
    'action-studio': boolean;
    'jarvi-flows': boolean;
    'knowledge-base': boolean;
    'new-conversation': boolean;
  };
  brand: {
    'sales-hub': boolean;
    'agents-hub': boolean;
    'ads-manager': boolean;
    'all-product-reviews': boolean;
    'my-offers': boolean;
    'reports-builder': boolean;
    'inventory': boolean;
    'seller-reimbursements': boolean;
    'listing-quality': boolean;
    'listing-builder': boolean;
    'customer-insights': boolean;
    'my-competitors': boolean;
    'ads-performance': boolean;
  };
  support: {
    'get-support': boolean;
  };
}

interface NavigationVisibilityContextType {
  isItemVisible: (itemId: string, sectionId: string) => boolean;
  isSectionVisible: (sectionId: string) => boolean;
  toggleItem: (itemId: string, sectionId: string) => void;
  toggleSection: (sectionId: string) => void;
}

const defaultState: NavigationVisibilityState = {
  workflow: {
    'task-manager': true,
    'action-studio': true,
    'jarvi-flows': true,
    'knowledge-base': true,
    'new-conversation': true,
  },
  brand: {
    'sales-hub': true,
    'agents-hub': true,
    'ads-manager': true,
    'all-product-reviews': true,
    'my-offers': true,
    'reports-builder': true,
    'inventory': true,
    'seller-reimbursements': true,
    'listing-quality': true,
    'listing-builder': true,
    'customer-insights': true,
    'my-competitors': true,
    'ads-performance': true,
  },
  support: {
    'get-support': true,
  },
};

export const NavigationVisibilityContext = createContext<NavigationVisibilityContextType>({
  isItemVisible: () => true,
  isSectionVisible: () => true,
  toggleItem: () => {},
  toggleSection: () => {},
});

export function NavigationVisibilityProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<NavigationVisibilityState>(defaultState);

  const isItemVisible = (itemId: string, sectionId: string) => {
    const section = state[sectionId as keyof NavigationVisibilityState];
    if (!section) return true;
    return section[itemId as keyof typeof section] ?? true;
  };

  const isSectionVisible = (sectionId: string) => {
    const section = state[sectionId as keyof NavigationVisibilityState];
    if (!section) return true;
    return Object.values(section).some(visible => visible);
  };

  const toggleItem = (itemId: string, sectionId: string) => {
    setState(prev => {
      const section = prev[sectionId as keyof NavigationVisibilityState];
      return {
        ...prev,
        [sectionId]: {
          ...section,
          [itemId]: !section[itemId as keyof typeof section]
        }
      };
    });
  };

  const toggleSection = (sectionId: string) => {
    const section = state[sectionId as keyof NavigationVisibilityState];
    const allVisible = Object.values(section).every(visible => visible);
    
    setState(prev => ({
      ...prev,
      [sectionId]: Object.keys(section).reduce((acc, key) => ({
        ...acc,
        [key]: !allVisible
      }), {})
    }));
  };

  return (
    <NavigationVisibilityContext.Provider value={{isItemVisible, isSectionVisible, toggleItem, toggleSection}}>
      {children}
    </NavigationVisibilityContext.Provider>
  );
}

export function NavigationSettings() {
  const { isItemVisible, isSectionVisible, toggleItem, toggleSection } = useContext(NavigationVisibilityContext);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h4 className="font-medium text-sm">Navigation Settings</h4>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="workflow-section" className="text-sm font-medium">Workflow</Label>
              <Switch
                id="workflow-section"
                checked={isSectionVisible('workflow')}
                onCheckedChange={() => toggleSection('workflow')}
              />
            </div>
            
            <div className="ml-4 space-y-2">
              {[
                { id: 'task-manager', label: 'Tasks' },
                { id: 'action-studio', label: 'Insights Studio' },
                { id: 'jarvi-flows', label: 'Flows' },
                { id: 'knowledge-base', label: 'Knowledge Base' },
                { id: 'new-conversation', label: '+ New Conversation' }
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <Label htmlFor={item.id} className="text-sm">{item.label}</Label>
                  <Switch
                    id={item.id}
                    checked={isItemVisible(item.id, 'workflow')}
                    onCheckedChange={() => toggleItem(item.id, 'workflow')}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="brand-section" className="text-sm font-medium">Brand Toolkit</Label>
              <Switch
                id="brand-section"
                checked={isSectionVisible('brand')}
                onCheckedChange={() => toggleSection('brand')}
              />
            </div>
            
            <div className="ml-4 space-y-2">
              {[
                { id: 'sales-hub', label: 'Sales Hub' },
                { id: 'agents-hub', label: 'Agents Hub' },
                { id: 'ads-manager', label: 'Ads Manager' },
                { id: 'all-product-reviews', label: 'All Product Reviews' },
                { id: 'my-offers', label: 'My Offers' },
                { id: 'reports-builder', label: 'Reports Builder' },
                { id: 'inventory', label: 'My Inventory' },
                { id: 'seller-reimbursements', label: 'Seller Reimbursements' },
                { id: 'listing-quality', label: 'Listing Quality' },
                { id: 'listing-builder', label: 'Listing Builder' },
                { id: 'customer-insights', label: 'Customer Insights' },
                { id: 'my-competitors', label: 'My Competitors' },
                { id: 'ads-performance', label: 'Ads Performance' },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <Label htmlFor={item.id} className="text-sm">{item.label}</Label>
                  <Switch
                    id={item.id}
                    checked={isItemVisible(item.id, 'brand')}
                    onCheckedChange={() => toggleItem(item.id, 'brand')}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="support-section" className="text-sm font-medium">Support</Label>
              <Switch
                id="support-section"
                checked={isSectionVisible('support')}
                onCheckedChange={() => toggleSection('support')}
              />
            </div>
            
            <div className="ml-4 space-y-2">
              {[
                { id: 'get-support', label: 'Get Support' },
              ].map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <Label htmlFor={item.id} className="text-sm">{item.label}</Label>
                  <Switch
                    id={item.id}
                    checked={isItemVisible(item.id, 'support')}
                    onCheckedChange={() => toggleItem(item.id, 'support')}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
