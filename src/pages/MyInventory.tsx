
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Image } from 'lucide-react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const statsCards = [
  {
    title: "Units Available",
    value: "817"
  },
  {
    title: "Units Inbound",
    value: "0"
  },
  {
    title: "Inventory Value",
    value: "£10,292.45"
  },
  {
    title: "Last 30D Sales",
    value: "844 Units"
  },
  {
    title: "Low Stock Products",
    value: "25"
  },
  {
    title: "Last 90D Sales",
    value: "2,726 Units"
  }
];

const products = [
  {
    id: 1,
    name: "Raw Natural Sauerkraut 1kg Jar - Organic, Raw & Unpasteurised - Traditionally Fermented - By The Cultured Food Company",
    availableQuantity: 503,
    inboundQuantity: 0,
    salesPrice: 13,
    inventoryValue: 6755,
    estimatedSales: "5932.25"
  },
  {
    id: 2,
    name: "The Cultured Food Company Natural Sauerkraut (400g) & Kimchi (300g) Pack - Probiotic-Rich, Gluten-Free Fermented Foods For Digestive Health & Immunity Support - Unpasteurised, Organic Ingredients",
    availableQuantity: 89,
    inboundQuantity: 0,
    salesPrice: 16,
    inventoryValue: 1423,
    estimatedSales: "287.82"
  },
  {
    id: 3,
    name: "Kimchi 300g - The Cultured Food Company",
    availableQuantity: 160,
    inboundQuantity: 0,
    salesPrice: 8,
    inventoryValue: 1275,
    estimatedSales: "47.82"
  },
  {
    id: 4,
    name: "Vegan Kimchi 2 X 300g Jar - The Cultured Food Company's Authentic Plant-Based Korean Delight - Raw, Unpasteurised & Bursting With Flavour.",
    availableQuantity: 75,
    inboundQuantity: 0,
    salesPrice: 14,
    inventoryValue: 1087,
    estimatedSales: "57.96"
  },
  {
    id: 5,
    name: "Ruby Red Sauerkraut - Organic, Raw & Unpasteurised - Traditionally Fermented - 2 X 400g Jar - By The Cultured Food Company",
    availableQuantity: 59,
    inboundQuantity: 0,
    salesPrice: 14,
    inventoryValue: 855,
    estimatedSales: "854.91"
  },
  {
    id: 6,
    name: "Fermented Beetroot Infused With Ginger - Organic, Raw & Unpasteurised - Traditionally Fermented - 1 Kg Jar - By The Cultured Food Company",
    availableQuantity: 27,
    inboundQuantity: 0,
    salesPrice: 15,
    inventoryValue: 405,
    estimatedSales: "554.63"
  }
];

export default function MyInventory() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold tracking-tight">Inventory</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <span>Select tags...</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <span>Select products...</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Download Restock Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-6 gap-4">
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
                  <TableHead className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      Available Quantity
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      Inbound Quantity
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      Sales Price
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      Inventory Value
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer">
                    <div className="flex items-center gap-2">
                      Estimated Sales 30D
                      <div className="flex flex-col">
                        <ChevronUp className="h-3 w-3" />
                        <ChevronDown className="h-3 w-3" />
                      </div>
                    </div>
                  </TableHead>
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
                    <TableCell className="max-w-xl">{product.name}</TableCell>
                    <TableCell>{product.availableQuantity}</TableCell>
                    <TableCell>{product.inboundQuantity}</TableCell>
                    <TableCell>{product.salesPrice}</TableCell>
                    <TableCell>{product.inventoryValue}</TableCell>
                    <TableCell>{product.estimatedSales}</TableCell>
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
