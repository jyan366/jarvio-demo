
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SalesDataPoint } from '@/types/sales';

interface SalesChartProps {
  data: SalesDataPoint[];
}

export const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  const formatYAxis = (value: number) => `£${value}`;

  return (
    <Card className="lg:col-span-7">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl font-semibold">25 January 2025 - 24 February 2025</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data}
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
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
