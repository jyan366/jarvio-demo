import React from 'react';
import { DocumentCard } from './DocumentCard';
import { DocumentMetadata } from '@/types/docs';

interface DocumentGridProps {
  documents: DocumentMetadata[];
  onSelectDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  onViewFlow?: (flowId: string) => void;
}

export function DocumentGrid({ documents, onSelectDocument, onDeleteDocument, onViewFlow }: DocumentGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onSelect={() => onSelectDocument(document.id)}
          onDelete={() => onDeleteDocument(document.id)}
          onViewFlow={onViewFlow}
        />
      ))}
    </div>
  );
}