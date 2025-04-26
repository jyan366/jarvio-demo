
export interface Document {
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
}

export interface Category {
  id: string;
  label: string;
}

export type ViewMode = 'grid' | 'list';
