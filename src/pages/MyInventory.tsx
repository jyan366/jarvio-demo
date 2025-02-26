
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
    value: "$12,865.56"
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
    image: "https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//411tW589v5L.jpg",
    availableQuantity: 503,
    inboundQuantity: 0,
    salesPrice: 16,
    inventoryValue: 8443.75,
    estimatedSales: "7415.31"
  },
  {
    id: 2,
    name: "The Cultured Food Company Natural Sauerkraut (400g) & Kimchi (300g) Pack - Probiotic-Rich, Gluten-Free Fermented Foods For Digestive Health & Immunity Support - Unpasteurised, Organic Ingredients",
    image: "https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//415+Np8jrQL.jpg",
    availableQuantity: 89,
    inboundQuantity: 0,
    salesPrice: 20,
    inventoryValue: 1778.75,
    estimatedSales: "359.78"
  },
  {
    id: 3,
    name: "Kimchi 300g - The Cultured Food Company",
    image: "https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//41SF9iv9eXL.jpg",
    availableQuantity: 160,
    inboundQuantity: 0,
    salesPrice: 10,
    inventoryValue: 1593.75,
    estimatedSales: "59.78"
  },
  {
    id: 4,
    name: "Vegan Kimchi 2 X 300g Jar - The Cultured Food Company's Authentic Plant-Based Korean Delight - Raw, Unpasteurised & Bursting With Flavour.",
    image: "https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//51BwE63CnHL.jpg",
    availableQuantity: 75,
    inboundQuantity: 0,
    salesPrice: 17.5,
    inventoryValue: 1358.75,
    estimatedSales: "72.45"
  },
  {
    id: 5,
    name: "Ruby Red Sauerkraut - Organic, Raw & Unpasteurised - Traditionally Fermented - 2 X 400g Jar - By The Cultured Food Company",
    image: "https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//51VG-OB2nML.jpg",
    availableQuantity: 59,
    inboundQuantity: 0,
    salesPrice: 17.5,
    inventoryValue: 1068.75,
    estimatedSales: "1068.64"
  },
  {
    id: 6,
    name: "Fermented Beetroot Infused With Ginger - Organic, Raw & Unpasteurised - Traditionally Fermented - 1 Kg Jar - By The Cultured Food Company",
    image: "https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//51Vodw2iQCL.jpg",
    availableQuantity: 27,
    inboundQuantity: 0,
    salesPrice: 18.75,
    inventoryValue: 506.25,
    estimatedSales: "693.29"
  }
];

export default function MyInventory() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight">Inventory</h1>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
            <Button variant="outline" className="flex items-center justify-between gap-2">
              <span>Select tags...</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="flex items-center justify-between gap-2">
              <span>Select products...</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Download Restock Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {statsCards.map((card, index) => (
            <Card key={index} className="p-4">
              <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
              <p className="text-lg md:text-2xl font-bold mt-1">{card.value}</p>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden">
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
                      <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md overflow-hidden">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] md:max-w-xl">{product.name}</TableCell>
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
