
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, Sparkles, ArrowUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Markdown from 'markdown-to-jsx';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function NewConversation() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    const userMessage = input.trim();
    setInput('');

    setMessages(prev => [
      ...prev, 
      { role: 'user', content: userMessage },
      { role: 'assistant', content: '🤔 Thinking...' }
    ]);

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

  return (
    <MainLayout>
      <div className="h-full flex flex-col bg-background">
        
        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {messages.length === 0 ? (
            /* Welcome Screen */
            <div className="flex-1 flex items-center justify-center">
              <div className="max-w-2xl mx-auto text-center px-6">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  How can I help you today?
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  I'm Jarvio, your AI assistant for Amazon business optimization. Ask me anything about your products, sales, analytics, or business strategy.
                </p>
                
                {/* Quick suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-xl mx-auto">
                  {[
                    "Analyze my product performance",
                    "Create a marketing strategy",
                    "Optimize my product listings",
                    "Review competitor analysis"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(suggestion)}
                      className="p-4 text-left bg-card border border-border/50 rounded-xl hover:border-border hover:bg-accent/50 transition-all duration-200"
                    >
                      <span className="text-sm font-medium">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Messages */
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
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="max-w-3xl mx-auto px-6 py-6">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder="Message Jarvio..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                className="min-h-[60px] max-h-[200px] resize-none pr-12 rounded-2xl border-border/50 focus:border-border bg-background/50 text-base leading-relaxed"
                style={{ height: 'auto' }}
                rows={1}
              />
              <Button 
                onClick={handleSend} 
                size="icon"
                disabled={isLoading || !input.trim()}
                className={`absolute right-2 bottom-2 h-8 w-8 rounded-lg transition-all duration-200 ${
                  input.trim() 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 text-xs text-muted-foreground text-center">
              Jarvio can make mistakes. Please verify important information.
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
