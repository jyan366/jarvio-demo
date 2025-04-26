
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { FileText, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';

interface Document {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { toast } = useToast();

  const fetchDocuments = () => {
    const storedDocs = localStorage.getItem('ai_documents');
    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs));
    }
  };

  const handleDelete = (id: string) => {
    try {
      // Get existing documents
      const existingDocs = JSON.parse(localStorage.getItem('ai_documents') || '[]');
      
      // Filter out the deleted document
      const updatedDocs = existingDocs.filter((doc: Document) => doc.id !== id);
      
      // Update localStorage
      localStorage.setItem('ai_documents', JSON.stringify(updatedDocs));
      
      // Update state
      setDocuments(updatedDocs);

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Add an effect to listen for storage changes from other instances
  useEffect(() => {
    const handleStorageChange = () => {
      fetchDocuments();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (documents.length === 0) {
    return (
      <div className="text-center text-muted-foreground p-4">
        No documents saved yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id} className="p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-primary" />
            <div>
              <h4 className="font-medium">{doc.title}</h4>
              {doc.description && (
                <p className="text-sm text-muted-foreground">{doc.description}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(doc.id)}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Card>
      ))}
    </div>
  );
}
