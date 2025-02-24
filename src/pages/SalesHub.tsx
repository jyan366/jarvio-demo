
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { StatsCards } from '@/components/sales/StatsCards';
import { SalesChart } from '@/components/sales/SalesChart';
import { CostBreakdown } from '@/components/sales/CostBreakdown';
import { CostDistribution } from '@/components/sales/CostDistribution';
import { ProductsTable } from '@/components/sales/ProductsTable';
import { statsCards, salesData, costData, productData } from '@/data/salesData';

export default function SalesHub() {
  const [showCosts, setShowCosts] = useState(false);

  return (
    <MainLayout>
      <div className="space-y-4 md:space-y-6 lg:space-y-8 p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          <div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
              {showCosts ? 'Cost Breakdown' : 'Sales Summary'}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              25 January - 24 February 2025
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full md:w-auto rounded-full mt-2 md:mt-0"
            onClick={() => setShowCosts(!showCosts)}
          >
            {showCosts ? 'Show Sales' : 'Show Costs'}
          </Button>
        </div>

        {!showCosts ? (
          <div className="grid gap-4 md:gap-6">
            <div className="lg:col-span-3">
              <StatsCards cards={statsCards} />
            </div>
            <div className="lg:col-span-5 bg-card rounded-lg border shadow-sm">
              <SalesChart data={salesData} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <CostBreakdown data={costData.breakdown} />
            <CostDistribution data={costData.distribution} />
          </div>
        )}

        <div className="overflow-hidden rounded-lg border bg-card">
          <ProductsTable products={productData} />
        </div>
      </div>
    </MainLayout>
  );
}
