
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { DollarSign, ShoppingBag, Package, ArrowRight, Percent, CreditCard } from 'lucide-react';

const salesData = [
  { date: '24 Jan', amount: 500 },
  { date: '28 Jan', amount: 650 },
  { date: '1 Feb', amount: 600 },
  { date: '5 Feb', amount: 450 },
  { date: '9 Feb', amount: 550 },
  { date: '13 Feb', amount: 600 },
  { date: '17 Feb', amount: 400 },
  { date: '21 Feb', amount: 350 },
];

const productData = [
  {
    image: "/placeholder.svg",
    name: "Kimchi 1kg Jar - Raw & Unpasteurised - Traditionally Fermented",
    asin: "B08P5P3QCG",
    unitsSold: 25,
    totalSales: "£492.71",
    totalCosts: "£342.65",
    avgPrice: "19.71",
    profit: "£152.05"
  },
  {
    image: "/placeholder.svg",
    name: "Ruby Red Sauerkraut 1kg Jar - Raw & Unpasteurised - Traditionally Fermented",
    asin: "B08P5KYH1P",
    unitsSold: 80,
    totalSales: "£1274.15",
    totalCosts: "£932.95",
    avgPrice: "15.93",
    profit: "£150.20"
  }
];

const statsCards = [
  {
    title: "Total Sales",
    value: "£12,954.99",
    icon: DollarSign
  },
  {
    title: "Orders",
    value: "878",
    icon: ShoppingBag
  },
  {
    title: "Units Sold",
    value: "950",
    icon: Package
  },
  {
    title: "Units Per Order",
    value: "1.08",
    icon: ArrowRight
  },
  {
    title: "Estimate Payout",
    value: "£5,074.19",
    icon: CreditCard
  },
  {
    title: "Payout Percentage",
    value: "60.83%",
    icon: Percent
  }
];

export default function SalesHub() {
  const formatYAxis = (value: number) => `£${value}`;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sales Summary</h1>
            <p className="text-muted-foreground">24 January - 23 February 2025</p>
          </div>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md">
            Show Costs
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {statsCards.map((card, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.title}
                  </CardTitle>
                  <card.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>24 January 2025 - 23 February 2025</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full">
                <BarChart 
                  data={salesData} 
                  width={500} 
                  height={400}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis tickFormatter={formatYAxis} />
                  <Tooltip 
                    formatter={(value: number) => [`£${value}`, 'Amount']}
                  />
                  <Bar dataKey="amount" fill="#8884d8" />
                </BarChart>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>ASIN</TableHead>
                <TableHead>Units Sold</TableHead>
                <TableHead>Total Sales</TableHead>
                <TableHead>Total Costs</TableHead>
                <TableHead>Avg Price</TableHead>
                <TableHead>Profit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productData.map((product, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="h-12 w-12 object-contain"
                    />
                  </TableCell>
                  <TableCell className="max-w-[300px]">{product.name}</TableCell>
                  <TableCell>{product.asin}</TableCell>
                  <TableCell>{product.unitsSold}</TableCell>
                  <TableCell>{product.totalSales}</TableCell>
                  <TableCell>{product.totalCosts}</TableCell>
                  <TableCell>{product.avgPrice}</TableCell>
                  <TableCell>{product.profit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </MainLayout>
  );
}
