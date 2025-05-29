
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProductDetailsRetriever } from './blocks/ProductDetailsRetriever';

export function BlockTestingInterface() {
  const [activeBlock, setActiveBlock] = useState('product-details');

  const blocks = [
    {
      id: 'product-details',
      name: 'Retrieve Product Details from Website',
      description: 'Extract product information from a given URL',
      category: 'collect'
    }
    // Add more blocks here as needed
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Available Test Blocks</CardTitle>
          <CardDescription>
            Select a block to test its functionality
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeBlock} onValueChange={setActiveBlock}>
            <TabsList className="grid w-full grid-cols-1">
              {blocks.map((block) => (
                <TabsTrigger key={block.id} value={block.id}>
                  {block.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {blocks.map((block) => (
              <TabsContent key={block.id} value={block.id} className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{block.name}</CardTitle>
                    <CardDescription>{block.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {block.id === 'product-details' && <ProductDetailsRetriever />}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
