
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Search } from 'lucide-react';

export default function ReportsBuilder() {
  return (
    <MainLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Report Builder</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Column */}
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <div>
                <label className="font-medium mb-1.5 block">Select Your Period</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option>23 Jan 2025 - 22 Feb 2025</option>
                </select>
              </div>

              <div>
                <label className="font-medium mb-1.5 block">Select Your Date Split</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option>Monthly</option>
                  <option>Weekly</option>
                  <option>Daily</option>
                </select>
              </div>

              <div>
                <label className="font-medium mb-1.5 block">Select Your Products</label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                  <option>All products...</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-medium mb-1.5 block">Search Your Tags</label>
              <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                <option>Select tags...</option>
              </select>
            </div>
          </Card>

          {/* Right Column */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input 
                    placeholder="Search metrics..." 
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="selectAll" />
                  <label htmlFor="selectAll" className="text-sm">Select All</label>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Product Metrics</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Checkbox id="sku" />
                        <label htmlFor="sku" className="text-sm">SKU</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="listingPrice" />
                        <label htmlFor="listingPrice" className="text-sm">Listing Price Amount</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="fulfillableQuantity" />
                        <label htmlFor="fulfillableQuantity" className="text-sm">Fulfillable Quantity</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Sales Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox id="saleAmount" />
                      <label htmlFor="saleAmount" className="text-sm">Sale Amount</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="unitsOrdered" />
                      <label htmlFor="unitsOrdered" className="text-sm">Individual Units Ordered</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="averagePrice" />
                      <label htmlFor="averagePrice" className="text-sm">Average Price</label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Cost Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox id="fbaFee" />
                      <label htmlFor="fbaFee" className="text-sm">FBA Fulfillment Fee</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="commission" />
                      <label htmlFor="commission" className="text-sm">Commission</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="otherCosts" />
                      <label htmlFor="otherCosts" className="text-sm">Other costs</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="productCost" />
                      <label htmlFor="productCost" className="text-sm">Product Cost</label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-3">Profit Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Checkbox id="profit" />
                      <label htmlFor="profit" className="text-sm">Profit</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="profitPerUnit" />
                      <label htmlFor="profitPerUnit" className="text-sm">Profit Per Unit</label>
                    </div>
                  </div>
                </div>

                <Button className="w-full" size="lg">
                  Generate Report
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
