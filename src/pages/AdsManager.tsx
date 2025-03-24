
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Plus, Download, Upload, Copy, Star, StarOff, Filter, ChevronDown, Play, Eye, Workflow } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProcessBuilder } from "@/components/inventory/ProcessBuilder";
import { Badge } from "@/components/ui/badge";

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
    isFavorite: true,
    expert: false,
    description: "Optimize your product launch with automatic targeting and performance-based adjustments.",
    steps: [
      "Create auto-targeted campaign",
      "Set daily budget of $25-50",
      "Run for 7 days to gather data",
      "Review search terms & convert to exact match",
      "Adjust bids based on ACoS targets"
    ]
  },
  {
    name: "Weekly PPC Optimization Workflow",
    category: "Category Targeting",
    rating: 4.9,
    uses: 2180,
    author: "PPC Expert Mark",
    isFavorite: false,
    expert: true,
    description: "Systematic approach to weekly campaign management and optimization that consistently reduces ACoS by 15-20%.",
    steps: [
      "Review campaign performance metrics",
      "Analyze keyword performance & adjust bids",
      "Identify & add negative keywords",
      "Evaluate and adjust product targeting",
      "Scale successful ad groups",
      "Update performance reports",
      "Test new creative variations"
    ]
  },
  {
    name: "Brand Defense Bundle",
    category: "Brand Defense",
    rating: 4.6,
    uses: 850,
    author: "Community",
    isFavorite: false,
    expert: false,
    description: "Protect your brand from competitors and maintain market position.",
    steps: [
      "Target competitor brand names",
      "Bid on misspelled brand terms",
      "Set defensive product targeting",
      "Monitor share of voice weekly"
    ]
  }
];

export default function AdsManager() {
  const [showTemplate, setShowTemplate] = useState(false);
  const [templateBuilder, setTemplateBuilder] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);

  const openTemplate = (template) => {
    setCurrentTemplate(template);
    setShowTemplate(true);
  };

  const openBuilder = () => {
    setTemplateBuilder(true);
  };

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
            <Button variant="default" onClick={openBuilder}>
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
                      <TableRow key={template.name} className="cursor-pointer" onClick={() => openTemplate(template)}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {template.name}
                            {template.expert && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                                Expert
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{template.category}</TableCell>
                        <TableCell className="text-right">{template.rating}/5.0</TableCell>
                        <TableCell className="text-right">{template.uses.toLocaleString()}</TableCell>
                        <TableCell>{template.author}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            {template.isFavorite ? (
                              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                <Star className="w-4 h-4 text-yellow-500" />
                              </Button>
                            ) : (
                              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                <StarOff className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
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

      {/* Template Viewer Dialog */}
      <Dialog open={showTemplate} onOpenChange={setShowTemplate}>
        <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              {currentTemplate?.name}
              {currentTemplate?.expert && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                  Expert
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              {currentTemplate?.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            <div className="bg-muted/40 p-4 rounded-lg space-y-4">
              <h3 className="font-medium text-lg">Workflow Steps</h3>
              {currentTemplate?.steps.map((step, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-card border rounded-md">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    {step}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowTemplate(false)}>
                Close
              </Button>
              <Button className="gap-2">
                <Copy className="h-4 w-4" />
                Copy Template
              </Button>
              <Button className="gap-2 bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4" />
                Run Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Template Builder Dialog */}
      <ProcessBuilder 
        open={templateBuilder} 
        onOpenChange={setTemplateBuilder} 
        title="Create PPC Campaign Template"
        description="Build your own PPC campaign workflow by adding steps that represent your optimization process."
        blockTypes={[
          "Review Campaign Performance",
          "Adjust Keyword Bids",
          "Add Negative Keywords",
          "Analyze Search Terms",
          "Test New Ad Copy",
          "Scale Top Performers",
          "Budget Reallocation",
          "Generate Performance Report",
          "Competitor Analysis",
          "Seasonal Adjustments",
          "ACOS Optimization"
        ]}
      />
    </MainLayout>
  );
}
