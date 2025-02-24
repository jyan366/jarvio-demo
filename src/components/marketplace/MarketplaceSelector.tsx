
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
    logo: '/lovable-uploads/bf0da1e7-7412-4d82-9167-46fa818cd337.png'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    status: 'available',
    logo: '/lovable-uploads/9153360e-039d-4318-b78b-50dcec74f7ae.png'
  },
  {
    id: 'walmart',
    name: 'Walmart',
    status: 'available',
    logo: '/lovable-uploads/d27457b3-6119-4dd1-8b60-5f86e3cbe4e3.png'
  }
];

export function MarketplaceSelector() {
  const handleConnect = (marketplaceId: string) => {
    console.log(`Connecting to ${marketplaceId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <img 
            src={marketplaces[0].logo} 
            alt="Amazon" 
            className="h-5 w-auto"
          />
          <span>Amazon</span>
          <Check className="h-4 w-4 text-green-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
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
                className="h-5 w-auto"
              />
              <span>{marketplace.name}</span>
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
