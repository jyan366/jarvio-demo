import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Flow, FlowBlock, TriggerType } from '@/components/jarvi-flows/FlowsGrid';
import { createTask } from '@/lib/supabaseTasks';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Import refactored components
import { FlowHeader } from '@/components/jarvi-flows/builder/FlowHeader';
import { AIPromptSection } from '@/components/jarvi-flows/builder/AIPromptSection';
import { FlowDetailsSection } from '@/components/jarvi-flows/builder/FlowDetailsSection';
import { FlowBlocksList } from '@/components/jarvi-flows/builder/FlowBlocksList';
import { BlockCategory } from '@/data/flowBlockOptions';
// Import agentsData directly instead of using require
import { agentsData } from '@/data/agentsData';
import { useFlowBlockConfig } from '@/hooks/useFlowBlockConfig';
import { FlowBlockDatabaseSync } from '@/components/jarvi-flows/FlowBlockDatabaseSync';

// Default flow block options to use as fallback
const defaultFlowBlockOptions = {
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
    'Human in the Loop',
    'Agent'
  ],
  agent: [
    'Agent'
  ]
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
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const { blockConfigs, updateBlockConfig } = useFlowBlockConfig();

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

  // Add a new state to store available flow block options from the database
  const [availableBlockOptions, setAvailableBlockOptions] = useState<Record<string, string[]>>(defaultFlowBlockOptions);

  // Function to load flow block options from the database
  const loadFlowBlockOptions = async () => {
    try {
      const { data, error } = await supabase
        .from('flow_block_configs')
        .select('block_type, block_name')
        .order('block_name');

      if (error) {
        console.error('Error fetching flow block options:', error);
        // Fallback to predefined options from defaultFlowBlockOptions if there's an error
        return;
      }

      if (data && data.length > 0) {
        // Group blocks by type
        const options: Record<string, string[]> = {
          collect: [],
          think: [],
          act: [],
          agent: []
        };

        data.forEach(block => {
          if (options[block.block_type]) {
            options[block.block_type].push(block.block_name);
          }
        });

        setAvailableBlockOptions(options);
        console.log('Loaded flow block options from database:', options);
      } else {
        // If no data, use defaults
        console.log('No flow block options found in database, using defaults');
        setAvailableBlockOptions(defaultFlowBlockOptions);
      }
    } catch (error) {
      console.error('Error in loadFlowBlockOptions:', error);
      // Use default options on error
      setAvailableBlockOptions(defaultFlowBlockOptions);
    }
  };

  // Load flow block options when component mounts
  useEffect(() => {
    loadFlowBlockOptions();
  }, []);

  // Parse query parameters for pre-generated flow
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const generatedFlowParam = queryParams.get('generatedFlow');
    
    if (generatedFlowParam) {
      try {
        const generatedFlow = JSON.parse(decodeURIComponent(generatedFlowParam));
        console.log("Received pre-generated flow:", generatedFlow);
        
        if (generatedFlow.name && generatedFlow.description && Array.isArray(generatedFlow.blocks)) {
          // Convert any block objects to proper FlowBlock format with ids
          const newBlocks = generatedFlow.blocks.map((block: any) => ({
            id: block.id || uuidv4(),
            type: block.type,
            option: block.option,
            name: block.name || getDescriptiveBlockName(block.type, block.option)
          }));
          
          setFlow(prev => ({
            ...prev,
            id: uuidv4(), // Generate a new ID for this flow
            name: generatedFlow.name,
            description: generatedFlow.description,
            blocks: newBlocks
          }));
          
          toast({
            title: "Flow created successfully",
            description: `${newBlocks.length} blocks have been added to your flow.`
          });
          
          // Clear the URL param without refreshing the page
          navigate('/jarvi-flows/builder', { replace: true });
        }
      } catch (error) {
        console.error("Error parsing generated flow:", error);
        toast({
          title: "Error parsing generated flow",
          description: "The flow data could not be parsed.",
          variant: "destructive"
        });
      }
    } else if (flowId) {
      // Load existing flow if editing
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
  }, [flowId, location.search]);

  // Handle agent selection
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

  // Generate flow from AI prompt
  const generateFlowFromPrompt = async (data: AIPromptFormValues) => {
    setIsGenerating(true);
    setAiError(null);
    
    try {
      console.log("Sending prompt to AI:", data.prompt);
      
      // Call our dedicated generate-flow function
      const response = await supabase.functions.invoke("generate-flow", {
        body: {
          prompt: data.prompt,
          blockOptions: availableBlockOptions
        }
      });

      console.log("Raw API response:", response);

      // Check for API errors first
      if (response.error) {
        console.error("API Error:", response.error);
        throw new Error(`API Error: ${response.error.message || "Unknown API error"}`);
      }
      
      if (!response.data) {
        console.error("No data returned from API");
        throw new Error("No data returned from API");
      }

      // Check for success status in the response
      if (response.data.success === false) {
        console.error("Function returned error:", response.data.error);
        throw new Error(`Error: ${response.data.error || "Unknown error in flow generation"}`);
      }
      
      // Extract the generated flow from the response
      const generatedFlow = response.data.generatedFlow;
      
      if (!generatedFlow) {
        console.error("No flow data in response:", response.data);
        throw new Error("No flow data returned from the API");
      }
      
      console.log("Generated flow:", generatedFlow);
      
      // Validate the flow structure
      if (!generatedFlow.name || !generatedFlow.description || !Array.isArray(generatedFlow.blocks)) {
        console.error("Invalid flow structure:", generatedFlow);
        throw new Error("Invalid flow structure: missing required properties");
      }

      // Create flow blocks from AI response
      const newBlocks: FlowBlock[] = generatedFlow.blocks.map((block: any) => {
        // Validate block type - make sure to include 'agent' here
        if (!block.type || !['collect', 'think', 'act', 'agent'].includes(block.type)) {
          console.warn(`Invalid block type: ${block.type}, using 'collect' as fallback`);
          const fallbackType = 'collect' as BlockCategory;
          const fallbackOption = availableBlockOptions[fallbackType][0] || defaultFlowBlockOptions[fallbackType][0];
          return {
            id: uuidv4(),
            type: fallbackType,
            option: fallbackOption,
            name: block.name || getDescriptiveBlockName(fallbackType, fallbackOption)
          };
        }
        
        // Validate block option
        if (!block.option || !availableBlockOptions[block.type]?.includes(block.option)) {
          console.warn(`Using fallback option for invalid option: ${block.option}`);
          // Use the first available option as fallback
          const fallbackOption = availableBlockOptions[block.type][0] || defaultFlowBlockOptions[block.type][0];
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

  // Helper function for descriptive block names - used by handleAgentSelection
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

  // Update flow field handlers
  const updateFlowName = (name: string) => {
    setFlow(prev => ({ ...prev, name }));
  };

  const updateFlowDescription = (description: string) => {
    setFlow(prev => ({ ...prev, description }));
  };

  const updateFlowTrigger = (trigger: TriggerType) => {
    setFlow(prev => ({ ...prev, trigger }));
  };

  const updateFlowBlocks = (blocks: FlowBlock[]) => {
    setFlow(prev => ({ ...prev, blocks }));
  };

  return (
    <MainLayout>
      {/* Add the component that syncs flow blocks with the database */}
      <FlowBlockDatabaseSync />

      <div className="space-y-6">
        <FlowHeader
          showAIPrompt={showAIPrompt}
          setShowAIPrompt={setShowAIPrompt}
          isManualTrigger={flow.trigger === 'manual'}
          isRunningFlow={isRunningFlow}
          flowHasBlocks={flow.blocks.length > 0}
          onStartFlow={handleStartFlow}
          onSaveFlow={saveFlow}
        />
        
        {/* AI Prompt section */}
        {showAIPrompt && (
          <AIPromptSection
            form={aiPromptForm}
            onSubmit={generateFlowFromPrompt}
            isGenerating={isGenerating}
            aiError={aiError}
          />
        )}
        
        <div className="space-y-6">
          {/* Flow details section */}
          <FlowDetailsSection
            name={flow.name}
            setName={updateFlowName}
            description={flow.description}
            setDescription={updateFlowDescription}
            trigger={flow.trigger}
            setTrigger={updateFlowTrigger}
          />
          
          {/* Flow blocks section with improved UI */}
          <FlowBlocksList
            blocks={flow.blocks}
            setBlocks={updateFlowBlocks}
            handleAgentSelection={handleAgentSelection}
            availableBlockOptions={availableBlockOptions}
          />
        </div>
      </div>
    </MainLayout>
  );
}
