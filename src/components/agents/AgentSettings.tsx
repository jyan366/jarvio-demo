
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { Flow } from "@/components/jarvi-flows/FlowsGrid";
import { useToast } from "@/hooks/use-toast";

// Sample flows and tools - in a real app, you'd fetch these from your backend
const sampleFlows: Flow[] = [
  { 
    id: 'flow1', 
    name: 'Get Inventory Levels', 
    description: 'Check current stock levels across warehouses',
    trigger: 'manual',
    blocks: [
      { id: 'c1', type: 'collect', option: 'Get Inventory Data', name: 'Inventory Data' },
      { id: 'a1', type: 'act', option: 'Format Report', name: 'Format Report' }
    ]
  },
  { 
    id: 'flow2', 
    name: 'Predict Stockouts', 
    description: 'Predict potential stockouts based on current trends',
    trigger: 'manual',
    blocks: [
      { id: 'c2', type: 'collect', option: 'Get Sales History', name: 'Sales History' },
      { id: 't1', type: 'think', option: 'Analyze Trends', name: 'Trend Analysis' },
      { id: 'a2', type: 'act', option: 'Generate Forecast', name: 'Create Forecast' }
    ]
  },
  { 
    id: 'flow3', 
    name: 'Order Optimization', 
    description: 'Optimize order quantities based on demand',
    trigger: 'manual',
    blocks: [
      { id: 'c3', type: 'collect', option: 'Get Demand Data', name: 'Demand Data' },
      { id: 't2', type: 'think', option: 'Calculate Optimal Order', name: 'Calculate Order' },
      { id: 'a3', type: 'act', option: 'Create Order Plan', name: 'Order Plan' }
    ]
  }
];

const tools = [
  { id: 'tool1', name: 'Inventory API', description: 'Access real-time inventory data' },
  { id: 'tool2', name: 'Sales Forecasting', description: 'ML-powered sales prediction' },
  { id: 'tool3', name: 'Order Management', description: 'Create and track purchase orders' },
  { id: 'tool4', name: 'Supplier Database', description: 'Access supplier information and contacts' },
];

export function AgentSettings() {
  const { 
    selectedAgent, 
    isSettingsOpen, 
    closeAgentSettings, 
    settings, 
    toggleFlow, 
    toggleTool,
    saveSettings 
  } = useAgentSettings();
  const [activeTab, setActiveTab] = useState("flows");
  const { toast } = useToast();
  
  if (!selectedAgent) return null;
  
  const agentSettings = settings[selectedAgent.id] || {
    agentId: selectedAgent.id,
    enabledFlows: [],
    customTools: []
  };

  const handleSave = () => {
    saveSettings();
    toast({
      title: "Settings saved",
      description: `Configuration for ${selectedAgent.name} has been updated.`
    });
  };

  return (
    <Dialog open={isSettingsOpen} onOpenChange={(open) => !open && closeAgentSettings()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: selectedAgent.avatarColor }}
            >
              {selectedAgent.name.charAt(0)}
            </div>
            <span>{selectedAgent.name} Settings</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="flows">Flows</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="flows" className="space-y-4 mt-4 max-h-[400px] overflow-y-auto">
            <p className="text-sm text-muted-foreground mb-4">
              Enable flows that {selectedAgent.name} can use to help you with {selectedAgent.domain.toLowerCase()} tasks.
            </p>
            
            {sampleFlows.map(flow => (
              <div key={flow.id} className="border rounded-md p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">{flow.name}</h4>
                    <p className="text-sm text-muted-foreground">{flow.description}</p>
                  </div>
                  <Switch 
                    id={`flow-${flow.id}`} 
                    checked={agentSettings.enabledFlows.includes(flow.id)}
                    onCheckedChange={(checked) => toggleFlow(flow.id, checked)} 
                  />
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {flow.blocks.map(block => (
                    <div 
                      key={block.id}
                      className={`text-xs px-2 py-1 rounded-full ${
                        block.type === 'collect' ? 'bg-blue-100 text-blue-800' :
                        block.type === 'think' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {block.name || block.option}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-4 mt-4 max-h-[400px] overflow-y-auto">
            <p className="text-sm text-muted-foreground mb-4">
              Enable tools that {selectedAgent.name} can access to perform tasks.
            </p>
            
            {tools.map(tool => (
              <div key={tool.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <h4 className="font-medium">{tool.name}</h4>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
                <Switch 
                  id={`tool-${tool.id}`}
                  checked={agentSettings.customTools.includes(tool.id)}
                  onCheckedChange={(checked) => toggleTool(tool.id, checked)}
                />
              </div>
            ))}
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={closeAgentSettings}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
