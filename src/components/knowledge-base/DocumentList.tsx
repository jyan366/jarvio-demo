import { cn } from '@/lib/utils';
import { DocumentCard } from '@/components/knowledge-base/DocumentCard';
import { Document, ViewMode } from '@/types/knowledge-base';

interface DocumentListProps {
  documents: Document[];
  viewMode: ViewMode;
}

export function DocumentList({ documents, viewMode }: DocumentListProps) {
  return (
    <div className={cn(
      "grid gap-6", 
      viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
    )}>
      {documents.map((doc) => (
        <DocumentCard key={doc.id} document={doc} viewMode={viewMode} />
      ))}
    </div>
  );
}
