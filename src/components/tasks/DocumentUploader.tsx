
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, File } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export function DocumentUploader() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  // Simulate file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      if (!title) {
        setTitle(e.target.files[0].name.split('.')[0]);
      }
    }
  };

  const handleUpload = async () => {
    if (!title) return;

    setIsUploading(true);
    
    try {
      // Store document in local storage for demo purposes
      const newDoc = {
        id: crypto.randomUUID(),
        title,
        description,
        created_at: new Date().toISOString(),
      };
      
      // Get existing documents
      const existingDocs = JSON.parse(localStorage.getItem('ai_documents') || '[]');
      
      // Add new document
      localStorage.setItem('ai_documents', JSON.stringify([newDoc, ...existingDocs]));

      toast({
        title: "Success",
        description: "Document saved successfully",
      });

      // Reset form
      setTitle('');
      setDescription('');
      setFileName('');
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

      <div className="space-y-2">
        <Label htmlFor="file">Select File (optional)</Label>
        <div className="flex items-center gap-2">
          <Input
            id="file"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => document.getElementById('file')?.click()}
            className="w-full"
          >
            <File className="mr-2 h-4 w-4" />
            {fileName ? fileName : "Browse Files..."}
          </Button>
        </div>
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
