
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
    logo: '/lovable-uploads/f428f714-5de1-4601-bf84-87c8583025b2.png'
  },
  {
    id: 'shopify',
    name: 'Shopify',
    status: 'available',
    logo: '/lovable-uploads/3a6e08c9-e723-4940-aa76-985a8773f3f5.png'
  },
  {
    id: 'walmart',
    name: 'Walmart',
    status: 'available',
    logo: '/lovable-uploads/eb5c4b4c-cea3-4ed6-9cb3-a3256797cb36.png'
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
            className="h-5 w-auto"
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
                className="h-5 w-auto"
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
