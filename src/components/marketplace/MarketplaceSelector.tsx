
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
    logo: '/lovable-uploads/983c698c-2767-4609-b0fe-48e16d5a1fc0.png'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    status: 'available',
    logo: '/lovable-uploads/770367a8-bd58-49de-8601-206ba2fa4382.png'
  },
  {
    id: 'walmart',
    name: 'Walmart',
    status: 'available',
    logo: '/lovable-uploads/a48a59f9-4d43-4685-924c-1a823c56ec16.png'
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
            alt={marketplaces[0].name}
            className="h-5 w-5 object-contain"
          />
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
              />
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
