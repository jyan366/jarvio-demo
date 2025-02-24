
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

interface Marketplace {
  id: string;
  name: string;
  status: 'connected' | 'available';
  logo: string;
}

const marketplaces: Marketplace[] = [
  {
    id: 'amazon',
    name: 'Amazon',
    status: 'connected',
    logo: 'https://companieslogo.com/img/orig/AMZN-e9f942e4.png'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    status: 'available',
    logo: 'https://cdn.worldvectorlogo.com/logos/shopify.svg'
  },
  {
    id: 'walmart',
    name: 'Walmart',
    status: 'available',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Walmart_logo.svg/800px-Walmart_logo.svg.png'
  }
];

export function MarketplaceSelector() {
  const handleConnect = (marketplaceId: string) => {
    console.log(`Connecting to ${marketplaceId}`);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', e.currentTarget.src);
    // Fallback to a default icon if the image fails to load
    e.currentTarget.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="M7 8h.01"/><path d="M20.5 10.5 15 15"/><path d="M15 10.5 20.5 15"/></svg>';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <img 
            src={marketplaces[0].logo} 
            alt={marketplaces[0].name}
            className="h-5 w-5 object-contain"
            onError={handleImageError}
          />
          <span className="font-medium">{marketplaces[0].name}</span>
          <Check className="h-4 w-4 text-green-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-background">
        <DropdownMenuLabel>Marketplaces</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {marketplaces.map((marketplace) => (
          <DropdownMenuItem
            key={marketplace.id}
            className="flex items-center justify-between py-2"
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
