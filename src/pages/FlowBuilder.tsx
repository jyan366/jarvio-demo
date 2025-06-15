import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Flow, FlowBlock, FlowStep } from '@/types/flowTypes';
import { TriggerType } from '@/components/jarvi-flows/FlowsGrid';
import { fetchTaskById, updateUnifiedTask, createUnifiedTask } from '@/lib/unifiedTasks';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';

// Import refactored components
import { FlowHeader } from '@/components/jarvi-flows/builder/FlowHeader';
import { AIPromptSection } from '@/components/jarvi-flows/builder/AIPromptSection';
import { FlowDetailsSection } from '@/components/jarvi-flows/builder/FlowDetailsSection';
import { FlowStepsEditor } from '@/components/jarvi-flows/builder/FlowStepsEditor';
import { BlockCategory, flowBlockOptions } from '@/data/flowBlockOptions';
import { agentsData } from '@/data/agentsData';
import { useFlowBlockConfig } from '@/hooks/useFlowBlockConfig';
import { FlowBlockDatabaseSync } from '@/components/jarvi-flows/FlowBlockDatabaseSync';

// Default flow block options to use as fallback
const defaultFlowBlockOptions = flowBlockOptions;

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
    ],
    steps: [
      { id: 's1', title: 'Import Product Data', description: 'Upload product specifications', order: 0, blockId: 'c1' },
      { id: 's2', title: 'Research Keywords', description: 'Find competitive keywords', order: 1, blockId: 'c2' },
      { id: 's3', title: 'Optimize Listing', description: 'Create optimized description', order: 2, blockId: 't1' },
      { id: 's4', title: 'Publish Listings', description: 'Push to Amazon', order: 3, blockId: 'a1' },
      { id: 's5', title: 'Notify Team', description: 'Send completion email', order: 4, blockId: 'a2' }
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
    blocks: [],
    steps: []
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
    return predefinedFlows;
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
        return;
      }

      if (data && data.length > 0) {
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
        console.log('No flow block options found in database, using defaults');
        setAvailableBlockOptions(defaultFlowBlockOptions);
      }
    } catch (error) {
      console.error('Error in loadFlowBlockOptions:', error);
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
          // Convert AI-generated blocks to steps and blocks structure
          const newSteps: FlowStep[] = [];
          const newBlocks: FlowBlock[] = [];
          
          generatedFlow.blocks.forEach((block: any, index: number) => {
            const blockId = uuidv4();
            const stepId = uuidv4();
            
            // Create step
            newSteps.push({
              id: stepId,
              title: block.name || `Step ${index + 1}`,
              description: block.description || '',
              completed: false,
              order: index,
              blockId: blockId
            });
            
            // Create block
            const blockType = block.type && ['collect', 'think', 'act', 'agent'].includes(block.type) 
              ? block.type 
              : 'collect';
            
            const validOptions = availableBlockOptions[blockType] || defaultFlowBlockOptions[blockType as BlockCategory];
            
            let blockOption = block.option;
            if (!validOptions.includes(blockOption)) {
              console.warn(`Invalid block option: ${blockOption} for type ${blockType}, using fallback`);
              blockOption = validOptions[0] || 'User Text';
            }
            
            newBlocks.push({
              id: blockId,
              type: blockType,
              option: blockOption,
              name: block.name || getDescriptiveBlockName(blockType, blockOption)
            });
          });
          
          setFlow(prev => ({
            ...prev,
            id: uuidv4(),
            name: generatedFlow.name,
            description: generatedFlow.description,
            blocks: newBlocks,
            steps: newSteps
          }));
          
          toast({
            title: "Flow created successfully",
            description: `${newSteps.length} steps have been added to your flow.`
          });
          
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
      // Load existing flow from unified tasks
      const loadFlowFromTask = async () => {
        try {
          const task = await fetchTaskById(flowId);
          if (task && task.saved_to_flows) {
            setFlow({
              id: task.id,
              name: task.title,
              description: task.description,
              trigger: task.trigger || 'manual',
              blocks: task.data?.flowBlocks || [],
              steps: task.data?.flowSteps || []
            });
          } else {
            toast({
              title: "Flow not found",
              description: "The requested flow could not be found",
              variant: "destructive"
            });
            navigate('/jarvi-flows');
          }
        } catch (error) {
          console.error('Error loading flow:', error);
          toast({
            title: "Error loading flow",
            description: "Failed to load the flow",
            variant: "destructive"
          });
          navigate('/jarvi-flows');
        }
      };
      
      loadFlowFromTask();
    } else {
      // New flow - initialize with a default ID
      setFlow(prev => ({ ...prev, id: uuidv4() }));
    }
  }, [flowId, location.search, availableBlockOptions, navigate, toast]);

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

  // Handle AI-generated steps and blocks
  const handleAIStepsGenerated = async (steps: FlowStep[], blocks: FlowBlock[]) => {
    // Extract flow name and description from the first step's title or use defaults
    const flowName = steps.length > 0 ? `Generated Flow - ${steps[0].title}` : "New AI Flow";
    const flowDescription = steps.length > 0 ? `AI-generated flow with ${steps.length} steps` : "Flow created from AI prompt";
    
    setFlow(prev => ({
      ...prev,
      name: flowName,
      description: flowDescription,
      blocks: blocks,
      steps: steps
    }));
    
    toast({
      title: "Flow created successfully",
      description: `${steps.length} steps have been added to your flow.`
    });
    
    setShowAIPrompt(false);
  };

  // Save flow - now saves as unified task with saved_to_flows = true
  const saveFlow = async () => {
    if (!flow.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a name for your flow",
        variant: "destructive"
      });
      return;
    }

    if (flow.steps.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one step to your flow",
        variant: "destructive"
      });
      return;
    }

    try {
      const taskData = {
        title: flow.name,
        description: flow.description,
        status: 'Not Started' as const,
        priority: 'MEDIUM' as const,
        category: 'FLOW',
        task_type: 'task' as const,
        trigger: flow.trigger,
        saved_to_flows: true,
        data: {
          flowId: flow.id,
          flowSteps: flow.steps,
          flowBlocks: flow.blocks,
          totalSteps: flow.steps.length,
          createdAt: new Date().toISOString()
        }
      };

      if (flowId) {
        // Update existing flow
        await updateUnifiedTask(flowId, taskData);
      } else {
        // Create new flow
        const newTask = await createUnifiedTask(taskData);
        if (newTask) {
          setFlow(prev => ({ ...prev, id: newTask.id }));
          navigate(`/jarvi-flows/builder/${newTask.id}`, { replace: true });
        }
      }
      
      toast({
        title: "Flow saved successfully",
        description: `${flow.name} has been saved.`
      });
    } catch (error) {
      console.error("Error saving flow:", error);
      toast({
        title: "Error saving flow",
        description: "An unexpected error occurred while saving your flow.",
        variant: "destructive"
      });
    }
  };

  // Update the handleStartFlow function to work with unified tasks
  const handleStartFlow = async () => {
    try {
      if (!flow.name.trim()) {
        toast({
          title: "Validation Error",
          description: "Please provide a name for your flow",
          variant: "destructive"
        });
        return;
      }

      if (flow.steps.length === 0) {
        toast({
          title: "Validation Error",
          description: "Please add at least one step to your flow",
          variant: "destructive"
        });
        return;
      }

      setIsRunningFlow(true);
      toast({
        title: "Starting flow",
        description: "Preparing flow for execution..."
      });

      // Save the flow first if it hasn't been saved
      if (!flowId) {
        await saveFlow();
      }
      
      // Use the current flow ID (either existing or newly created)
      const currentFlowId = flowId || flow.id;
      
      toast({
        title: "Flow started successfully",
        description: "Opening flow execution view..."
      });
      
      navigate(`/task/${currentFlowId}`);
      
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

  // Helper function for descriptive block names
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

  const updateFlowSteps = (steps: FlowStep[]) => {
    setFlow(prev => ({ ...prev, steps }));
  };

  const updateFlowBlocks = (blocks: FlowBlock[]) => {
    setFlow(prev => ({ ...prev, blocks }));
  };

  return (
    <MainLayout>
      <FlowBlockDatabaseSync />

      <div className="space-y-6">
        <FlowHeader
          showAIPrompt={showAIPrompt}
          setShowAIPrompt={setShowAIPrompt}
          isManualTrigger={flow.trigger === 'manual'}
          isRunningFlow={isRunningFlow}
          flowHasBlocks={flow.steps.length > 0}
          onStartFlow={handleStartFlow}
          onSaveFlow={saveFlow}
        />
        
        {showAIPrompt && (
          <AIPromptSection
            form={aiPromptForm}
            onSubmit={handleAIStepsGenerated}
            isGenerating={isGenerating}
            aiError={aiError}
          />
        )}
        
        <div className="space-y-6">
          <FlowDetailsSection
            name={flow.name}
            setName={updateFlowName}
            description={flow.description}
            setDescription={updateFlowDescription}
            trigger={flow.trigger}
            setTrigger={updateFlowTrigger}
          />
          
          <FlowStepsEditor
            steps={flow.steps}
            blocks={flow.blocks}
            onStepsChange={updateFlowSteps}
            onBlocksChange={updateFlowBlocks}
            availableBlockOptions={availableBlockOptions}
          />
        </div>
      </div>
    </MainLayout>
  );
}
