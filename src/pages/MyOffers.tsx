
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const statsCards = [
  {
    title: "Average price",
    value: "$18.45"
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
    value: "0.29"
  }
];

const products = [
  {
    id: 1,
    name: "Kimchi 1 Kg Jar - Raw & Unpasteurised - Traditionally Fermented - By The Cultured Food Company",
    image: "https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//411tW589v5L.jpg",
    price: "$21.24",
    margin: "30.86%",
    breakeven: "$14.78",
    featured: "No"
  },
  {
    id: 2,
    name: "Ruby Red Sauerkraut 1kg Jar - Raw & Unpasteurised - Traditionally Fermented - By The Cultured Food",
    image: "https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//415+Np8jrQL.jpg",
    price: "$18.74",
    margin: "11.79%",
    breakeven: "$13.73",
    featured: "No"
  },
  {
    id: 3,
    name: "Carrot & Fennel Sauerkraut - Organic, Raw & Unpasteurised - Traditionally Fermented - 2 X 400g Jar - By The Cultured Food Company",
    image: "https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//41SF9iv9eXL.jpg",
    price: "$18.11",
    margin: "24.1%",
    breakeven: "$14.10",
    featured: "No"
  }
];

export default function MyOffers() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">My Offers</h1>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4">
            <Button variant="outline" className="w-full md:w-auto flex items-center justify-between gap-2">
              <span>Select Tags</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full md:w-auto flex items-center justify-between gap-2">
              <span>Select Products</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="w-full md:w-auto flex items-center justify-between gap-2">
              <span>24 Jan 2025 - 23 Feb 2025</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statsCards.map((card, index) => (
            <Card key={index} className="p-4">
              <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
              <p className="text-xl md:text-2xl font-bold mt-1">{card.value}</p>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
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
                      <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-contain" 
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[300px] md:max-w-xl">
                      <div className="line-clamp-2">{product.name}</div>
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
