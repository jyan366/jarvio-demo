import React from 'react';
import { format } from 'date-fns';
import { MoreVertical, Trash2, FileText, Table, TrendingUp, Layout } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DocumentMetadata, DocumentType } from '@/types/docs';

interface DocumentCardProps {
  document: DocumentMetadata;
  onSelect: () => void;
  onDelete: () => void;
}

export function DocumentCard({ document, onSelect, onDelete }: DocumentCardProps) {
  const getTypeIcon = (type: DocumentType) => {
    switch (type) {
      case 'text': return FileText;
      case 'table': return Table;
      case 'output': return TrendingUp;
      case 'template': return Layout;
      default: return FileText;
    }
  };

  const getTypeColor = (type: DocumentType) => {
    switch (type) {
      case 'text': return 'text-blue-600';
      case 'table': return 'text-green-600';
      case 'output': return 'text-purple-600';
      case 'template': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  const TypeIcon = getTypeIcon(document.type);

  return (
    <Card className="group hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TypeIcon className={`h-4 w-4 ${getTypeColor(document.type)}`} />
            <h3 
              className="font-medium text-foreground truncate cursor-pointer hover:text-primary"
              onClick={onSelect}
              title={document.title}
            >
              {document.title}
            </h3>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2" onClick={onSelect}>
          {document.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {document.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {document.wordCount} words
            </span>
            <span>
              {format(new Date(document.updatedAt), 'MMM d')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}