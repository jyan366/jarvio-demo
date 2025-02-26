
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Bot, ChevronDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface KnowledgeCategory {
  title: string;
  description: string;
  questions: string[];
}

const knowledgeBase: KnowledgeCategory[] = [
  {
    title: "Account Health",
    description: "Keep your Amazon account healthy and compliant",
    questions: [
      "How do I keep my Amazon account in good standing?",
      "What are the common reasons for account suspensions, and how do I avoid them?",
      "How do I appeal a suspension or policy violation?",
      "What should I do if I receive an Intellectual Property complaint?",
      "How can I improve my Order Defect Rate and Customer Service Performance?"
    ]
  },
  {
    title: "Sales",
    description: "Optimize your sales performance and strategy",
    questions: [
      "What are the key factors that influence my sales on Amazon?",
      "How do I create a sales forecast for my products?",
      "What strategies can I use to increase conversions on my product pages?",
      "How do I handle seasonal fluctuations in sales?",
      "What are the best ways to track and analyse my sales performance?"
    ]
  },
  {
    title: "Inventory",
    description: "Manage your inventory efficiently",
    questions: [
      "How should I manage my inventory to avoid stockouts or overstocking?",
      "What's the best way to handle stranded inventory?",
      "How do I set up automated restock alerts?",
      "What are Amazon's storage fees, and how can I reduce them?",
      "Should I use FBA, FBM, or a hybrid model for my business?"
    ]
  },
  {
    title: "Listings",
    description: "Optimize your product listings for better visibility",
    questions: [
      "How do I write a high-converting product title and bullet points?",
      "What are the best practices for optimising product images on Amazon?",
      "How does A+ Content help improve sales, and how do I create it?",
      "What factors affect my listing's organic ranking?",
      "How do I update or change a product listing that Amazon has locked?"
    ]
  },
  {
    title: "Customers",
    description: "Build strong customer relationships",
    questions: [
      "How do I encourage customers to leave positive reviews?",
      "What's the best way to handle negative reviews and customer complaints?",
      "How do Amazon's customer service expectations differ for FBA vs. FBM sellers?",
      "What are the best practices for creating an effective customer service strategy?",
      "How do I reduce my return rate and prevent excessive refunds?"
    ]
  },
  {
    title: "Competitors",
    description: "Stay ahead of your competition",
    questions: [
      "How do I identify my main competitors on Amazon?",
      "What strategies can I use to differentiate my products from competitors?",
      "How do I track competitor pricing and adjust my strategy accordingly?",
      "How do I protect my listing from hijackers and counterfeit sellers?",
      "What are some common mistakes sellers make when competing in a crowded market?"
    ]
  },
  {
    title: "Advertising",
    description: "Maximize your advertising ROI",
    questions: [
      "What are the different types of Amazon ads, and when should I use them?",
      "How do I structure my PPC campaigns for the best results?",
      "What's a good ACOS for my product, and how do I improve it?",
      "How do I find and test the best keywords for my ads?",
      "What are some common Amazon PPC mistakes and how can I avoid them?"
    ]
  }
];

export default function AIAssistant() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = input.trim();
      setInput('');
      setIsLoading(true);
      
      setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

      try {
        const { data, error } = await supabase.functions.invoke('chat', {
          body: { prompt: userMessage }
        });

        if (error) throw error;

        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.generatedText
        }]);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Failed to get response from AI. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuestionClick = (question: string) => {
    setInput(question);
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="p-6 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Jarvio AI Assistant</h1>
              <p className="text-muted-foreground">Your Amazon brand management companion</p>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col h-[600px] border-primary/20">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="space-y-3">
                {knowledgeBase.map((category) => (
                  <Collapsible key={category.title}>
                    <Card className="border-primary/10">
                      <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-left">{category.title}</h3>
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="p-4 pt-0 space-y-2">
                          {category.questions.map((question, index) => (
                            <button
                              key={index}
                              onClick={() => handleQuestionClick(question)}
                              className="w-full text-left text-sm p-2 hover:bg-muted rounded-md cursor-pointer transition-colors text-muted-foreground hover:text-foreground"
                            >
                              {question}
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            )}
            
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-4'
                      : 'bg-muted/50 border border-primary/10 mr-4'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-primary/10 p-4 bg-card/50">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Textarea
                  ref={textareaRef}
                  placeholder="Ask me anything about managing your Amazon business..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  disabled={isLoading}
                  className="min-h-[44px] resize-none overflow-hidden w-full"
                  style={{ height: 'auto' }}
                  rows={1}
                />
              </div>
              <Button 
                onClick={handleSend} 
                size="icon"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90 shrink-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
