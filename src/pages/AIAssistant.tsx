
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Bot } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIAssistant() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: 'assistant',
      content: "Hi! I'm Jarvio, your Amazon selling assistant. I'm here to help you optimize your business and answer any questions about selling on Amazon. How can I assist you today?"
    }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="p-6 bg-gradient-to-br from-[#1A1F2C] to-[#2C1F3C] text-white border-none">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Jarvio AI Assistant</h1>
              <p className="text-white/70">Your Amazon brand management companion</p>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col h-[600px] border-primary/20">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
            <div className="flex gap-2">
              <Input
                placeholder="Ask me anything about managing your Amazon business..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSend} 
                size="icon"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer border-primary/20">
            <h3 className="font-semibold mb-2">Inventory Analysis</h3>
            <p className="text-sm text-muted-foreground">Ask me about your inventory levels, stockouts, and reordering recommendations.</p>
          </Card>
          <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer border-primary/20">
            <h3 className="font-semibold mb-2">Performance Metrics</h3>
            <p className="text-sm text-muted-foreground">Get insights about your sales performance, rankings, and competitive analysis.</p>
          </Card>
          <Card className="p-4 hover:bg-muted/50 transition-colors cursor-pointer border-primary/20">
            <h3 className="font-semibold mb-2">Listing Optimization</h3>
            <p className="text-sm text-muted-foreground">Let me help you optimize your product listings for better visibility and conversion.</p>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
