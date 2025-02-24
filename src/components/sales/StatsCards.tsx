
import React from 'react';
import { Card } from '@/components/ui/card';
import { StatsCard } from '@/types/sales';

interface StatsCardsProps {
  cards: StatsCard[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ cards }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="p-6">
          <div>
            <p className="text-sm text-muted-foreground font-medium">{card.title}</p>
            <p className="text-2xl font-bold mt-3">{card.value}</p>
          </div>
        </Card>
      ))}
    </div>
  );
};
