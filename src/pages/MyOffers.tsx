
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const statsCards = [
  {
    title: "Average price",
    value: "£14.76"
  },
  {
    title: "Buy box",
    value: "94.7%"
  },
  {
    title: "Average margin",
    value: "1.68%"
  },
  {
    title: "Unprofitable products",
    value: "13"
  },
  {
    title: "Profit per unit",
    value: "0.23"
  }
];

const products = [
  {
    id: 1,
    image: "/lovable-uploads/770367a8-bd58-49de-8601-206ba2fa4382.png",
    name: "Kimchi 1 Kg Jar - Raw & Unpasteurised - Traditionally Fermented - By The Cultured Food Company",
    price: "£16.99",
    margin: "30.86%",
    breakeven: "£11.82",
    featured: "No"
  },
  {
    id: 2,
    name: "Ruby Red Sauerkraut 1kg Jar - Raw & Unpasteurised - Traditionally Fermented - By The Cultured Food",
    price: "£14.99",
    margin: "11.79%",
    breakeven: "£10.98",
    featured: "No"
  },
  {
    id: 3,
    name: "Carrot & Fennel Sauerkraut - Organic, Raw & Unpasteurised - Traditionally Fermented - 2 X 400g Jar - By The Cultured Food Company",
    price: "£14.49",
    margin: "24.1%",
    breakeven: "£11.28",
    featured: "No"
  }
];

export default function MyOffers() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">My Offers</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <span>Select Tags</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <span>Select Products</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <span>24 Jan 2025 - 23 Feb 2025</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-4">
          {statsCards.map((card, index) => (
            <Card key={index} className="p-4">
              <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </Card>
          ))}
        </div>

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Product Name</TableHead>
                  <TableHead className="text-right">*Pack Price</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">*Breakeven</TableHead>
                  <TableHead className="text-right">*Featured Offer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-16 h-16 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="object-cover rounded-md"
                          width={64}
                          height={64}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-xl">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-right">{product.price}</TableCell>
                    <TableCell className="text-right">{product.margin}</TableCell>
                    <TableCell className="text-right">{product.breakeven}</TableCell>
                    <TableCell className="text-right">{product.featured}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
