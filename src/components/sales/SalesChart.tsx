
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { SalesDataPoint } from '@/types/sales';

interface SalesChartProps {
  data: SalesDataPoint[];
  title?: string;
  barColor?: string;
  comparisonData?: SalesDataPoint[];
  comparisonLabel?: string;
  dataKey?: string;
  yAxisFormatter?: (value: number) => string;
}

export const SalesChart: React.FC<SalesChartProps> = ({ 
  data, 
  title = "25 January 2025 - 24 February 2025",
  barColor = "#4457ff",
  comparisonData,
  comparisonLabel = "Previous Period",
  dataKey = "amount",
  yAxisFormatter = (value: number) => `£${value}`
}) => {
  
  // Merge the two datasets for proper comparison display
  const combinedData = data.map((item, index) => {
    const comparisonItem = comparisonData?.[index];
    return {
      ...item,
      [`${dataKey}_comparison`]: comparisonItem?.[dataKey]
    };
  });
  
  return (
    <Card className="lg:col-span-7">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg md:text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={combinedData}
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="date" stroke="#888" fontSize={12} />
              <YAxis 
                tickFormatter={yAxisFormatter} 
                stroke="#888" 
                fontSize={12}
                tickMargin={8}
              />
              <Tooltip 
                formatter={(value: number) => [`£${value.toLocaleString()}`, dataKey.charAt(0).toUpperCase() + dataKey.slice(1)]}
                contentStyle={{ 
                  background: 'white',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                labelFormatter={(label) => `Date: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey={dataKey} 
                fill={barColor}
                name={dataKey.charAt(0).toUpperCase() + dataKey.slice(1)} 
                radius={[4, 4, 0, 0]}
              />
              {comparisonData && (
                <Bar 
                  dataKey={`${dataKey}_comparison`}
                  fill={barColor}
                  fillOpacity={0.5}
                  name={comparisonLabel}
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
