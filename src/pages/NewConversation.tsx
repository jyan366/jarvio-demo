
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Bot, Send, Maximize, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Markdown from 'markdown-to-jsx';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function NewConversation() {
  const [messages, setMessages] = React.useState<Message[]>(() => [
    { role: 'assistant', content: "Hi! I'm Jarvio, your AI assistant. I'm here to help you with your Amazon business. What can I help you with today?" }
  ]);
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
    setMessages([
      { role: 'assistant', content: "Hi! I'm Jarvio, your AI assistant. I'm here to help you with your Amazon business. What can I help you with today?" }
    ]);
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
      <div className="h-full flex flex-col max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Jarvio</h1>
              <p className="text-sm text-muted-foreground">Your AI assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNewConversation}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Conversation
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          className="flex-1 p-6 space-y-6 overflow-y-auto"
          style={{ minHeight: 0 }}
        >
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
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <Markdown
                      options={{
                        forceBlock: true,
                        overrides: {
                          h1: {
                            component: 'h3',
                            props: {
                              className: 'text-lg font-bold mb-2',
                            },
                          },
                          h2: {
                            component: 'h4',
                            props: {
                              className: 'text-base font-semibold mb-2',
                            },
                          },
                          p: {
                            props: {
                              className: 'mb-2',
                            },
                          },
                          ul: {
                            props: {
                              className: 'my-2 list-disc pl-4 space-y-1',
                            },
                          },
                          ol: {
                            props: {
                              className: 'my-2 list-decimal pl-4 space-y-1',
                            },
                          },
                          li: {
                            props: {
                              className: 'ml-2',
                            },
                          },
                        },
                      }}
                    >
                      {message.content}
                    </Markdown>
                  </div>
                ) : (
                  message.content
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-6 bg-card/50">
          <div className="flex items-end gap-3 max-w-4xl mx-auto">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                placeholder="Type your message... (use @ for flow blocks)"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
                className="min-h-[50px] resize-none overflow-hidden w-full border-2 focus:border-primary/20"
                style={{ height: 'auto' }}
                rows={1}
              />
            </div>
            <Button 
              onClick={handleSend} 
              size="icon"
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90 shrink-0 h-[50px] w-[50px]"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
