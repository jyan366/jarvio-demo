
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { ChevronDown, Image } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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
  },
  {
    title: "Out of stock",
    value: "2"
  }
];

const chartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

const products = [
  {
    id: 1,
    name: "Kimchi 1 Kg Jar - Raw & Unpasteurised - Traditionally Fermented - By The Cultured Food Company",
    price: "$21.24",
    margin: "30.86%",
    breakeven: "$14.78",
    featured: "No"
  },
  {
    id: 2,
    name: "Ruby Red Sauerkraut 1kg Jar - Raw & Unpasteurised - Traditionally Fermented - By The Cultured Food",
    price: "$18.74",
    margin: "11.79%",
    breakeven: "$13.73",
    featured: "No"
  },
  {
    id: 3,
    name: "Carrot & Fennel Sauerkraut - Organic, Raw & Unpasteurised - Traditionally Fermented - 2 X 400g Jar - By The Cultured Food Company",
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

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Stats Cards - Takes up 7 columns on desktop */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-4">
            {statsCards.map((card, index) => (
              <Card key={index} className="p-4">
                <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
                <p className="text-xl md:text-2xl font-bold mt-1">{card.value}</p>
              </Card>
            ))}
          </div>

          {/* Chart - Takes up 5 columns on desktop */}
          <Card className="lg:col-span-5 p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
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
                      <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md">
                        <Image className="h-8 w-8 text-muted-foreground" />
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
