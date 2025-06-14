
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Send, Bot, User } from 'lucide-react';
import { UnifiedTask } from '@/types/unifiedTask';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface UnifiedJarvioChatProps {
  task: UnifiedTask;
  childTasks: UnifiedTask[];
  onTaskUpdate: () => void;
}

export function UnifiedJarvioChat({ task, childTasks, onTaskUpdate }: UnifiedJarvioChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      text: `Hello! I'm Jarvio, your AI assistant. I'm here to help you work through the steps of "${task.title}". I can guide you through each step, provide suggestions, and help you complete your task efficiently. What would you like to work on first?`,
      isUser: false,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  }, [task.title]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Prepare context for the AI
      const taskContext = {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        category: task.category,
        task_type: task.task_type
      };

      const stepsData = childTasks.map((child, index) => ({
        title: child.title,
        description: child.description || '',
        done: child.status === 'Done',
        index
      }));

      const conversationHistory = messages.map(msg => ({
        text: msg.text,
        isUser: msg.isUser
      }));

      const response = await fetch('/api/jarvio-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          taskContext,
          subtasks: stepsData,
          currentSubtaskIndex: stepsData.findIndex(s => !s.done),
          conversationHistory
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Jarvio');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || 'I apologize, but I encountered an error processing your request.',
        isUser: false,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Handle step completion if suggested by AI
      if (data.subtaskComplete) {
        toast({
          title: "Step completed",
          description: "The AI has marked this step as complete"
        });
        onTaskUpdate();
      }

    } catch (error) {
      console.error('Error sending message to Jarvio:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to communicate with Jarvio assistant",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
    sendMessage(inputValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-blue-600" />
          Jarvio AI Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.isUser ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Bot className="h-4 w-4" />
                  )}
                  <span className="text-xs opacity-75">
                    {message.isUser ? 'You' : 'Jarvio'}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Jarvio is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="flex gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask Jarvio for help with your task..."
            className="flex-1 min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button
            onClick={handleSubmit}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="h-[60px] w-[60px]"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
