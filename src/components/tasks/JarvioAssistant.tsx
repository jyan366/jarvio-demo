
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JarvioChatTab } from './JarvioAssistant/JarvioChatTab';
import { JarvioDataLogTab } from './JarvioAssistant/JarvioDataLogTab';
import { DocumentUploader } from './DocumentUploader';
import { DocumentList } from './DocumentList';

export function JarvioAssistant({ taskId }: { taskId: string }) {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; }[]>([]);
  const [dataHistory, setDataHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: message }]);

    // Basic data logging
    setDataHistory(prev => [...prev, {
      timestamp: new Date().toLocaleTimeString(),
      message: `User: ${message}`
    }]);

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(prev => [...prev, { role: 'assistant', content: `Echo: ${message}` }]);

      // More data logging
      setDataHistory(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        message: `Assistant: Echo: ${message}`
      }]);

    } catch (error) {
      console.error("Failed to get a response:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="chat" className="flex-1">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="data">Data Log</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat" className="flex-1 overflow-hidden">
          <JarvioChatTab 
            taskId={taskId}
            messages={messages}
            setMessages={setMessages}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        </TabsContent>
        
        <TabsContent value="data" className="flex-1 overflow-hidden">
          <JarvioDataLogTab 
            taskId={taskId} 
            dataHistory={dataHistory}
          />
        </TabsContent>

        <TabsContent value="documents" className="flex-1 overflow-auto">
          <div className="space-y-6 p-4">
            <DocumentUploader />
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Uploaded Documents</h3>
              <DocumentList />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
