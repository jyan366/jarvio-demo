
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, Sparkles, ArrowUp, Mic, Paperclip, Plus, Settings2, Image, Globe, Code, Search, CheckSquare } from 'lucide-react';
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

  // Sample task cards data
  const taskCards = [
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
    }
  ];

  const FloatingTaskCards = () => (
    <div className="absolute inset-x-0 top-8 z-50 flex justify-center px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl w-full animate-fade-in">
        {taskCards.map((task) => (
          <Card key={task.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer bg-card">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-card-foreground line-clamp-2">{task.title}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.priority === 'High' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' :
                  task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                  'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                }`}>
                  {task.priority}
                </span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  task.status === 'Completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                }`}>
                  {task.status}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

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
