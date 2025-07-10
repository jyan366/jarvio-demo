
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, Sparkles, ArrowUp, Mic, Paperclip, Plus, Settings2, Image, Globe, Code, Search, CheckSquare } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Markdown from 'markdown-to-jsx';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const amazonSuggestions = [
  "How do I optimize my Amazon product listings for better visibility?",
  "What's the best strategy for Amazon PPC campaigns?",
  "How can I improve my Amazon seller feedback score?",
  "What are the key metrics to track for Amazon FBA success?",
  "How do I handle negative reviews on Amazon effectively?",
  "What's the best way to price my products competitively on Amazon?",
  "How can I increase my Amazon Buy Box percentage?",
  "What are the most effective Amazon keywords research tools?",
  "How do I create compelling Amazon product images?",
  "What's the process for getting ungated in restricted categories?",
  "How can I improve my Amazon inventory management?",
  "What are the best practices for Amazon product photography?",
  "How do I handle Amazon account suspensions?",
  "What's the difference between Amazon FBA and FBM?",
  "How can I optimize my Amazon product titles?",
  "What are the most profitable Amazon product categories?",
  "How do I create effective Amazon A+ content?",
  "What's the best way to launch a new product on Amazon?",
  "How can I track my competitors on Amazon?",
  "What are the common Amazon policy violations to avoid?",
  "How do I optimize my Amazon backend search terms?",
  "What's the best strategy for Amazon international expansion?",
  "How can I improve my Amazon conversion rates?",
  "What are the key factors for Amazon ranking algorithm?",
  "How do I handle Amazon inventory reimbursements?",
  "What's the best way to manage Amazon customer service?",
  "How can I create effective Amazon promotional campaigns?",
  "What are the benefits of Amazon Brand Registry?",
  "How do I optimize my Amazon storefront design?",
  "What's the best approach for Amazon seasonal selling?",
  "How can I improve my Amazon profit margins?",
  "What are the most effective Amazon review strategies?",
  "How do I handle Amazon return and refund policies?",
  "What's the best way to scale my Amazon business?",
  "How can I optimize my Amazon logistics and shipping?",
  "What are the key Amazon seller metrics I should monitor?",
  "How do I create effective Amazon product bundles?",
  "What's the best strategy for Amazon cross-selling?",
  "How can I improve my Amazon search ranking?",
  "What are the most common Amazon seller mistakes?",
  "How do I optimize my Amazon tax strategy?",
  "What's the best way to handle Amazon intellectual property issues?",
  "How can I create effective Amazon product variations?",
  "What are the key elements of successful Amazon branding?",
  "How do I optimize my Amazon customer acquisition cost?",
  "What's the best approach for Amazon market research?",
  "How can I improve my Amazon operational efficiency?",
  "What are the most effective Amazon advertising formats?",
  "How do I handle Amazon compliance and regulations?",
  "What's the best strategy for Amazon long-term growth?"
];

export default function NewConversation() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([]);
  const [showTaskCards, setShowTaskCards] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle suggestion filtering
  React.useEffect(() => {
    if (input.trim().length > 0) {
      const filtered = amazonSuggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(input.toLowerCase())
      ).slice(0, 5); // Show max 5 suggestions
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [input]);

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = input.trim();
    
    // Add a small delay to show the transition animation
    setTimeout(() => {
      setMessages(prev => [
        ...prev, 
        { role: 'user', content: userMessage },
        { role: 'assistant', content: '🤔 Thinking...' }
      ]);
    }, 100);
    
    setInput('');

    try {
      const { data, error } = await supabase.functions.invoke('chat', {
        body: { prompt: userMessage }
      });

      if (error) throw error;

      setMessages(prev => [...prev.slice(0, -1), { 
        role: 'assistant', 
        content: data.text 
      }]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      setMessages(prev => [...prev.slice(0, -1)]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
    setInput('');
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  React.useEffect(() => {
    adjustTextareaHeight();
  }, [input]);

  // Amazon task cards data
  const allTaskCards = [
    {
      id: 1,
      title: "Amazon Keyword Research",
      description: "Research high-converting keywords for product listings",
      priority: "High",
      status: "In Progress"
    },
    {
      id: 2,
      title: "Competitor Analysis",
      description: "Analyze top 5 competitors' pricing strategies",
      priority: "Medium",
      status: "To Do"
    },
    {
      id: 3,
      title: "Inventory Restock",
      description: "Check low-stock items and create restock plan",
      priority: "High",
      status: "To Do"
    },
    {
      id: 4,
      title: "Review Response",
      description: "Respond to recent customer reviews",
      priority: "Low",
      status: "Completed"
    },
    {
      id: 5,
      title: "PPC Campaign Optimization",
      description: "Optimize Amazon advertising campaigns for better ROI",
      priority: "High",
      status: "In Progress"
    },
    {
      id: 6,
      title: "Product Image Enhancement",
      description: "Update main product images for better conversion",
      priority: "Medium",
      status: "To Do"
    },
    {
      id: 7,
      title: "A+ Content Creation",
      description: "Design enhanced brand content for product pages",
      priority: "Medium",
      status: "In Progress"
    },
    {
      id: 8,
      title: "Pricing Strategy Review",
      description: "Analyze and adjust product pricing for competitiveness",
      priority: "High",
      status: "To Do"
    },
    {
      id: 9,
      title: "Brand Registry Setup",
      description: "Complete Amazon Brand Registry application process",
      priority: "Low",
      status: "Completed"
    },
    {
      id: 10,
      title: "International Marketplace Expansion",
      description: "Research and launch products in EU marketplaces",
      priority: "Medium",
      status: "To Do"
    },
    {
      id: 11,
      title: "FBA Shipment Planning",
      description: "Plan and schedule next inventory shipment to Amazon",
      priority: "High",
      status: "In Progress"
    },
    {
      id: 12,
      title: "Customer Service Automation",
      description: "Set up automated responses for common customer queries",
      priority: "Low",
      status: "To Do"
    },
    {
      id: 13,
      title: "Product Bundle Creation",
      description: "Create profitable product bundles to increase AOV",
      priority: "Medium",
      status: "In Progress"
    },
    {
      id: 14,
      title: "Negative Review Management",
      description: "Address and resolve recent negative product reviews",
      priority: "High",
      status: "To Do"
    },
    {
      id: 15,
      title: "Backend Search Terms Optimization",
      description: "Update hidden keywords for better search visibility",
      priority: "Medium",
      status: "Completed"
    },
    {
      id: 16,
      title: "Seasonal Product Preparation",
      description: "Prepare holiday season product listings and inventory",
      priority: "High",
      status: "In Progress"
    },
    {
      id: 17,
      title: "Return Policy Optimization",
      description: "Review and optimize product return policies",
      priority: "Low",
      status: "To Do"
    },
    {
      id: 18,
      title: "Amazon Storefront Design",
      description: "Create branded storefront with enhanced navigation",
      priority: "Medium",
      status: "In Progress"
    },
    {
      id: 19,
      title: "Lightning Deal Application",
      description: "Apply for upcoming lightning deals on bestsellers",
      priority: "High",
      status: "To Do"
    },
    {
      id: 20,
      title: "Inventory Forecasting",
      description: "Forecast demand and plan inventory for next quarter",
      priority: "Medium",
      status: "Completed"
    },
    {
      id: 21,
      title: "Category Ungating Request",
      description: "Submit ungating request for restricted categories",
      priority: "Low",
      status: "In Progress"
    },
    {
      id: 22,
      title: "Product Variation Expansion",
      description: "Add new color and size variations to existing products",
      priority: "Medium",
      status: "To Do"
    },
    {
      id: 23,
      title: "Tax Compliance Review",
      description: "Review tax settings for all marketplace jurisdictions",
      priority: "High",
      status: "To Do"
    },
    {
      id: 24,
      title: "Vine Program Enrollment",
      description: "Enroll eligible products in Amazon Vine program",
      priority: "Low",
      status: "Completed"
    },
    {
      id: 25,
      title: "Brand Analytics Review",
      description: "Analyze brand performance metrics and search terms",
      priority: "Medium",
      status: "In Progress"
    },
    {
      id: 26,
      title: "Product Launch Strategy",
      description: "Develop comprehensive launch plan for new product line",
      priority: "High",
      status: "To Do"
    },
    {
      id: 27,
      title: "Amazon Posts Content",
      description: "Create engaging Amazon Posts for brand awareness",
      priority: "Low",
      status: "In Progress"
    },
    {
      id: 28,
      title: "Subscribe & Save Optimization",
      description: "Optimize products for Subscribe & Save program",
      priority: "Medium",
      status: "To Do"
    },
    {
      id: 29,
      title: "ASIN Consolidation",
      description: "Consolidate duplicate ASINs and variations",
      priority: "High",
      status: "Completed"
    },
    {
      id: 30,
      title: "DSP Campaign Setup",
      description: "Launch Amazon DSP advertising campaigns",
      priority: "Medium",
      status: "In Progress"
    },
    {
      id: 31,
      title: "Product Video Creation",
      description: "Produce high-quality product demonstration videos",
      priority: "Low",
      status: "To Do"
    },
    {
      id: 32,
      title: "Early Reviewer Program",
      description: "Enroll new products in Early Reviewer Program",
      priority: "Medium",
      status: "In Progress"
    },
    {
      id: 33,
      title: "Amazon Fresh Eligibility",
      description: "Apply for Amazon Fresh marketplace eligibility",
      priority: "High",
      status: "To Do"
    },
    {
      id: 34,
      title: "Product Compliance Audit",
      description: "Audit all products for Amazon policy compliance",
      priority: "Medium",
      status: "Completed"
    },
    {
      id: 35,
      title: "Cross-Border Trade Setup",
      description: "Set up cross-border trade for international sales",
      priority: "Low",
      status: "In Progress"
    },
    {
      id: 36,
      title: "Amazon Business Registration",
      description: "Register for Amazon Business seller program",
      priority: "Medium",
      status: "To Do"
    },
    {
      id: 37,
      title: "Product Recall Management",
      description: "Manage product recall process and notifications",
      priority: "High",
      status: "Completed"
    },
    {
      id: 38,
      title: "Brand Protection Monitoring",
      description: "Monitor and report brand protection violations",
      priority: "Medium",
      status: "In Progress"
    },
    {
      id: 39,
      title: "Amazon Launchpad Application",
      description: "Apply for Amazon Launchpad startup program",
      priority: "Low",
      status: "To Do"
    },
    {
      id: 40,
      title: "Multi-Channel Fulfillment",
      description: "Set up MCF for other sales channel fulfillment",
      priority: "Medium",
      status: "In Progress"
    },
    {
      id: 41,
      title: "Amazon Handmade Setup",
      description: "Set up Amazon Handmade store for artisan products",
      priority: "High",
      status: "To Do"
    },
    {
      id: 42,
      title: "Product Photography Audit",
      description: "Audit and update all product photography standards",
      priority: "Medium",
      status: "Completed"
    },
    {
      id: 43,
      title: "Amazon Live Streaming",
      description: "Plan and execute Amazon Live streaming events",
      priority: "Low",
      status: "In Progress"
    },
    {
      id: 44,
      title: "Seller University Training",
      description: "Complete advanced Amazon Seller University courses",
      priority: "Medium",
      status: "To Do"
    },
    {
      id: 45,
      title: "Climate Pledge Certification",
      description: "Apply for Climate Pledge Friendly certification",
      priority: "High",
      status: "In Progress"
    },
    {
      id: 46,
      title: "Amazon Affiliate Program",
      description: "Set up Amazon Associates affiliate program",
      priority: "Low",
      status: "To Do"
    },
    {
      id: 47,
      title: "Product Recall Insurance",
      description: "Review and update product liability insurance",
      priority: "Medium",
      status: "Completed"
    },
    {
      id: 48,
      title: "Amazon Transparency Setup",
      description: "Implement Amazon Transparency anti-counterfeiting",
      priority: "High",
      status: "In Progress"
    },
    {
      id: 49,
      title: "Voice Shopping Optimization",
      description: "Optimize products for Alexa voice shopping",
      priority: "Medium",
      status: "To Do"
    },
    {
      id: 50,
      title: "Amazon Prime Day Prep",
      description: "Prepare promotional strategy for Prime Day event",
      priority: "High",
      status: "In Progress"
    },
    {
      id: 51,
      title: "Fulfillment Network Analysis",
      description: "Analyze fulfillment network performance and costs",
      priority: "Low",
      status: "To Do"
    },
    {
      id: 52,
      title: "Amazon Flex Integration",
      description: "Integrate with Amazon Flex for last-mile delivery",
      priority: "Medium",
      status: "Completed"
    },
    {
      id: 53,
      title: "Product Bundling Strategy",
      description: "Develop strategic product bundling for higher margins",
      priority: "High",
      status: "In Progress"
    },
    {
      id: 54,
      title: "Amazon Influencer Outreach",
      description: "Connect with Amazon influencers for product promotion",
      priority: "Medium",
      status: "To Do"
    }
  ];

  // Filter task cards based on input
  const [filteredTaskCards, setFilteredTaskCards] = React.useState(allTaskCards);

  // Handle task filtering
  React.useEffect(() => {
    if (input.trim().length > 0) {
      const filtered = allTaskCards.filter(task =>
        task.title.toLowerCase().includes(input.toLowerCase()) ||
        task.description.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredTaskCards(filtered);
    } else {
      setFilteredTaskCards(allTaskCards);
    }
  }, [input]);

  // Auto-scroll through tasks - REMOVED (using CSS animation now)
  // React.useEffect(() => {
  //   if (!showTaskCards) return;

  //   const interval = setInterval(() => {
  //     setCurrentTaskIndex((prev) => (prev + 1) % taskCards.length);
  //   }, 2000); // Change task every 2 seconds

  //   return () => clearInterval(interval);
  // }, [showTaskCards, taskCards.length]);

  // Reset task index when showing/hiding tasks - REMOVED
  // React.useEffect(() => {
  //   if (showTaskCards) {
  //     setCurrentTaskIndex(0);
  //   }
  // }, [showTaskCards]);

  const FloatingTaskCards = () => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [position, setPosition] = React.useState(0);
    const [dragStart, setDragStart] = React.useState(0);
    const [dragStartPosition, setDragStartPosition] = React.useState(0);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const animationRef = React.useRef<number>();
    const lastTimeRef = React.useRef<number>();
    
    // Create duplicates for infinite scroll with filtering
    const tasksToShow = filteredTaskCards.length > 0 ? filteredTaskCards : allTaskCards;
    const displayTasks = tasksToShow.slice(0, Math.min(20, tasksToShow.length)); // Show up to 20 tasks
    const infiniteTasks = Array(Math.ceil(40 / displayTasks.length)).fill(displayTasks).flat().slice(0, 40);
    const singleSetWidth = displayTasks.length * 304; // tasks * (280px + 24px margin)
    
    // Auto-scroll animation using JavaScript
    React.useEffect(() => {
      if (isDragging || !showTaskCards) return;
      
      const animate = (currentTime: number) => {
        if (!lastTimeRef.current) lastTimeRef.current = currentTime;
        
        const deltaTime = currentTime - lastTimeRef.current;
        const speed = 30; // pixels per second
        
        setPosition(prev => {
          let newPos = prev - (speed * deltaTime / 1000);
          
          // Reset when we've scrolled one complete set
          if (newPos <= -singleSetWidth) {
            newPos += singleSetWidth;
          }
          
          return newPos;
        });
        
        lastTimeRef.current = currentTime;
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [isDragging, showTaskCards, singleSetWidth]);
    
    const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      setDragStart(e.clientX);
      setDragStartPosition(position);
      e.preventDefault();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isDragging) return;
      const diff = e.clientX - dragStart;
      setPosition(dragStartPosition + diff);
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      setIsDragging(false);
      lastTimeRef.current = undefined; // Reset animation timer
    };

    const handleTouchStart = (e: React.TouchEvent) => {
      setIsDragging(true);
      setDragStart(e.touches[0].clientX);
      setDragStartPosition(position);
      e.preventDefault();
    };

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging) return;
      const diff = e.touches[0].clientX - dragStart;
      setPosition(dragStartPosition + diff);
    };

    const handleTouchEnd = () => {
      handleMouseUp();
    };
    
    return (
      <div className="absolute inset-x-0 top-8 z-50 overflow-hidden">
        <div className="relative w-full animate-fade-in">
          {/* Fade overlays */}
          <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
          
          {/* Scrolling container */}
          <div 
            ref={containerRef}
            className={`flex select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            style={{ 
              transform: `translate3d(${position}px, 0, 0)`,
              transition: 'none' // No CSS transitions, pure JS control
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {infiniteTasks.map((task, index) => (
              <div key={`infinite-${task.id}-${index}`} className="flex-shrink-0 mr-6">
                <div className="min-h-[140px] w-[280px] flex flex-col p-4 bg-card rounded-lg border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-card-foreground text-sm leading-tight flex-1 mr-2">{task.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                      task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                      task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">
                    {task.description.length > 100 ? `${task.description.substring(0, 100)}...` : task.description}
                  </p>
                  <div className="flex items-center justify-start mt-auto">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                      task.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-green-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="h-full flex flex-col bg-background -my-6 -mx-6 relative">
        {/* Floating Task Cards */}
        {showTaskCards && <FloatingTaskCards />}
        
        {messages.length === 0 ? (
          /* Welcome Screen with Centered Input */
          <div className="flex-1 flex items-center justify-center px-6 pt-64 transition-all duration-700 ease-in-out">
            <div className="w-full max-w-2xl mx-auto transition-all duration-700 ease-in-out">
              <div className="text-center mb-12 transition-opacity duration-500">
                <h1 className="text-4xl font-normal text-foreground">
                  What are you working on?
                </h1>
              </div>
              
              {/* Main Input - Centered for welcome state */}
              <div className="relative">
                <div className="relative border border-border rounded-3xl bg-background shadow-sm hover:shadow-md transition-all duration-500 overflow-hidden">
                  {/* Top row - Text input */}
                  <div className="px-5 pt-4 pb-2">
                    <Textarea
                      ref={textareaRef}
                      placeholder="Ask anything"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      disabled={isLoading}
                      className="min-h-[24px] max-h-[120px] resize-none border-0 bg-transparent text-base leading-relaxed p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                      style={{ height: 'auto' }}
                      rows={1}
                    />
                  </div>
                  
                  {/* Bottom row - Controls */}
                  <div className="flex items-center justify-between px-4 pb-3 pt-1 border-t border-border/20">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                        <Plus className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground hover:text-foreground">
                        <Settings2 className="h-3.5 w-3.5 mr-1" />
                        <span className="text-sm">Tools</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowTaskCards(!showTaskCards)}
                      >
                        <CheckSquare className="h-3.5 w-3.5 mr-1" />
                        <span className="text-sm">Tasks</span>
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                        <Mic className="h-4 w-4" />
                      </Button>
                      <Button 
                        onClick={handleSend} 
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className={`h-7 w-7 rounded-lg transition-all duration-200 ${
                          input.trim() 
                            ? 'bg-foreground hover:bg-foreground/90 text-background' 
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Suggestions dropdown */}
                {showSuggestions && (
                  <div className="mt-4 space-y-2 px-4">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full px-0 py-2 text-left hover:text-foreground transition-colors text-sm text-muted-foreground"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Conversation View */
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
                {messages.map((message, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
                      }`}>
                        {message.role === 'user' ? (
                          <User className="w-4 h-4" />
                        ) : (
                          <Bot className="w-4 h-4" />
                        )}
                      </div>
                      
                      {/* Message Content */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-2">
                          <span className="text-sm font-medium">
                            {message.role === 'user' ? 'You' : 'Jarvio'}
                          </span>
                        </div>
                        <div className="prose prose-sm dark:prose-invert max-w-none">
                          {message.role === 'assistant' ? (
                            <Markdown
                              options={{
                                forceBlock: true,
                                overrides: {
                                  h1: {
                                    component: 'h3',
                                    props: {
                                      className: 'text-lg font-semibold mb-3 mt-4 first:mt-0',
                                    },
                                  },
                                  h2: {
                                    component: 'h4',
                                    props: {
                                      className: 'text-base font-semibold mb-2 mt-3',
                                    },
                                  },
                                  p: {
                                    props: {
                                      className: 'mb-3 last:mb-0 leading-relaxed',
                                    },
                                  },
                                  ul: {
                                    props: {
                                      className: 'my-3 list-disc pl-6 space-y-1',
                                    },
                                  },
                                  ol: {
                                    props: {
                                      className: 'my-3 list-decimal pl-6 space-y-1',
                                    },
                                  },
                                  li: {
                                    props: {
                                      className: 'leading-relaxed',
                                    },
                                  },
                                  code: {
                                    props: {
                                      className: 'bg-muted px-1.5 py-0.5 rounded text-sm',
                                    },
                                  },
                                  pre: {
                                    props: {
                                      className: 'bg-muted p-4 rounded-lg overflow-x-auto my-3',
                                    },
                                  },
                                },
                              }}
                            >
                              {message.content}
                            </Markdown>
                          ) : (
                            <p className="leading-relaxed">{message.content}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area - Bottom for conversation state */}
            <div className="border-t bg-background">
              <div className="max-w-3xl mx-auto px-6 py-4">
                <div className="relative border border-border/50 rounded-2xl bg-background hover:shadow-sm transition-shadow duration-200 overflow-hidden">
                  {/* Top row - Text input */}
                  <div className="px-4 pt-3 pb-1">
                    <Textarea
                      ref={textareaRef}
                      placeholder="Ask anything"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      disabled={isLoading}
                      className="min-h-[20px] max-h-[120px] resize-none border-0 bg-transparent text-base leading-relaxed p-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                      style={{ height: 'auto' }}
                      rows={1}
                    />
                  </div>
                  
                  {/* Bottom row - Controls */}
                  <div className="flex items-center justify-between px-3 pb-2 pt-1 border-t border-border/20">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-muted-foreground hover:text-foreground">
                        <Settings2 className="h-3 w-3 mr-1" />
                        <span className="text-xs">Tools</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setShowTaskCards(!showTaskCards)}
                      >
                        <CheckSquare className="h-3 w-3 mr-1" />
                        <span className="text-xs">Tasks</span>
                      </Button>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground">
                        <Mic className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        onClick={handleSend} 
                        size="icon"
                        disabled={isLoading || !input.trim()}
                        className={`h-6 w-6 rounded-lg transition-all duration-200 ${
                          input.trim() 
                            ? 'bg-foreground hover:bg-foreground/90 text-background' 
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Suggestions dropdown for conversation state */}
                {showSuggestions && (
                  <div className="mt-4 space-y-2 px-4">
                    {filteredSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        className="w-full px-0 py-2 text-left hover:text-foreground transition-colors text-sm text-muted-foreground"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
