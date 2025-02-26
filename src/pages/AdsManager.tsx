import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Plus, Download, Upload, Copy, Star, StarOff, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const templateCategories = [
  { name: 'Product Launch', count: 5 },
  { name: 'Brand Defense', count: 3 },
  { name: 'Category Targeting', count: 4 },
  { name: 'Competitor Targeting', count: 2 }
];

const templates = [
  {
    name: "High-Performance Auto Campaign",
    category: "Product Launch",
    rating: 4.8,
    uses: 1250,
    author: "Jarvio",
    isFavorite: true
  },
  {
    name: "Brand Defense Bundle",
    category: "Brand Defense",
    rating: 4.6,
    uses: 850,
    author: "Community",
    isFavorite: false
  },
  {
    name: "Category Domination",
    category: "Category Targeting",
    rating: 4.5,
    uses: 620,
    author: "Jarvio",
    isFavorite: true
  }
];

export default function AdsManager() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold">Ads Manager</h1>
            <p className="text-muted-foreground mt-1">Create and manage your PPC campaign templates</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
            <Button variant="default">
              <Plus className="w-4 h-4 mr-2" />
              Create Template
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {templateCategories.map((category) => (
            <Card key={category.name} className="hover:bg-accent/50 cursor-pointer transition-colors">
              <CardHeader>
                <CardTitle>{category.name}</CardTitle>
                <CardDescription>{category.count} templates</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <TabsList>
              <TabsTrigger value="all">All Templates</TabsTrigger>
              <TabsTrigger value="my">My Templates</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <TabsContent value="all" className="space-y-6">
            <Card>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Template Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Rating</TableHead>
                      <TableHead className="text-right">Uses</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {templates.map((template) => (
                      <TableRow key={template.name}>
                        <TableCell className="font-medium">{template.name}</TableCell>
                        <TableCell>{template.category}</TableCell>
                        <TableCell className="text-right">{template.rating}/5.0</TableCell>
                        <TableCell className="text-right">{template.uses.toLocaleString()}</TableCell>
                        <TableCell>{template.author}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            {template.isFavorite ? (
                              <Button variant="ghost" size="icon">
                                <Star className="w-4 h-4 text-yellow-500" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon">
                                <StarOff className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon">
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* Other tab contents would be similar */}
        </Tabs>
      </div>
    </MainLayout>
  );
}
