
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
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
  Loader2,
  MoveUp,
  MoveDown,
  GripVertical,
  HelpCircle,
  Play,
  User,
  Info
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Flow, FlowBlock, TriggerType } from '@/components/jarvi-flows/FlowsGrid';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { createTask } from '@/lib/supabaseTasks';
import { agentsData } from '@/data/agentsData';
import { flowBlockOptions, BlockCategory } from '@/data/flowBlockOptions';

// Option descriptions to provide context for each block type
const blockOptionDescriptions = {
  collect: {
    'User Text': 'Allows users to provide specific instructions or data via direct text input',
    'Upload Sheet': 'Handles importing product data from spreadsheets like Excel or CSV',
    'All Listing Info': 'Gathers comprehensive data from all active Amazon listings',
    'Get Keywords': 'Retrieves relevant keywords for product listings based on category and competition',
    'Estimate Sales': 'Collects sales projection data based on historical performance',
    'Review Information': 'Gathers customer reviews and feedback for specified products',
    'Scrape Sheet': 'Extracts and processes data from structured spreadsheets',
    'Seller Account Feedback': 'Collects seller performance metrics and customer feedback',
    'Email Parsing': 'Extracts relevant data from business emails and notifications'
  },
  think: {
    'Basic AI Analysis': 'Processes collected data to identify patterns and insights',
    'Listing Analysis': 'Evaluates product listings for optimization opportunities',
    'Insights Generation': 'Creates actionable business intelligence from analyzed data',
    'Review Analysis': 'Analyzes customer feedback to identify trends and sentiment'
  },
  act: {
    'AI Summary': 'Generates a comprehensive report from analysis results',
    'Push to Amazon': 'Updates Amazon listings with optimized content and settings',
    'Send Email': 'Distributes reports or notifications to specified recipients',
    'Human in the Loop': 'Pauses for manual review and approval before proceeding',
    'Agent': 'Assigns a specialized AI agent to perform this step'
  },
  agent: {
    'Agent': 'Assigns a specialized AI agent to perform a specific task'
  }
};

// Helper functions to generate specific, contextual names based on block type and option
const getDescriptiveBlockName = (type: string, option: string): string => {
  const contextualNaming: Record<string, Record<string, string>> = {
    collect: {
      'User Text': 'Collect Product Details from User',
      'Upload Sheet': 'Import Product Data Spreadsheet',
      'All Listing Info': 'Fetch Complete Amazon Listing Data',
      'Get Keywords': 'Research High-Converting Keywords',
      'Estimate Sales': 'Generate Product Sales Forecast',
      'Review Information': 'Gather Customer Product Reviews',
      'Scrape Sheet': 'Extract Data from Inventory Sheet',
      'Seller Account Feedback': 'Collect Seller Performance Metrics',
      'Email Parsing': 'Extract Data from Supplier Emails'
    },
    think: {
      'Basic AI Analysis': 'Analyze Market Positioning Data',
      'Listing Analysis': 'Identify Listing Optimization Opportunities',
      'Insights Generation': 'Generate Strategic Marketing Insights',
      'Review Analysis': 'Process Customer Feedback Trends'
    },
    act: {
      'AI Summary': 'Create Comprehensive Action Report',
      'Push to Amazon': 'Update Amazon Product Listings',
      'Send Email': 'Distribute Weekly Performance Report',
      'Human in the Loop': 'Request Manager Approval for Changes',
      'Agent': 'Assign Specialized Agent for Task'
    },
    agent: {
      'Agent': 'Use AI Agent for Specialized Task'
    }
  };

  return contextualNaming[type]?.[option] || `${type.charAt(0).toUpperCase() + type.slice(1)} ${option}`;
};

// All block options combined for AI reference
const allBlockOptions = {
  ...flowBlockOptions,
  blockTypes: ['collect', 'think', 'act', 'agent']
};

// Predefined flows for testing/editing
const predefinedFlows: Flow[] = [
  {
    id: 'listing-launch',
    name: 'Listing Launch',
    description: 'Automates the process of launching new product listings with optimized content and keyword strategy',
    trigger: 'manual',
    blocks: [
      { id: 'c1', type: 'collect', option: 'Upload Sheet', name: 'Import Product Specifications Sheet' },
      { id: 'c2', type: 'collect', option: 'Get Keywords', name: 'Research Competitive Keywords for Category' },
      { id: 't1', type: 'think', option: 'Listing Analysis', name: 'Create Optimized Product Description' },
      { id: 'a1', type: 'act', option: 'Push to Amazon', name: 'Publish New Listings to Amazon' },
      { id: 'a2', type: 'act', option: 'Send Email', name: 'Notify Team of Successful Launch' }
    ]
  },
  {
    id: 'inventory-restock',
    name: 'Inventory Restock',
    description: 'Analyzes sales velocity and inventory levels to create timely restock recommendations',
    trigger: 'scheduled',
    blocks: [
      { id: 'c1', type: 'collect', option: 'All Listing Info', name: 'Retrieve Current Inventory Levels' },
      { id: 'c2', type: 'collect', option: 'Estimate Sales', name: 'Calculate 30-Day Sales Projections' },
      { id: 't1', type: 'think', option: 'Basic AI Analysis', name: 'Determine Optimal Restock Quantities' },
      { id: 'a1', type: 'act', option: 'AI Summary', name: 'Generate Inventory Restock Report' },
      { id: 'a2', type: 'act', option: 'Send Email', name: 'Send Restock Alert to Supply Chain Team' }
    ]
  },
  {
    id: 'customer-feedback',
    name: 'Customer Feedback Report',
    description: 'Aggregates and analyzes customer reviews and feedback across all products',
    trigger: 'scheduled',
    blocks: [
      { id: 'c1', type: 'collect', option: 'Review Information', name: 'Gather Last 30 Days of Product Reviews' },
      { id: 'c2', type: 'collect', option: 'Seller Account Feedback', name: 'Collect Seller Rating Metrics' },
      { id: 't1', type: 'think', option: 'Review Analysis', name: 'Identify Common Customer Pain Points' },
      { id: 'a1', type: 'act', option: 'AI Summary', name: 'Generate Actionable Feedback Report' },
      { id: 'a2', type: 'act', option: 'Human in the Loop', name: 'Request Product Manager Review' }
    ]
  },
  {
    id: 'quarterly-optimization',
    name: 'Quarterly Listing Optimisation',
    description: 'Performs deep analysis of listing performance and suggests optimizations every quarter',
    trigger: 'scheduled',
    blocks: [
      { id: 'c1', type: 'collect', option: 'All Listing Info', name: 'Extract Quarterly Performance Data' },
      { id: 'c2', type: 'collect', option: 'Review Information', name: 'Gather Quarterly Customer Feedback' },
      { id: 't1', type: 'think', option: 'Insights Generation', name: 'Create Listing Enhancement Strategy' },
      { id: 'a1', type: 'act', option: 'Push to Amazon', name: 'Apply Optimizations to Key Listings' },
      { id: 'a2', type: 'act', option: 'Human in the Loop', name: 'Get Marketing Approval for Changes' }
    ]
  }
];

// Block type to icon/color mapping
const blockTypeInfo = {
  collect: { icon: Database, color: 'bg-blue-500' },
  think: { icon: Brain, color: 'bg-purple-500' },
  act: { icon: Zap, color: 'bg-green-500' },
  agent: { icon: User, color: 'bg-[#9b87f5]' }
};

// Simple form type for AI prompt
type AIPromptFormValues = {
  prompt: string;
};

export default function FlowBuilder() {
  const { flowId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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
  const [isRunningFlow, setIsRunningFlow] = useState(false);

  const aiPromptForm = useForm<AIPromptFormValues>({
    defaultValues: {
      prompt: ''
    }
  });

  // Load all saved flows from localStorage
  const loadSavedFlows = (): Flow[] => {
    const savedFlowsString = localStorage.getItem('jarviFlows');
    if (savedFlowsString) {
      try {
        return JSON.parse(savedFlowsString);
      } catch (error) {
        console.error("Error parsing saved flows:", error);
      }
    }
    return predefinedFlows; // Default to predefined flows if none are saved
  };

  // Save all flows to localStorage
  const saveAllFlows = (flows: Flow[]) => {
    localStorage.setItem('jarviFlows', JSON.stringify(flows));
  };

  // Check for prompt in URL params on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const promptParam = params.get('prompt');
    
    if (promptParam) {
      // If a prompt is provided, auto-generate flow
      aiPromptForm.setValue('prompt', promptParam);
      generateFlowFromPrompt({ prompt: promptParam });
      
      // Clean up URL to prevent re-generating on refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.search]);

  // Load existing flow if editing
  useEffect(() => {
    if (flowId) {
      // Get flows from localStorage
      const allFlows = loadSavedFlows();
      const existingFlow = allFlows.find(f => f.id === flowId);
      
      if (existingFlow) {
        setFlow({...existingFlow});
      } else {
        // Fallback to predefined flows if not found in localStorage
        const predefinedFlow = predefinedFlows.find(f => f.id === flowId);
        if (predefinedFlow) {
          setFlow({...predefinedFlow});
        } else {
          toast({
            title: "Flow not found",
            description: "The requested flow could not be found",
            variant: "destructive"
          });
          navigate('/jarvi-flows');
        }
      }
    } else {
      // New flow - initialize with a default ID
      setFlow(prev => ({ ...prev, id: uuidv4() }));
    }
  }, [flowId]);

  // Add a new block of the specified type
  const addBlock = (type: 'collect' | 'think' | 'act' | 'agent') => {
    const option = type === 'agent' ? 'Agent' : flowBlockOptions[type][0];
    const newBlock: FlowBlock = {
      id: uuidv4(),
      type: type,
      option: option,
      name: getDescriptiveBlockName(type, option)
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

  // Move block up in the list
  const moveBlockUp = (index: number) => {
    if (index <= 0) return; // Can't move up if it's the first item
    
    setFlow(prev => {
      const newBlocks = [...prev.blocks];
      // Swap with previous element
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      return { ...prev, blocks: newBlocks };
    });
  };
  
  // Move block down in the list
  const moveBlockDown = (index: number) => {
    if (index >= flow.blocks.length - 1) return; // Can't move down if it's the last item
    
    setFlow(prev => {
      const newBlocks = [...prev.blocks];
      // Swap with next element
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      return { ...prev, blocks: newBlocks };
    });
  };

  // Update block option
  const updateBlockOption = (blockId: string, option: string) => {
    setFlow(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => {
        if (block.id === blockId) {
          // Update both option and generate a descriptive name if one doesn't already exist
          const updatedBlock = { ...block, option };
          
          // Only auto-update the name if it wasn't customized or is empty
          const currentName = block.name || '';
          const defaultName = getDescriptiveBlockName(block.type, block.option);
          
          // If current name matches the old default or is empty, generate a new one
          if (!currentName || currentName === defaultName) {
            updatedBlock.name = getDescriptiveBlockName(block.type, option);
          }
          
          return updatedBlock;
        }
        return block;
      })
    }));
  };

  // Update block name
  const updateBlockName = (blockId: string, name: string) => {
    setFlow(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId ? { ...block, name } : block
      )
    }));
  };

  // Generate flow from AI prompt
  const generateFlowFromPrompt = async (data: AIPromptFormValues) => {
    setIsGenerating(true);
    setAiError(null);
    
    try {
      console.log("Sending prompt to AI:", data.prompt);
      const response = await supabase.functions.invoke("chat", {
        body: {
          prompt: `Create a flow for an Amazon seller based on this description: "${data.prompt}". 
          The flow should include appropriate blocks from these available options:
          ${JSON.stringify(allBlockOptions)}. 
          
          A flow typically has 3-5 blocks, usually starting with collect blocks, followed by think blocks, and ending with act blocks.
          
          Important: Provide descriptive names for each block that clearly explain what each step does.`
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

      // Check for backend success status
      if (response.data.success === false) {
        throw new Error(`Response Error: ${response.data.error}`);
      }

      // Handle multiple possible response formats
      let generatedFlow;
      
      if (response.data.generatedFlow) {
        // If we're getting the expected format with generatedFlow
        console.log("Found generatedFlow in response:", response.data.generatedFlow);
        generatedFlow = response.data.generatedFlow;
      } else if (response.data.text) {
        // If we're getting a text response, try to parse it as JSON
        console.log("Found text in response, attempting to parse as JSON:", response.data.text);
        try {
          // This might be JSON wrapped in markdown or just plain JSON
          const textContent = response.data.text;
          // Try to extract JSON if it's wrapped in markdown code blocks
          const jsonMatch = textContent.match(/```(?:json)?([\s\S]*?)```/) || 
                            textContent.match(/{[\s\S]*}/);
                            
          const jsonContent = jsonMatch ? jsonMatch[1] || jsonMatch[0] : textContent;
          generatedFlow = JSON.parse(jsonContent.trim());
          console.log("Successfully parsed JSON from text:", generatedFlow);
        } catch (jsonError) {
          console.error("Failed to parse JSON from text:", jsonError);
          throw new Error("Could not parse flow data from the AI response");
        }
      } else {
        // No recognized format found
        console.error("Unrecognized response format:", response.data);
        throw new Error("Unexpected response format from the API");
      }
      
      // Show warning if we're using a fallback flow
      if (response.data.warning) {
        console.warn(response.data.warning);
        toast({
          title: "Warning",
          description: response.data.warning,
          variant: "warning"
        });
      }
      
      console.log("Final generated flow:", generatedFlow);
      
      // Validate the flow structure
      if (!generatedFlow.name || !generatedFlow.description || !Array.isArray(generatedFlow.blocks)) {
        throw new Error("Invalid flow structure: missing required properties");
      }

      // Create flow blocks from AI response
      const newBlocks: FlowBlock[] = generatedFlow.blocks.map((block: any) => {
        // Validate block type - make sure to include 'agent' here
        if (!block.type || !['collect', 'think', 'act', 'agent'].includes(block.type)) {
          console.warn(`Invalid block type: ${block.type}, using 'collect' as fallback`);
          const fallbackType = 'collect' as BlockCategory;
          const fallbackOption = flowBlockOptions[fallbackType][0];
          return {
            id: uuidv4(),
            type: fallbackType,
            option: fallbackOption,
            name: block.name || getDescriptiveBlockName(fallbackType, fallbackOption)
          };
        }
        
        // Validate block option
        if (!block.option || !flowBlockOptions[block.type]?.includes(block.option)) {
          console.warn(`Using fallback option for invalid option: ${block.option}`);
          // Use the first available option as fallback
          const fallbackOption = flowBlockOptions[block.type][0];
          return {
            id: uuidv4(),
            type: block.type,
            option: fallbackOption,
            name: block.name || getDescriptiveBlockName(block.type, fallbackOption)
          };
        }
        
        return {
          id: uuidv4(),
          type: block.type,
          option: block.option,
          name: block.name || getDescriptiveBlockName(block.type, block.option)
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
    // Input validation
    if (!flow.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a name for your flow",
        variant: "destructive"
      });
      return;
    }

    if (flow.blocks.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one block to your flow",
        variant: "destructive"
      });
      return;
    }

    try {
      // Get all current flows
      const allFlows = loadSavedFlows();
      
      // Find the index of the current flow if it exists
      const existingFlowIndex = allFlows.findIndex(f => f.id === flow.id);
      
      if (existingFlowIndex >= 0) {
        // Update existing flow
        allFlows[existingFlowIndex] = {...flow};
      } else {
        // Add new flow
        allFlows.push({...flow});
      }
      
      // Save all flows back to localStorage
      saveAllFlows(allFlows);
      
      console.log('Flow saved:', flow);
      
      toast({
        title: "Flow saved successfully",
        description: `${flow.name} has been saved.`
      });
      
      // We're not navigating away after saving - just stay on this page
    } catch (error) {
      console.error("Error saving flow:", error);
      toast({
        title: "Error saving flow",
        description: "An unexpected error occurred while saving your flow.",
        variant: "destructive"
      });
    }
  };

  // Force adjustment of all textareas when blocks change
  React.useEffect(() => {
    // Initial delay for component rendering
    const timer = setTimeout(() => {
      // Find all textareas with the flow-block-name-input class
      document.querySelectorAll('.flow-block-name-input').forEach((element) => {
        // Trigger multiple resize events with increasing delays
        [0, 100, 300, 600].forEach(delay => {
          setTimeout(() => {
            const event = new Event('input', { bubbles: true });
            element.dispatchEvent(event);
          }, delay);
        });
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [flow.blocks]);
  
  // Add a new function to start the flow
  const handleStartFlow = async () => {
    try {
      // Validate flow before starting
      if (!flow.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Please provide a name for your flow",
          variant: "destructive"
        });
        return;
      }

      if (flow.blocks.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please add at least one block to your flow",
          variant: "destructive"
        });
        return;
      }

      setIsRunningFlow(true);
      toast({
        title: "Starting flow",
        description: "Creating tasks from flow steps..."
      });

      // Save the flow first
      const allFlows = loadSavedFlows();
      const existingFlowIndex = allFlows.findIndex(f => f.id === flow.id);
      
      if (existingFlowIndex >= 0) {
        allFlows[existingFlowIndex] = {...flow};
      } else {
        allFlows.push({...flow});
      }
      
      saveAllFlows(allFlows);
      
      // Create subtasks from flow blocks
      const subtasks = flow.blocks.map(block => ({
        title: block.name || `${block.type}: ${block.option}`,
        description: `Flow step: ${block.option}`
      }));
      
      // Create the main task with subtasks
      const task = await createTask({
        title: `Flow: ${flow.name}`,
        description: flow.description,
        status: 'In Progress', // Start as In Progress
        priority: 'MEDIUM',
        category: 'FLOW',
        data: { flowId: flow.id, flowTrigger: flow.trigger }
      }, subtasks);
      
      if (!task) {
        throw new Error('Failed to create task from flow');
      }
      
      toast({
        title: "Flow started successfully",
        description: "Flow is now running. Opening task view..."
      });
      
      // Navigate to task view with the new task ID
      navigate(`/task/${task.id}`);
      
    } catch (error) {
      console.error('Error running flow:', error);
      toast({
        title: "Error starting flow",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRunningFlow(false);
    }
  };

  // Add state for selected agent when Agent option is chosen
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  // Add a function to handle agent selection
  const handleAgentSelection = (blockId: string, agentId: string) => {
    const selectedAgent = agentsData.find(agent => agent.id === agentId);
    
    if (selectedAgent) {
      setFlow(prev => ({
        ...prev,
        blocks: prev.blocks.map(block => {
          if (block.id === blockId) {
            return {
              ...block,
              agentId: agentId,
              agentName: selectedAgent.name,
              // Update the block name if using default naming
              name: block.name === getDescriptiveBlockName(block.type, block.option) 
                ? `Use ${selectedAgent.name} Agent for ${selectedAgent.domain}`
                : block.name
            };
          }
          return block;
        })
      }));
      setSelectedAgent(agentId);
    }
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
            
            {flow.trigger === 'manual' && (
              <Button 
                onClick={handleStartFlow}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isRunningFlow || flow.blocks.length === 0}
              >
                {isRunningFlow ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start Flow
                  </>
                )}
              </Button>
            )}
            
            <Button 
              onClick={saveFlow}
              className="bg-[#4457ff] hover:bg-[#4457ff]/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Flow
            </Button>
          </div>
        </div>
        
        {/* AI Prompt section */}
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
                        <HelpCircle className="h-3 w-3 mr-1" />
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
          {/* Flow details section */}
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
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Flow Blocks</h2>
              
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addBlock('collect')}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                >
                  <Database className="h-4 w-4 mr-1" />
                  Collect
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addBlock('think')}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                >
                  <Brain className="h-4 w-4 mr-1" />
                  Think
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addBlock('act')}
                  className="border-green-300 text-green-700 hover:bg-green-50 hover:text-green-800"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Act
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addBlock('agent')}
                  className="border-[#9b87f5] text-[#7356f1] hover:bg-[#9b87f5]/10 hover:text-[#6243e0]"
                >
                  <User className="h-4 w-4 mr-1" />
                  Agent
                </Button>
              </div>
            </div>

            {/* Updated Flow Block List with cleaner styling */}
            <div className="space-y-4">
              {flow.blocks.map((block, index) => {
                const BlockIcon = blockTypeInfo[block.type].icon;
                const blockColor = blockTypeInfo[block.type].color;
                const blockDescription = blockOptionDescriptions[block.type]?.[block.option];
                
                return (
                  <div 
                    key={block.id} 
                    className="group border border-gray-200 rounded-lg bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-4 relative">
                      {/* Block content with cleaner styling */}
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          {/* Left side - Block name and icon */}
                          <div className="flex items-start gap-3">
                            <div className={`${blockColor} p-2.5 rounded-full flex-shrink-0`}>
                              <BlockIcon className="h-5 w-5 text-white" />
                            </div>
                            
                            <div className="flex-1">
                              <label className="text-sm text-gray-500 mb-1">Block Name</label>
                              <Textarea
                                id={`block-name-${block.id}`}
                                className="text-lg font-medium border-0 focus:ring-0 focus:border-0 resize-none overflow-hidden p-0 bg-transparent"
                                value={block.name || ""}
                                onChange={(e) => updateBlockName(block.id, e.target.value)}
                                rows={1}
                                placeholder="Give this block a descriptive name"
                              />
                              {blockDescription && (
                                <p className="text-gray-500 text-sm mt-1.5">{blockDescription}</p>
                              )}
                              <div className="text-sm text-gray-400 mt-2">
                                Type: {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                              </div>
                            </div>
                          </div>

                          {/* Right side - Block action and controls */}
                          <div className="flex flex-col items-end gap-4">
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      disabled={index === 0}
                                      onClick={() => moveBlockUp(index)}
                                      className="h-8 w-8"
                                    >
                                      <MoveUp className="h-4 w-4 text-gray-500" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Move up</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      disabled={index === flow.blocks.length - 1}
                                      onClick={() => moveBlockDown(index)}
                                      className="h-8 w-8"
                                    >
                                      <MoveDown className="h-4 w-4 text-gray-500" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Move down</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                                      onClick={() => removeBlock(block.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Remove</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            
                            <div>
                              <label className="text-sm text-gray-500 mb-1 flex items-center justify-end">
                                Block Action
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="h-3.5 w-3.5 ml-1 text-gray-400" />
                                    </TooltipTrigger>
                                    <TooltipContent>Select the specific action for this block</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </label>
                              
                              <Select 
                                value={block.option} 
                                onValueChange={(value) => updateBlockOption(block.id, value)}
                              >
                                <SelectTrigger id={`block-option-${block.id}`} className="w-[200px] border bg-white">
                                  <SelectValue placeholder="Select option" />
                                </SelectTrigger>
                                <SelectContent>
                                  {flowBlockOptions[block.type].map((option) => (
                                    <SelectItem key={option} value={option}>
                                      {option}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              
                              {/* Agent selection for specific block types */}
                              {(block.type === 'act' && block.option === 'Agent') || block.type === 'agent' ? (
                                <div className="mt-2">
                                  <Select
                                    value={block.agentId || ''}
                                    onValueChange={(value) => handleAgentSelection(block.id, value)}
                                  >
                                    <SelectTrigger className="w-[200px] border bg-white">
                                      <SelectValue placeholder="Select agent" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {agentsData.map((agent) => (
                                        <SelectItem key={agent.id} value={agent.id}>
                                          {agent.name}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Down arrow connecting blocks */}
                    {index < flow.blocks.length - 1 && (
                      <div className="flex justify-center my-1">
                        <ArrowDown className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                  </div>
                );
              })}
              
              {flow.blocks.length === 0 && (
                <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                  <div className="text-muted-foreground text-center">
                    <p>No blocks added yet</p>
                    <p className="text-sm mt-1">Click one of the buttons above to add your first block</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
