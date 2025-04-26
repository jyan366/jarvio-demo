
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight } from 'lucide-react';

interface EmptyKnowledgeBaseProps {
  onGetStarted: () => void;
}

export function EmptyKnowledgeBase({ onGetStarted }: EmptyKnowledgeBaseProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-6">
        <FileText className="w-8 h-8 text-purple-600 dark:text-purple-400" />
      </div>
      <h2 className="text-2xl font-bold mb-3">Welcome to Knowledge Hub</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Train Jarvio AI and empower your team by adding your first document. 
        Your knowledge base helps generate valuable insights for better decision-making.
      </p>
      <Button onClick={onGetStarted} size="lg" className="bg-purple-600 hover:bg-purple-700">
        Get Started
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
