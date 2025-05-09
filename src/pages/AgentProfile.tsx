
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Agent } from "@/components/agents/types";
import { agentsData } from "@/data/agentsData";
import { useAgentSettings } from "@/hooks/useAgentSettings";
import { useToast } from "@/hooks/use-toast";
import { Flow } from "@/components/jarvi-flows/FlowsGrid";

// Sample flows and tools - Same as in AgentSettings.tsx
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

export default function AgentProfile() {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const { settings, toggleFlow, toggleTool, saveSettings } = useAgentSettings();
  const [activeTab, setActiveTab] = useState("flows");
  const { toast } = useToast();
  
  const [agent, setAgent] = useState<Agent | undefined>(undefined);

  useEffect(() => {
    // Find agent by ID
    const foundAgent = agentsData.find(agent => agent.id === agentId);
    if (foundAgent) {
      setAgent(foundAgent);
    }
  }, [agentId]);

  if (!agent) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Agent not found</h2>
            <Button onClick={() => navigate("/agents-hub")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Agents Hub
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const agentSettings = settings[agent.id] || {
    agentId: agent.id,
    enabledFlows: [],
    customTools: []
  };

  const handleSave = () => {
    saveSettings();
    toast({
      title: "Settings saved",
      description: `Configuration for ${agent.name} has been updated.`
    });
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate("/agents-hub")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: agent.avatarColor }}
            >
              {agent.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{agent.name}</h1>
              <p className="text-muted-foreground">{agent.domain} Specialist</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium mb-2">About</h2>
          <p className="italic text-muted-foreground mb-4">"{agent.tagline}"</p>
          <p>{agent.description}</p>
        </div>

        <div className="bg-white rounded-lg border shadow-sm p-6">
          <h2 className="text-lg font-medium mb-6">Agent Configuration</h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="flows">Flows</TabsTrigger>
              <TabsTrigger value="tools">Tools</TabsTrigger>
            </TabsList>
            
            <TabsContent value="flows" className="space-y-4 mt-4 max-h-[600px] overflow-y-auto">
              <p className="text-sm text-muted-foreground mb-4">
                Enable flows that {agent.name} can use to help you with {agent.domain.toLowerCase()} tasks.
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
            
            <TabsContent value="tools" className="space-y-4 mt-4 max-h-[600px] overflow-y-auto">
              <p className="text-sm text-muted-foreground mb-4">
                Enable tools that {agent.name} can access to perform tasks.
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

          <div className="mt-8 flex justify-end">
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
