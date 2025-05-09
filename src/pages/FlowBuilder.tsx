import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue, 
  SelectGroup, 
  SelectLabel 
} from '@/components/ui/select';
import { 
  ArrowDown, 
  Plus, 
  Database, 
  Brain, 
  Zap, 
  Trash2, 
  Save, 
  ArrowLeft,
  WandSparkles,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';

// Define the flow types and their properties
type TriggerType = 'manual' | 'scheduled' | 'event';

type FlowBlock = {
  id: string;
  type: 'collect' | 'think' | 'act';
  option: string;
  config?: Record<string, any>;
};

type Flow = {
  id: string;
  name: string;
  description: string;
  trigger: TriggerType;
  blocks: FlowBlock[];
};

// Block options based on type
const blockOptions = {
  collect: [
    'User Text',
    'Upload Sheet',
    'All Listing Info',
    'Get Keywords',
    'Estimate Sales',
    'Review Information',
    'Scrape Sheet',
    'Seller Account Feedback',
    'Email Parsing'
  ],
  think: [
    'Basic AI Analysis',
    'Listing Analysis',
    'Insights Generation',
    'Review Analysis'
  ],
  act: [
    'AI Summary',
    'Push to Amazon',
    'Send Email',
    'Human in the Loop'
  ]
};

// All block options combined for AI reference
const allBlockOptions = {
  ...blockOptions,
  blockTypes: ['collect', 'think', 'act']
};

// Predefined flows for testing/editing
const predefinedFlows: Flow[] = [
  {
    id: 'listing-launch',
    name: 'Listing Launch',
    description: 'Automates the process of launching new product listings with optimized content and keyword strategy',
    trigger: 'manual',
    blocks: [
      { id: 'c1', type: 'collect', option: 'Upload Sheet' },
      { id: 'c2', type: 'collect', option: 'Get Keywords' },
      { id: 't1', type: 'think', option: 'Listing Analysis' },
      { id: 'a1', type: 'act', option: 'Push to Amazon' },
      { id: 'a2', type: 'act', option: 'Send Email' }
    ]
  },
  {
    id: 'inventory-restock',
    name: 'Inventory Restock',
    description: 'Analyzes sales velocity and inventory levels to create timely restock recommendations',
    trigger: 'scheduled',
    blocks: [
      { id: 'c1', type: 'collect', option: 'All Listing Info' },
      { id: 'c2', type: 'collect', option: 'Estimate Sales' },
      { id: 't1', type: 'think', option: 'Basic AI Analysis' },
      { id: 'a1', type: 'act', option: 'AI Summary' },
      { id: 'a2', type: 'act', option: 'Send Email' }
    ]
  },
  {
    id: 'customer-feedback',
    name: 'Customer Feedback Report',
    description: 'Aggregates and analyzes customer reviews and feedback across all products',
    trigger: 'scheduled',
    blocks: [
      { id: 'c1', type: 'collect', option: 'Review Information' },
      { id: 'c2', type: 'collect', option: 'Seller Account Feedback' },
      { id: 't1', type: 'think', option: 'Review Analysis' },
      { id: 'a1', type: 'act', option: 'AI Summary' },
      { id: 'a2', type: 'act', option: 'Human in the Loop' }
    ]
  },
  {
    id: 'quarterly-optimization',
    name: 'Quarterly Listing Optimisation',
    description: 'Performs deep analysis of listing performance and suggests optimizations every quarter',
    trigger: 'scheduled',
    blocks: [
      { id: 'c1', type: 'collect', option: 'All Listing Info' },
      { id: 'c2', type: 'collect', option: 'Review Information' },
      { id: 't1', type: 'think', option: 'Insights Generation' },
      { id: 'a1', type: 'act', option: 'Push to Amazon' },
      { id: 'a2', type: 'act', option: 'Human in the Loop' }
    ]
  }
];

// Block type to icon/color mapping
const blockTypeInfo = {
  collect: { icon: Database, color: 'bg-blue-500' },
  think: { icon: Brain, color: 'bg-purple-500' },
  act: { icon: Zap, color: 'bg-green-500' }
};

// Simple form type for AI prompt
type AIPromptFormValues = {
  prompt: string;
};

export default function FlowBuilder() {
  const { flowId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flow, setFlow] = useState<Flow>({
    id: '',
    name: '',
    description: '',
    trigger: 'manual',
    blocks: []
  });
  const [showAIPrompt, setShowAIPrompt] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const aiPromptForm = useForm<AIPromptFormValues>({
    defaultValues: {
      prompt: ''
    }
  });

  // Load existing flow if editing
  useEffect(() => {
    if (flowId) {
      const existingFlow = predefinedFlows.find(f => f.id === flowId);
      if (existingFlow) {
        setFlow({...existingFlow});
      }
    } else {
      // New flow - initialize with a default ID
      setFlow(prev => ({ ...prev, id: uuidv4() }));
    }
  }, [flowId]);

  // Add a new block of the specified type
  const addBlock = (type: 'collect' | 'think' | 'act') => {
    const newBlock: FlowBlock = {
      id: uuidv4(),
      type: type,
      option: blockOptions[type][0]
    };
    
    setFlow(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  // Remove a block
  const removeBlock = (blockId: string) => {
    setFlow(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId)
    }));
  };

  // Update block option
  const updateBlockOption = (blockId: string, option: string) => {
    setFlow(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId ? { ...block, option } : block
      )
    }));
  };

  // Generate flow from AI prompt
  const generateFlowFromPrompt = async (data: AIPromptFormValues) => {
    setIsGenerating(true);
    setAiError(null);
    
    try {
      const response = await supabase.functions.invoke("chat", {
        body: {
          prompt: `Create a flow for an Amazon seller based on this description: "${data.prompt}". 
          The flow should include appropriate blocks from these available options:
          ${JSON.stringify(allBlockOptions)}. 
          
          A flow typically has 3-5 blocks, usually starting with collect blocks, followed by think blocks, and ending with act blocks.`
        }
      });

      console.log("Raw API response:", response);

      // Check for API errors first
      if (response.error) {
        throw new Error(`API Error: ${response.error.message}`);
      }
      
      if (!response.data) {
        throw new Error("No data returned from API");
      }

      if (response.data.success === false) {
        throw new Error(`Response Error: ${response.data.error}`);
      }

      // Get the generated flow from the response
      const generatedFlow = response.data.generatedFlow;
      
      if (!generatedFlow) {
        throw new Error("No flow data in the response");
      }
      
      console.log("Generated flow:", generatedFlow);
      
      // Validate the flow structure
      if (!generatedFlow.name || !generatedFlow.description || !Array.isArray(generatedFlow.blocks)) {
        throw new Error("Invalid flow structure: missing required properties");
      }

      // Create flow blocks from AI response
      const newBlocks: FlowBlock[] = generatedFlow.blocks.map((block: any) => {
        // Validate block type
        if (!block.type || !['collect', 'think', 'act'].includes(block.type)) {
          console.warn(`Invalid block type: ${block.type}, using 'collect' as fallback`);
          return {
            id: uuidv4(),
            type: 'collect',
            option: blockOptions['collect'][0]
          };
        }
        
        // Validate block option
        if (!block.option || !blockOptions[block.type].includes(block.option)) {
          console.warn(`Using fallback option for invalid option: ${block.option}`);
          // Use the first available option as fallback
          return {
            id: uuidv4(),
            type: block.type,
            option: blockOptions[block.type][0]
          };
        }
        
        return {
          id: uuidv4(),
          type: block.type,
          option: block.option
        };
      });
      
      // Update flow with AI-generated content
      setFlow(prev => ({
        ...prev,
        name: generatedFlow.name || "New Flow",
        description: generatedFlow.description || "Flow created from AI prompt",
        blocks: newBlocks
      }));
      
      toast({
        title: "Flow created successfully",
        description: `${newBlocks.length} blocks have been added to your flow.`
      });
      
      setShowAIPrompt(false);
    } catch (error) {
      console.error("Error generating flow:", error);
      setAiError(error instanceof Error ? error.message : "Unknown error occurred");
      toast({
        title: "Error generating flow",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Save flow
  const saveFlow = () => {
    console.log('Flow saved:', flow);
    toast({
      title: "Flow saved successfully",
      description: `${flow.name} has been saved.`
    });
    navigate('/jarvi-flows');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/jarvi-flows')}
            className="self-start"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Flows
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAIPrompt(!showAIPrompt)}
              className="bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100"
            >
              <WandSparkles className="h-4 w-4 mr-2" />
              {showAIPrompt ? "Hide AI Builder" : "Create with AI"}
            </Button>
            <Button 
              onClick={saveFlow}
              className="bg-[#4457ff] hover:bg-[#4457ff]/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Flow
            </Button>
          </div>
        </div>
        
        {showAIPrompt && (
          <Card className="border-2 border-purple-200 bg-purple-50/50">
            <CardContent className="pt-6">
              <Form {...aiPromptForm}>
                <form onSubmit={aiPromptForm.handleSubmit(generateFlowFromPrompt)} className="space-y-4">
                  <FormField
                    control={aiPromptForm.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-md font-medium">Describe your flow</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="E.g.: Create a flow that analyzes customer reviews weekly, identifies common issues, and sends a summary email to the team."
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <Button 
                      type="submit" 
                      className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <WandSparkles className="h-4 w-4 mr-2" />
                          Generate Flow
                        </>
                      )}
                    </Button>
                    
                    {aiError && (
                      <div className="text-xs text-red-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {aiError}
                      </div>
                    )}
                    
                    {!aiError && (
                      <div className="text-xs text-muted-foreground flex items-center mt-2 sm:mt-0">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Example: "Create a flow to check inventory weekly and send restock alerts"
                      </div>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">
              {flowId ? 'Edit Flow' : 'Create New Flow'}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Flow Name</Label>
                  <Input 
                    id="name" 
                    value={flow.name} 
                    placeholder="Enter flow name"
                    onChange={(e) => setFlow(prev => ({ ...prev, name: e.target.value }))} 
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={flow.description} 
                    placeholder="Describe what this flow does"
                    onChange={(e) => setFlow(prev => ({ ...prev, description: e.target.value }))} 
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="trigger">Trigger Type</Label>
                <Select 
                  value={flow.trigger} 
                  onValueChange={(value) => setFlow(prev => ({ ...prev, trigger: value as TriggerType }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select trigger type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual Trigger</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="event">Event-Based</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground mt-2">
                  {flow.trigger === 'manual' && "This flow will need to be manually triggered by a user."}
                  {flow.trigger === 'scheduled' && "This flow will run automatically based on a schedule."}
                  {flow.trigger === 'event' && "This flow will be triggered when specific events occur."}
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Flow Blocks</h2>
            
            {/* Block list */}
            <div className="space-y-4">
              {flow.blocks.map((block, index) => {
                const BlockIcon = blockTypeInfo[block.type].icon;
                const blockColor = blockTypeInfo[block.type].color;
                
                return (
                  <div key={block.id} className="relative">
                    {index > 0 && (
                      <div className="absolute left-6 -top-4 h-4 w-0.5 bg-gray-200"></div>
                    )}
                    
                    <Card className="border-l-4" style={{ borderLeftColor: `var(--${blockColor.replace('bg-', '')})` }}>
                      <CardContent className="flex items-center p-4">
                        <div className={`${blockColor} rounded-full p-2 mr-4`}>
                          <BlockIcon className="h-5 w-5 text-white" />
                        </div>
                        
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <Label className="capitalize text-xs">Block Type: {block.type}</Label>
                            <div className="capitalize font-medium">{block.type}</div>
                          </div>
                          
                          <div className="space-y-1">
                            <Label className="text-xs">Block Action</Label>
                            <Select 
                              value={block.option}
                              onValueChange={(option) => updateBlockOption(block.id, option)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel className="capitalize">{block.type} Options</SelectLabel>
                                  {blockOptions[block.type].map(option => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeBlock(block.id)}
                          className="ml-4"
                        >
                          <Trash2 className="h-5 w-5 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </CardContent>
                    </Card>
                    
                    {index < flow.blocks.length - 1 && (
                      <div className="absolute left-6 -bottom-4 h-4 w-0.5 bg-gray-200"></div>
                    )}
                  </div>
                );
              })}
              
              {flow.blocks.length === 0 && (
                <div className="text-center py-6 border rounded-md border-dashed text-muted-foreground">
                  Your flow is empty. Add blocks below to get started.
                </div>
              )}
            </div>
            
            {/* Add block buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button 
                variant="outline" 
                onClick={() => addBlock('collect')}
                className="border-blue-500 text-blue-600 hover:bg-blue-50"
              >
                <Database className="h-4 w-4 mr-2" />
                Add Collect Block
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => addBlock('think')}
                className="border-purple-500 text-purple-600 hover:bg-purple-50"
              >
                <Brain className="h-4 w-4 mr-2" />
                Add Think Block
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => addBlock('act')}
                className="border-green-500 text-green-600 hover:bg-green-50"
              >
                <Zap className="h-4 w-4 mr-2" />
                Add Act Block
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
