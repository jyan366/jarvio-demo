import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function AITaskAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    // In a future implementation, this would connect to an AI service
    // and create tasks based on the conversation
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary p-0 hover:bg-primary/90 shadow-lg transition-transform hover:scale-105"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex flex-col h-[400px]">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm">
                  Hi! I'm your AI assistant. I can help you create tasks based on the review insights. What would you like to do?
                </p>
              </div>
            </div>
            
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="min-h-[60px]"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="shrink-0"
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
