import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Check, X, Image, ListTodo, Target, TrendingUp } from 'lucide-react';
const products = [{
  id: 1,
  asin: 'B08P5PVDS3',
  potentialSales: '£2935',
  recommendations: 5,
  score: 33
}, {
  id: 2,
  asin: 'B082J56YCV',
  potentialSales: '£485',
  recommendations: 4,
  score: 55
}, {
  id: 3,
  asin: 'B0CJYLQQS8',
  potentialSales: '£0',
  recommendations: 3,
  score: 67
}, {
  id: 4,
  asin: 'B0CK4XV6QV',
  potentialSales: '£0',
  recommendations: 3,
  score: 74
}, {
  id: 5,
  asin: 'B0CVL54ZDV',
  potentialSales: '£54',
  recommendations: 3,
  score: 70
}];
const recommendations = [{
  section: 'Title',
  items: [{
    title: 'Character Count',
    description: 'Title is not between 120-200 characters (0)',
    status: 'error'
  }]
}, {
  section: 'Bullet Points',
  items: [{
    title: 'Minimum Points',
    description: 'Listing includes 5 or more bullet points.',
    status: 'success'
  }, {
    title: 'Character Count per Bullet',
    description: 'Not all bullet points are within 150-200 characters.',
    status: 'error'
  }]
}, {
  section: 'Product Description',
  items: [{
    title: 'Character Count',
    description: 'Product description is outside the ideal character range or lacks A+ Content.',
    status: 'error'
  }]
}, {
  section: 'Keyword Optimisation',
  items: [{
    title: 'Primary Keywords in Fields',
    description: 'Primary keywords are missing from the title, bullet points, or description.',
    status: 'error'
  }]
}];
export default function ListingQuality() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  return <MainLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">Listings Hub</h1>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-base text-muted-foreground font-medium">Listings to Optimize</p>
                  <p className="text-3xl font-bold mt-2">34</p>
                </div>
                <div className="bg-blue-600 p-2 rounded-full">
                  <ListTodo className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-base text-muted-foreground font-medium">Best Listing Score</p>
                  <p className="text-3xl font-bold mt-2">80</p>
                </div>
                <div className="bg-blue-600 p-2 rounded-full">
                  <Target className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-2 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-base text-muted-foreground font-medium">Organic Sales Uplift</p>
                  <p className="text-3xl font-bold mt-2">£5495</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 flex flex-col items-center justify-center text-center h-full">
            <h3 className="text-base font-semibold mb-6">Listing Quality Score</h3>
            <div className="relative w-40 h-40">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="10" strokeDasharray={`${47 * 2.83} ${100 * 2.83}`} strokeDashoffset="0" transform="rotate(-90 50 50)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">47</span>
                <span className="text-xs text-muted-foreground">out of 100</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-6">Current Performance</p>
            <p className="font-medium text-base">On Track</p>
          </Card>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing Image</TableHead>
                <TableHead>ASIN</TableHead>
                <TableHead>Potential Sales Uplift</TableHead>
                <TableHead>Recommendations</TableHead>
                <TableHead>Listing Scores</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => <TableRow key={product.id}>
                  <TableCell>
                    <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md">
                      <Image className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </TableCell>
                  <TableCell>{product.asin}</TableCell>
                  <TableCell>{product.potentialSales}</TableCell>
                  <TableCell>
                    <Button variant="outline" onClick={() => setSelectedProduct(product.asin)}>
                      View ({product.recommendations})
                    </Button>
                  </TableCell>
                  <TableCell>{product.score}</TableCell>
                  <TableCell>
                    <Button>Update</Button>
                  </TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Sheet open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <SheetContent className="sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Listing Recommendations</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <div className="mb-8">
              <div className="w-48 h-48 mx-auto">
                <div className="w-full h-full flex items-center justify-center bg-muted rounded-md">
                  <Image className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>
            </div>
            <div className="space-y-8">
              {recommendations.map(section => <div key={section.section} className="space-y-4">
                  <h3 className="text-lg font-semibold">{section.section}</h3>
                  <div className="space-y-4">
                    {section.items.map(item => <div key={item.title} className="flex gap-3 p-4 rounded-lg bg-muted/50">
                        <div className={`
                          rounded-full p-1
                          ${item.status === 'success' ? 'bg-green-100' : 'bg-red-100'}
                        `}>
                          {item.status === 'success' ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-600" />}
                        </div>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>)}
                  </div>
                </div>)}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </MainLayout>;
}