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
  "I've analyzed your market competition. Here are the findings:\n\n• Main competitors: GoodKnives (4.6★), KitchenElite (4.4★), ChefsPro (4.7★)\n• Average price point: $42.99\n• Key features highlighted: stainless steel, dishwasher safe, ergonomic handles\n• Common keywords: professional knife set, chef knife set, kitchen knife set",
  "Now I'll work on optimizing your product title and bullets based on the competitive analysis.",
  "I've optimized your listing content:\n\n• New Title: 'Professional 15-Piece Kitchen Knife Set with Block | Premium Stainless Steel Chef Knives with Ergonomic Handles'\n\n• Improved Bullet Points:\n1. COMPLETE PREMIUM SET - 15-piece professional-grade knife set including chef knife, bread knife, carving knife, utility knife, paring knife, steak knives, and kitchen scissors\n2. SUPERIOR MATERIALS - Forged from high-carbon stainless steel ensuring lasting sharpness and durability\n3. COMFORT GRIP HANDLES - Ergonomically designed handles provide perfect balance and control while cutting",
  "Now I'll develop your pricing strategy based on the market analysis.",
  "I've developed your pricing strategy:\n\n• Launch Price: $39.99 (below market average to gain initial sales and reviews)\n• Post-Launch Price: $47.99 (after 30 days and 25+ reviews)\n• Coupon Strategy: 15% off coupon for first 2 weeks\n• Bundle Option: Consider creating a bundle with your cutting board at $54.99",
  "Let's configure your PPC advertising campaign for the launch.",
  "I've set up your PPC strategy:\n\n• Day 1-7: Discovery campaign with $25/day budget targeting broad keywords\n• Day 8-21: Auto campaign at $40/day + manual campaign for top 20 converting keywords\n• Suggested Bid Range: $0.65-$1.20\n• Target ACOS: 35% during launch, 25% post-stabilization\n• Primary Keywords: professional knife set, stainless steel knives, chef knife set, kitchen knife block set",
  "Finally, I'll create your launch schedule for maximum impact.",
  "I've created your launch timeline:\n\n• Week 1: Soft launch with friends & family purchases + reviews\n• Week 2: Social media announcement + influencer outreach\n• Week 3: Begin email marketing campaign to existing customers\n• Week 4: Increase PPC budget by 30% + launch Amazon Posts\n• Week 5: Review performance and adjust strategy\n\nRecommended Launch Date: Tuesday, June 4th (optimal day based on category traffic)"
];

const executeSteps = [
  "Analyzing market competition...", 
  "Optimizing product title and bullets...", 
  "Setting up pricing strategy...", 
  "Configuring PPC advertising...", 
  "Finalizing launch schedule..."
];

// Step summaries (concise versions of the detailed findings)
const stepSummaries = [
  "I've analyzed your competitors and found that professional knife sets average $42.99 with key features being stainless steel, ergonomic handles, and dishwasher safety.",
  "I've optimized your listing with a keyword-rich title highlighting 'Professional Kitchen Knife Set' and bullets focusing on premium materials and features.",
  "I've created a pricing strategy starting at $39.99 for launch with a planned increase to $47.99 after getting reviews, plus a 15% launch coupon.",
  "I've set up your PPC strategy with discovery and targeted campaigns, recommended bids of $0.65-$1.20, and identified your primary keywords.",
  "I've finalized your 5-week launch timeline with a recommended start date of Tuesday, June 4th to maximize visibility and sales."
];

export function useSampleMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState<number>(0);
  const [subtasks, setSubtasks] = useState<Subtask[]>(sampleSubtasks);
  const [currentSubtaskIndex, setCurrentSubtaskIndex] = useState<number>(0);
  const [isExecutingStep, setIsExecutingStep] = useState<boolean>(false);
  
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
    if (currentSubtaskIndex >= subtasks.length || isExecutingStep) return;
    
    setIsExecutingStep(true);
    const stepNumber = currentSubtaskIndex + 1;
    
    // First show loading message
    addLoadingMessage(stepNumber);
    
    // After a delay, show the completion message and update subtask state
    setTimeout(() => {
      // Remove loading message
      setMessages(prev => prev.filter(msg => !msg.isLoading));
      
      // Add step completion notification (without content)
      addAgentMessage("", true, stepNumber);
      
      // Add summary as a separate message
      addAgentMessage(stepSummaries[currentSubtaskIndex]);
      
      // Update subtask as completed
      setSubtasks(prev => prev.map((st, idx) => 
        idx === currentSubtaskIndex ? { ...st, done: true } : st
      ));
      
      // Move to next subtask if not the last one
      if (currentSubtaskIndex < subtasks.length - 1) {
        setCurrentSubtaskIndex(prevIndex => prevIndex + 1);
        
        // Add transition message to next step after a delay
        setTimeout(() => {
          addAgentMessage(agentScript[(currentSubtaskIndex * 2) + 1]);
          setIsExecutingStep(false);
        }, 1000);
      } else {
        // Flow is complete
        setTimeout(() => {
          addAgentMessage("That completes the Listing Launch Strategy flow! Your product is now ready for a successful launch. Is there anything specific you'd like to review or discuss further?");
          setIsExecutingStep(false);
        }, 1000);
      }
      
      setCurrentMessageIndex(prevIndex => prevIndex + 2);
    }, 2000);
  };
  
  return {
    messages,
    subtasks,
    currentSubtaskIndex,
    isExecutingStep,
    addUserMessage,
    addAgentMessage,
    executeNextStep
  };
}
