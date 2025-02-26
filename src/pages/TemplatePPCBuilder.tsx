
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Save, X, Plus, Settings, PlusCircle, Play, ArrowLeft, Download, GripVertical } from 'lucide-react';
import { useState } from 'react';

interface CampaignElement {
  id: string;
  type: 'campaign' | 'adGroup' | 'keyword' | 'target';
  name: string;
  settings: Record<string, any>;
}

export default function TemplatePPCBuilder() {
  const [templateName, setTemplateName] = useState('');
  const [elements, setElements] = useState<CampaignElement[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent, type: CampaignElement['type']) => {
    e.dataTransfer.setData('text/plain', type);
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/plain') as CampaignElement['type'];
    setIsDragging(false);
    
    const newElement: CampaignElement = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: `New ${type}`,
      settings: {}
    };
    
    setElements([...elements, newElement]);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Templates
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Create PPC Template</h1>
              <p className="text-sm text-muted-foreground">Design your campaign structure using drag and drop</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Save Template
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar with Elements */}
          <div className="col-span-3">
            <Card>
              <div className="p-4 border-b">
                <h3 className="font-semibold">Campaign Elements</h3>
                <p className="text-sm text-muted-foreground">Drag elements to build your campaign</p>
              </div>
              <div className="p-4 space-y-4">
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'campaign')}
                  className="p-3 border rounded-lg cursor-move hover:bg-accent flex items-center gap-2"
                >
                  <GripVertical className="w-4 h-4" />
                  Campaign
                </div>
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'adGroup')}
                  className="p-3 border rounded-lg cursor-move hover:bg-accent flex items-center gap-2"
                >
                  <GripVertical className="w-4 h-4" />
                  Ad Group
                </div>
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'keyword')}
                  className="p-3 border rounded-lg cursor-move hover:bg-accent flex items-center gap-2"
                >
                  <GripVertical className="w-4 h-4" />
                  Keywords
                </div>
                <div
                  draggable
                  onDragStart={(e) => handleDragStart(e, 'target')}
                  className="p-3 border rounded-lg cursor-move hover:bg-accent flex items-center gap-2"
                >
                  <GripVertical className="w-4 h-4" />
                  Targeting
                </div>
              </div>
            </Card>

            {/* Template Settings */}
            <Card className="mt-4">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Template Settings</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium">Template Name</label>
                  <Input 
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea 
                    placeholder="Describe your template..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Category</label>
                  <Input placeholder="Select category" />
                </div>
              </div>
            </Card>
          </div>

          {/* Builder Canvas */}
          <div className="col-span-9">
            <Card>
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-semibold">Campaign Structure</h3>
                <Button variant="outline" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
              <div 
                className={`min-h-[600px] p-6 ${isDragging ? 'bg-accent/50' : ''}`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {elements.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                    <PlusCircle className="w-8 h-8 mb-2" />
                    <p>Drag campaign elements here to start building</p>
                    <p className="text-sm">or</p>
                    <Button variant="link" className="mt-2">
                      Import existing structure
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {elements.map((element) => (
                      <Card key={element.id} className="border-2 border-dashed p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GripVertical className="w-4 h-4" />
                            <span className="font-medium">{element.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon">
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
