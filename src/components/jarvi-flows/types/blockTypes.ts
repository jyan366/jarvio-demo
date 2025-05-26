
import { LucideIcon } from 'lucide-react';

export interface Block {
  name: string;
  summary: string;
  description: string;
  icon: LucideIcon;
  logo: string | null;
  needsConnection: boolean;
  connectionService: string | null;
}

export interface BlocksData {
  collect: Block[];
  think: Block[];
  act: Block[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
}
