
import React from 'react';
import { FileText, Users, Download, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DocumentCardProps {
  document: {
    id: string;
    title: string;
    description: string;
    category: string;
    createdAt: string;
    fileType: string;
    metrics: {
      views: number;
      downloads: number;
    };
  };
  viewMode: 'grid' | 'list';
}

export function DocumentCard({ document, viewMode }: DocumentCardProps) {
  return (
    <Card
      className={cn(
        "group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden",
        "border-l-4 hover:border-l-purple-500",
        "bg-gradient-to-br from-white to-purple-50/30 dark:from-gray-900 dark:to-gray-800",
        viewMode === 'list' ? "flex items-center" : ""
      )}
    >
      <div className={cn(
        "p-6",
        viewMode === 'list' ? "flex items-center flex-1 gap-6" : "space-y-4"
      )}>
        <div className={cn(
          "flex items-center justify-center rounded-lg bg-gradient-to-br from-purple-100 to-blue-50 dark:from-purple-900/50 dark:to-blue-900/30",
          viewMode === 'list' ? "w-16 h-16" : "w-full h-32 mb-4"
        )}>
          <FileText className={cn(
            "transition-transform group-hover:scale-110",
            document.fileType === 'pdf' ? "text-red-500" : "text-blue-500",
            viewMode === 'list' ? "w-8 h-8" : "w-12 h-12"
          )} />
        </div>
                
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold text-lg mb-2 group-hover:text-purple-600 transition-colors">
                {document.title}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {document.description}
              </p>
            </div>
            <Star className="w-5 h-5 text-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200">
              {document.category}
            </span>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                {document.metrics.views}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                {document.metrics.downloads}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
