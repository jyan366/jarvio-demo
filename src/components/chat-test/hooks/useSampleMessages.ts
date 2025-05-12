
import { useState, useEffect } from 'react';
import type { Message, Subtask } from "../AgentChatInterface";

// Sample subtasks for Listing Launch Flow
const sampleSubtasks: Subtask[] = [
  { id: '1', title: 'Analyze market competition', done: false },
  { id: '2', title: 'Optimize product title and bullets', done: false },
  { id: '3', title: 'Set up pricing strategy', done: false },
  { id: '4', title: 'Configure PPC advertising', done: false },
  { id: '5', title: 'Finalize launch schedule', done: false },
];

// Sample script of agent messages for Listing Launch Flow
const agentScript = [
  "Hi, I'm Jarvio. Let's get started on your listing launch flow. I'll help you launch your product effectively.",
  "I've executed step 1 and analyzed your market competition. Here are the findings:\n\n• Main competitors: GoodKnives (4.6★), KitchenElite (4.4★), ChefsPro (4.7★)\n• Average price point: $42.99\n• Key features highlighted: stainless steel, dishwasher safe, ergonomic handles\n• Common keywords: professional knife set, chef knife set, kitchen knife set",
  "Now let's optimize your product title and bullets based on the competitive analysis.",
  "I've executed step 2 and optimized your listing content:\n\n• New Title: 'Professional 15-Piece Kitchen Knife Set with Block | Premium Stainless Steel Chef Knives with Ergonomic Handles'\n\n• Improved Bullet Points:\n1. COMPLETE PREMIUM SET - 15-piece professional-grade knife set including chef knife, bread knife, carving knife, utility knife, paring knife, steak knives, and kitchen scissors\n2. SUPERIOR MATERIALS - Forged from high-carbon stainless steel ensuring lasting sharpness and durability\n3. COMFORT GRIP HANDLES - Ergonomically designed handles provide perfect balance and control while cutting",
  "Now let's work on your pricing strategy based on the market analysis.",
  "I've executed step 3 and developed your pricing strategy:\n\n• Launch Price: $39.99 (below market average to gain initial sales and reviews)\n• Post-Launch Price: $47.99 (after 30 days and 25+ reviews)\n• Coupon Strategy: 15% off coupon for first 2 weeks\n• Bundle Option: Consider creating a bundle with your cutting board at $54.99",
  "Great! Now let's configure your PPC advertising campaign for the launch.",
  "I've executed step 4 and set up your PPC strategy:\n\n• Day 1-7: Discovery campaign with $25/day budget targeting broad keywords\n• Day 8-21: Auto campaign at $40/day + manual campaign for top 20 converting keywords\n• Suggested Bid Range: $0.65-$1.20\n• Target ACOS: 35% during launch, 25% post-stabilization\n• Primary Keywords: professional knife set, stainless steel knives, chef knife set, kitchen knife block set",
  "Finally, let's finalize your launch schedule for maximum impact.",
  "I've executed step 5 and created your launch timeline:\n\n• Week 1: Soft launch with friends & family purchases + reviews\n• Week 2: Social media announcement + influencer outreach\n• Week 3: Begin email marketing campaign to existing customers\n• Week 4: Increase PPC budget by 30% + launch Amazon Posts\n• Week 5: Review performance and adjust strategy\n\nRecommended Launch Date: Tuesday, June 4th (optimal day based on category traffic)"
];

const executeSteps = [
  "Step 1: Analyzing market competition...", 
  "Step 2: Optimizing product title and bullets...", 
  "Step 3: Setting up pricing strategy...", 
  "Step 4: Configuring PPC advertising...", 
  "Step 5: Finalizing launch schedule..."
];

export function useSampleMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
  const [subtasks, setSubtasks] = useState<Subtask[]>(sampleSubtasks);
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState<number>(0);
  const [executionState, setExecutionState] = useState<'idle' | 'executing' | 'complete'>('idle');
  
  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '0',
        text: agentScript[0],
        isUser: false,
        timestamp: new Date(),
        isStepCompletion: false
      }]);
      setCurrentMessageIndex(1);
    }
  }, [messages]);
  
  // Add a user message to the chat
  const addUserMessage = (text: string) => {
    setMessages(prev => [
      ...prev, 
      {
        id: crypto.randomUUID(),
        text,
        isUser: true,
        timestamp: new Date()
      }
    ]);
  };
  
  // Add an agent message to the chat
  const addAgentMessage = (text: string, isStepCompletion = false, stepNumber?: number) => {
    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text,
        isUser: false,
        timestamp: new Date(),
        isStepCompletion,
        stepNumber
      }
    ]);
  };
  
  // Add a loading message to simulate step execution
  const addLoadingMessage = (stepNumber: number) => {
    setMessages(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        text: executeSteps[stepNumber - 1],
        isUser: false,
        timestamp: new Date(),
        isLoading: true,
        stepNumber
      }
    ]);
  };
  
  // Execute the next step in the flow
  const executeNextStep = () => {
    if (currentSubtaskIndex >= subtasks.length) return;
    
    const stepNumber = currentSubtaskIndex + 1;
    
    // First show loading message
    addLoadingMessage(stepNumber);
    
    // After a delay, show the completion message and update subtask state
    setTimeout(() => {
      // Remove loading message and add completion message
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      // Add step completion message
      addAgentMessage(agentScript[currentMessageIndex], true, stepNumber);
      
      // Update subtask as completed
      setSubtasks(prev => prev.map((st, idx) => 
        idx === currentSubtaskIndex ? { ...st, done: true } : st
      ));
      
      // Move to next subtask if not the last one
      if (currentSubtaskIndex < subtasks.length - 1) {
        setCurrentSubtaskIndex(currentSubtaskIndex + 1);
        
        // Add transition message to next step after a delay
        setTimeout(() => {
          addAgentMessage(agentScript[currentMessageIndex + 1]);
          setCurrentMessageIndex(currentMessageIndex + 2);
        }, 1000);
      }
      
      setCurrentMessageIndex(currentMessageIndex + 2);
    }, 2000);
  };
  
  return {
    messages,
    subtasks,
    currentSubtaskIndex,
    addUserMessage,
    addAgentMessage,
    executeNextStep
  };
}
