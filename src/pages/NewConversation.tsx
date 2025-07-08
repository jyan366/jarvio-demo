
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, Sparkles, ArrowUp, Mic, Paperclip, Settings2 } from 'lucide-react';
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
        
        {messages.length === 0 ? (
          /* Welcome Screen with Centered Input */
          <div className="flex-1 flex flex-col items-center justify-center px-6 min-h-0">
            <div className="w-full max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl font-normal text-foreground">
                  What are you working on?
                </h1>
              </div>
              
              {/* Main Input - Centered for welcome state */}
              <div className="relative">
                <div className="relative border border-border rounded-3xl bg-background shadow-sm hover:shadow-md transition-shadow duration-200">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Ask anything"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isLoading}
                    className="min-h-[56px] max-h-[200px] resize-none border-0 bg-transparent text-base leading-relaxed px-5 py-4 pr-24 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
                    style={{ height: 'auto' }}
                    rows={1}
                  />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-muted-foreground hover:text-foreground">
                      <Paperclip className="h-4 w-4 mr-1" />
                      <span className="text-sm">Tools</span>
                    </Button>
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={handleSend} 
                      size="icon"
                      disabled={isLoading || !input.trim()}
                      className={`h-8 w-8 rounded-lg transition-all duration-200 ${
                        input.trim() 
                          ? 'bg-foreground hover:bg-foreground/90 text-background' 
                          : 'bg-muted text-muted-foreground cursor-not-allowed'
                      }`}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="mt-3 text-xs text-muted-foreground text-center">
                  Jarvio can make mistakes. Check important info.
                </div>
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
                <div className="relative border border-border/50 rounded-2xl bg-background hover:shadow-sm transition-shadow duration-200">
                  <Textarea
                    ref={textareaRef}
                    placeholder="Ask anything"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    disabled={isLoading}
                    className="min-h-[52px] max-h-[200px] resize-none border-0 bg-transparent text-base leading-relaxed px-4 py-3 pr-20 focus-visible:ring-0 focus-visible:ring-offset-0"
                    style={{ height: 'auto' }}
                    rows={1}
                  />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-muted-foreground">
                      <Paperclip className="h-3.5 w-3.5 mr-1" />
                      <span className="text-xs">Tools</span>
                    </Button>
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground">
                      <Mic className="h-3.5 w-3.5" />
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
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 text-xs text-muted-foreground text-center">
                  Jarvio can make mistakes. Check important info.
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
