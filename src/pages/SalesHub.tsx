
import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { StatsCards } from '@/components/sales/StatsCards';
import { SalesChart } from '@/components/sales/SalesChart';
import { CostBreakdown } from '@/components/sales/CostBreakdown';
import { CostDistribution } from '@/components/sales/CostDistribution';
import { ProductsTable } from '@/components/sales/ProductsTable';
import { statsCards, salesData, costData, productData } from '@/data/salesData';
import { BarChart3, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SalesHub() {
  const [showCosts, setShowCosts] = useState(false);
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              {showCosts ? 'Cost Breakdown' : 'Sales Summary'}
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground">
              25 January - 24 February 2025
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="w-full md:w-auto rounded-full"
              onClick={() => setShowCosts(!showCosts)}
            >
              {showCosts ? 'Show Sales' : 'Show Costs'}
            </Button>
            <Button
              className="w-full md:w-auto rounded-full"
              onClick={() => navigate('/analytics-studio')}
            >
              <BarChart3 className="mr-2 h-4 w-4" /> 
              Analytics Studio
            </Button>
          </div>
        </div>

        {!showCosts ? (
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-6">
            <div className="lg:col-span-3">
              <StatsCards cards={statsCards} />
            </div>
            <div className="lg:col-span-5">
              <SalesChart data={salesData} />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CostBreakdown data={costData.breakdown} />
            <CostDistribution data={costData.distribution} />
          </div>
        )}

        <ProductsTable products={productData} />
      </div>
    </MainLayout>
  );
}
