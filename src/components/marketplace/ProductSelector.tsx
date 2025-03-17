
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
}

interface ProductSelectorProps {
  products: Product[];
  selectedProducts: string[];
  onProductSelect: (productId: string) => void;
}

export function ProductSelector({ products, selectedProducts, onProductSelect }: ProductSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Find the displayed product name
  const displayText = selectedProducts.includes('all') 
    ? "All Products" 
    : selectedProducts.length === 1 
      ? products.find(p => p.id === selectedProducts[0])?.name || "Select Products" 
      : `${selectedProducts.length} Products Selected`;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="truncate">{displayText}</span>
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full min-w-[240px] p-2" align="start">
        <div className="space-y-2 max-h-60 overflow-y-auto">
          <div className="flex items-center space-x-2 py-1 px-2">
            <input
              type="checkbox"
              id="product-all"
              checked={selectedProducts.includes('all')}
              onChange={() => onProductSelect('all')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="product-all" className="text-sm font-medium">
              All Products
            </label>
          </div>
          
          {products.filter(p => p.id !== 'all').map((product) => (
            <div key={product.id} className="flex items-center space-x-2 py-1 px-2">
              <input
                type="checkbox"
                id={`product-${product.id}`}
                checked={selectedProducts.includes(product.id)}
                onChange={() => onProductSelect(product.id)}
                disabled={selectedProducts.includes('all')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label 
                htmlFor={`product-${product.id}`} 
                className={`text-sm font-medium ${selectedProducts.includes('all') ? 'text-muted-foreground' : ''}`}
              >
                {product.name}
              </label>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
