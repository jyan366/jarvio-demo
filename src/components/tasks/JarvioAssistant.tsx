
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentUploader } from './DocumentUploader';
import { DocumentList } from './DocumentList';

interface JarvioMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface JarvioAssistantProps {
  taskId: string;
  taskTitle?: string;
  taskDescription?: string;
  subtasks?: any[];
  currentSubtaskIndex?: number;
  onSubtaskComplete?: (idx: number) => Promise<void>;
  onSubtaskSelect?: (idx: number) => void;
}

export function JarvioAssistant({ 
  taskId,
  taskTitle,
  taskDescription,
  subtasks,
  currentSubtaskIndex,
  onSubtaskComplete,
  onSubtaskSelect
}: JarvioAssistantProps) {
  const [messages, setMessages] = useState<JarvioMessage[]>([]);
  const [dataHistory, setDataHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");

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
          <div className="flex flex-col h-full relative">
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, i) => (
                <div key={i} className={`mb-4 ${msg.role === 'assistant' ? 'pl-2' : 'pl-8'}`}>
                  <div className={`p-3 rounded-lg ${msg.role === 'assistant' ? 'bg-primary/10' : 'bg-muted'}`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="pl-2 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-white">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (inputValue.trim() && !isLoading) {
                  handleSendMessage(inputValue);
                  setInputValue("");
                }
              }} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder={isLoading ? "Jarvio is thinking..." : "Type a message..."}
                  className="flex-1 min-h-10 px-3 py-2 border rounded-md"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="data" className="flex-1 overflow-hidden">
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Data Log</h3>
            <div className="space-y-2">
              {dataHistory.map((item, i) => (
                <div key={i} className="border p-2 rounded-md">
                  <div className="text-xs text-gray-500">{item.timestamp}</div>
                  <div className="text-sm">{item.message}</div>
                </div>
              ))}
              {dataHistory.length === 0 && (
                <div className="text-center text-gray-500 p-4">No data logged yet</div>
              )}
            </div>
          </div>
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
