
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, DollarSign, ShoppingCart, Users } from 'lucide-react';

const statsCards = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    description: "+20.1% from last month",
    icon: DollarSign,
    trend: "up"
  },
  {
    title: "Subscriptions",
    value: "2,350",
    description: "+180.1% from last month",
    icon: Users,
    trend: "up"
  },
  {
    title: "Sales",
    value: "12,234",
    description: "+19% from last month",
    icon: ShoppingCart,
    trend: "up"
  },
  {
    title: "Active Now",
    value: "573",
    description: "+201 since last hour",
    icon: BarChart3,
    trend: "up"
  }
];

export default function SalesHub() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sales Hub</h1>
          <p className="text-muted-foreground">
            Your sales performance and analytics at a glance
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((card, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
