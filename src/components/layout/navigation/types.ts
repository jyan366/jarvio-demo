
import { LucideIcon } from 'lucide-react';

export interface SubMenuItem {
  label: string;
  href: string;
}

export interface MenuItem {
  icon: LucideIcon;
  label: string;
  href: string;
  id: string;
  submenu?: SubMenuItem[];
  status?: 'active' | 'coming-soon';
}
