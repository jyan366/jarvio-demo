import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell } from 'recharts';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { DollarSign, ShoppingBag, Package, ArrowRight, Percent, CreditCard, Image, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const salesData = [
  { date: '1 Jan', amount: 500 },
  { date: '2 Jan', amount: 650 },
  { date: '3 Jan', amount: 600 },
  { date: '4 Jan', amount: 450 },
  { date: '5 Jan', amount: 550 },
  { date: '6 Jan', amount: 600 },
  { date: '7 Jan', amount: 400 },
  { date: '8 Jan', amount: 350 },
  { date: '9 Jan', amount: 480 },
  { date: '10 Jan', amount: 520 },
  { date: '11 Jan', amount: 610 },
  { date: '12 Jan', amount: 590 },
  { date: '13 Jan', amount: 570 },
  { date: '14 Jan', amount: 510 },
  { date: '15 Jan', amount: 530 },
  { date: '16 Jan', amount: 640 },
  { date: '17 Jan', amount: 580 },
  { date: '18 Jan', amount: 620 },
  { date: '19 Jan', amount: 560 },
  { date: '20 Jan', amount: 490 },
  { date: '21 Jan', amount: 540 },
  { date: '22 Jan', amount: 630 },
  { date: '23 Jan', amount: 600 },
  { date: '24 Jan', amount: 550 },
  { date: '25 Jan', amount: 510 },
  { date: '26 Jan', amount: 570 },
  { date: '27 Jan', amount: 480 },
  { date: '28 Jan', amount: 520 },
  { date: '29 Jan', amount: 590 },
  { date: '30 Jan', amount: 610 }
];

const costData = {
  breakdown: [
    { item: 'Total Sales', value: 17579.31 },
    { item: 'Shipping and Rebates', value: 64.04 },
    { item: 'Advertising Cost', value: 0 },
    { item: 'Commission', value: -2654.6 },
    { item: 'FBA Fulfillment Fee', value: -4651.44 },
    { item: 'Other Amazon Fees', value: -275.76 },
    { item: 'Estimated Payout', value: 10061.55 },
    { item: 'Cost of goods', value: 5158.58 },
    { item: 'Other Costs', value: 1414.6 },
    { item: 'Net profit', value: 3488.37 },
  ],
  distribution: [
    { name: 'Net Profit', value: 3488.37, color: '#818CF8' },
    { name: 'COGS', value: 5158.58, color: '#A855F7' },
    { item: 'Advertising Cost', value: 0, color: '#EC4899' },
    { name: 'FBA Fulfillment', value: 4651.44, color: '#60A5FA' },
    { name: 'Commission Fee', value: 2654.6, color: '#A78BFA' },
    { name: 'Other Cost', value: 1414.6, color: '#C084FC' },
    { name: 'Shipping', value: 64.04, color: '#38BDF8' },
    { name: 'Other Amazon Fees', value: 275.76, color: '#FB923C' },
  ]
};

const productData = [
  {
    name: "Kimchi 1kg Jar - Raw & Unpasteurised - Traditionally Fermented",
    asin: "B08P5P3QCG",
    unitsSold: 25,
    totalSales: "£492.71",
    totalCosts: "£342.65",
    avgPrice: "19.71",
    profit: "£152.05"
  },
  {
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
  const [showCosts, setShowCosts] = useState(false);
  const formatYAxis = (value: number) => `£${value}`;

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {showCosts ? 'Cost Breakdown' : 'Sales Summary'}
            </h1>
            <p className="text-lg text-muted-foreground">
              24 January - 23 February 2025
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setShowCosts(!showCosts)}
          >
            {showCosts ? 'Show Sales' : 'Show Costs'}
          </Button>
        </div>

        {!showCosts ? (
          <>
            <div className="grid lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 grid gap-4 grid-cols-2">
                {statsCards.map((card, index) => (
                  <Card key={index} className="p-6">
                    <div>
                      <p className="text-base text-muted-foreground font-medium">{card.title}</p>
                      <p className="text-2xl font-bold mt-2">{card.value}</p>
                    </div>
                  </Card>
                ))}
              </div>

              <Card className="lg:col-span-8">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">24 January 2025 - 23 February 2025</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] w-full">
                    <BarChart 
                      data={salesData} 
                      width={700} 
                      height={400}
                      margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="date" stroke="#888" fontSize={12} />
                      <YAxis 
                        tickFormatter={formatYAxis} 
                        stroke="#888" 
                        fontSize={12}
                        tickMargin={8}
                      />
                      <Tooltip 
                        formatter={(value: number) => [`£${value}`, 'Amount']}
                        contentStyle={{ 
                          background: 'white',
                          border: '1px solid #eee',
                          borderRadius: '8px',
                          padding: '8px 12px'
                        }}
                      />
                      <Bar 
                        dataKey="amount" 
                        fill="#4457ff"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center justify-between">
                  Cost Breakdown
                  <span className="text-sm text-muted-foreground">
                    1-31 January 2025
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {costData.breakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {item.item}
                        </span>
                        {item.item === 'Total Sales' && (
                          <TooltipProvider>
                            <UITooltip>
                              <TooltipTrigger>
                                <Info className="h-4 w-4 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Total sales before deductions</p>
                              </TooltipContent>
                            </UITooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <span className={`font-medium ${
                        item.value < 0 ? 'text-red-500' : ''
                      }`}>
                        {item.value < 0 ? '-' : ''}£{Math.abs(item.value).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">
                  Cost Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <PieChart width={300} height={300}>
                    <Pie
                      data={costData.distribution}
                      cx={150}
                      cy={150}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {costData.distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                  <div className="ml-8">
                    {costData.distribution.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span>{item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

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
                    <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
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
