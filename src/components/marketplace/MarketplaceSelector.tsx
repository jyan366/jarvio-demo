
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface Marketplace {
  id: string;
  name: string;
  status: 'connected' | 'available';
  logo: string;
  type: 'website' | 'marketplace';
}

const defaultMarketplaces: Marketplace[] = [
  {
    id: 'shopify',
    name: 'Shopify',
    status: 'connected',
    logo: '',
    type: 'website'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    status: 'connected',
    logo: '',
    type: 'marketplace'
  },
  {
    id: 'walmart',
    name: 'Walmart',
    status: 'available',
    logo: '',
    type: 'marketplace'
  },
  {
    id: 'ebay',
    name: 'eBay',
    status: 'available',
    logo: '',
    type: 'marketplace'
  }
];

export function MarketplaceSelector() {
  const [marketplaces, setMarketplaces] = useState<Marketplace[]>(defaultMarketplaces);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeMarketplaces = async () => {
      setIsLoading(true);
      try {
        const amazonUrl = supabase.storage
          .from('marketplace-icons')
          .getPublicUrl('amazon.png');
        
        const shopifyUrl = supabase.storage
          .from('marketplace-icons')
          .getPublicUrl('shopify.svg');
        
        const walmartUrl = supabase.storage
          .from('marketplace-icons')
          .getPublicUrl('5977595.png');

        const ebayUrl = { data: { publicUrl: 'https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/marketplace-icons//free-ebay-logo-icon-download-in-svg-png-gif-file-formats--technology-social-media-company-brand-vol-2-pack-logos-icons-2944843.webp' } };

        setMarketplaces(prev => prev.map(marketplace => {
          if (marketplace.id === 'amazon') {
            return { ...marketplace, logo: amazonUrl.data.publicUrl };
          }
          if (marketplace.id === 'shopify') {
            return { ...marketplace, logo: shopifyUrl.data.publicUrl };
          }
          if (marketplace.id === 'walmart') {
            return { ...marketplace, logo: walmartUrl.data.publicUrl };
          }
          if (marketplace.id === 'ebay') {
            return { ...marketplace, logo: ebayUrl.data.publicUrl };
          }
          return marketplace;
        }));
      } catch (error) {
        console.error('Error initializing marketplaces:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeMarketplaces();
  }, []);

  const handleConnect = (marketplaceId: string) => {
    console.log(`Connecting to ${marketplaceId}`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', e.currentTarget.src);
    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M7 8h.01"/><path d="M20.5 10.5 15 15"/><path d="M15 10.5 20.5 15"/></svg>';
  };

  if (isLoading) {
    return (
      <Button variant="outline" className="gap-2" disabled>
        Loading...
      </Button>
    );
  }

  const websites = marketplaces.filter(m => m.type === 'website');
  const marketplacesOnly = marketplaces.filter(m => m.type === 'marketplace');

  const connectedItem = marketplaces.find(m => m.status === 'connected') || marketplaces[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <img 
            src={connectedItem.logo} 
            alt={connectedItem.name}
            className="h-5 w-5 object-contain"
            onError={handleImageError}
          />
          <span className="font-medium">{connectedItem.name}</span>
          <Check className="h-4 w-4 text-green-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="text-base font-semibold">Marketplaces</DropdownMenuLabel>
        {marketplacesOnly.map((marketplace) => (
          <DropdownMenuItem
            key={marketplace.id}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center gap-2">
              <img 
                src={marketplace.logo} 
                alt={marketplace.name}
                className="h-5 w-5 object-contain"
                onError={handleImageError}
              />
              <span className="font-medium">{marketplace.name}</span>
            </div>
            {marketplace.status === 'connected' ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => handleConnect(marketplace.id)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Connect
              </Button>
            )}
          </DropdownMenuItem>
        ))}
        
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuLabel className="text-base font-semibold">Linked Websites</DropdownMenuLabel>
        {websites.map((website) => (
          <DropdownMenuItem
            key={website.id}
            className="flex items-center justify-between py-3"
          >
            <div className="flex items-center gap-2">
              <img 
                src={website.logo} 
                alt={website.name}
                className="h-5 w-5 object-contain"
                onError={handleImageError}
              />
              <span className="font-medium">{website.name}</span>
            </div>
            {website.status === 'connected' ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => handleConnect(website.id)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Connect
              </Button>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
