export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  characterCount: number;
}

export interface DocumentMetadata {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  characterCount: number;
}

export interface EditorState {
  currentDocument: Document | null;
  isLoading: boolean;
  isSaving: boolean;
  lastSaved?: Date;
}