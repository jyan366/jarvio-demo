
import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { FileText, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Document {
  id: string;
  title: string;
  description: string | null;
  created_at: string;
}

export function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const { toast } = useToast();

  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('ai_documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents:', error);
      return;
    }

    setDocuments(data || []);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('ai_documents')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });

      // Refresh the list
      fetchDocuments();
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
