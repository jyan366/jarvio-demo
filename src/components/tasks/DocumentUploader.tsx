
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function DocumentUploader() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!title) return;

    setIsUploading(true);
    try {
      // For demo purposes, we'll use a fixed demo user ID
      const demoUserId = "00000000-0000-0000-0000-000000000000";
      
      // Store document metadata in the database
      const { error: dbError } = await supabase
        .from('ai_documents')
        .insert({
          title,
          description,
          file_path: 'demo-path', // Placeholder path
          file_type: 'text/plain',
          file_size: 0,
          user_id: demoUserId
        });

      if (dbError) throw dbError;

      toast({
        title: "Success",
        description: "Document saved successfully",
      });

      // Reset form
      setTitle('');
      setDescription('');
    } catch (error) {
      console.error('Error saving document:', error);
      toast({
        title: "Error",
        description: "Failed to save document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="space-y-2">
        <Label htmlFor="title">Document Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter document title"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter document description"
          rows={3}
        />
      </div>

      <Button
        onClick={handleUpload}
        disabled={!title || isUploading}
        className="w-full"
      >
        {isUploading ? (
          "Saving..."
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Save Document
          </>
        )}
      </Button>
    </div>
  );
}
