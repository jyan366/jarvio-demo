
import { useState, useEffect } from 'react';
import type { Message, Subtask } from "../AgentChatInterface";

// Sample subtasks
const sampleSubtasks: Subtask[] = [
  { id: '1', title: 'Analyze top selling product', done: false },
  { id: '2', title: 'Identify high-performing keywords', done: false },
  { id: '3', title: 'Review competitor listings', done: false },
  { id: '4', title: 'Generate optimization recommendations', done: false },
  { id: '5', title: 'Implement listing changes', done: false },
];

// Sample script of agent messages
const agentScript = [
  "Hi, I'm Jarvio. Let's get started on optimizing your product listings.",
  "I've executed step 1 and found that your best selling product is the 'Ergonomic Kitchen Knife Set'. It has 4.7 stars and 1,245 reviews.",
  "Let's continue with the next step. I'll now analyze the best performing keywords for this product.",
  "I've executed step 2 and found the top keywords for your best selling product: 'professional knife set', 'chef knife set', 'kitchen knife set with block', and 'stainless steel knives'.",
  "Now I'll analyze your competitors' listings to identify opportunities.",
  "I've completed step 3. Your top competitors are 'ChefsPro', 'KitchenMaster', and 'CulinaryElite'. They use better product imagery and more detailed bullet points than your listing.",
  "Now I'll generate optimization recommendations based on the analysis.",
  "Step 4 complete. Here are my optimization recommendations:\n\n1. Update your main image to show the full knife set with the block\n2. Add close-up images of each knife type\n3. Incorporate the keywords 'professional knife set' and 'chef knife set' in your title\n4. Add more technical specifications about blade material and handle design\n5. Include care instructions as a selling point",
  "Let's implement these changes to your listing.",
  "Step 5 complete! I've updated your listing with the new title, bullets, and keyword optimization. The image updates will need to be done manually. Would you like me to provide templates for the new product description?"
];

const executeSteps = [
  "Step 1 being executed", 
  "Step 2 being executed", 
  "Step 3 being executed", 
  "Step 4 being executed", 
  "Step 5 being executed"
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
