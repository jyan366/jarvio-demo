export type DocumentType = 'text' | 'table' | 'output' | 'template';
export type DocumentCategory = 'documents' | 'outputs' | 'templates';

export interface Document {
  id: string;
  title: string;
  content: string;
  type: DocumentType;
  category: DocumentCategory;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  characterCount: number;
  icon?: string;
  description?: string;
}

export interface DocumentMetadata {
  id: string;
  title: string;
  type: DocumentType;
  category: DocumentCategory;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  characterCount: number;
  icon?: string;
  description?: string;
}

export interface EditorState {
  currentDocument: Document | null;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved?: Date;
}