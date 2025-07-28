import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ExternalLink, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MarkdownRenderer from '@/components/shared/MarkdownRenderer';

interface DocumentPreviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  title: string;
  content: string;
}

export function DocumentPreviewDialog({ 
  isOpen, 
  onClose, 
  documentId, 
  title, 
  content 
}: DocumentPreviewDialogProps) {
  const navigate = useNavigate();

  const handleOpenInMyDocs = () => {
    // Navigate to MyDocs and load this specific document
    navigate(`/my-docs?doc=${documentId}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>
            Preview of flow output document
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto border rounded-lg p-4 bg-background">
          <MarkdownRenderer content={content} />
        </div>
        
        <div className="flex-shrink-0 flex justify-between items-center pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close Preview
          </Button>
          <Button onClick={handleOpenInMyDocs} className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            Open in My Docs
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}