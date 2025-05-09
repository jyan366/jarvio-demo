
import {
  CheckSquare,
  Sparkles,
  Book,
} from "lucide-react";

import { MenuItem } from "./types";

export const workflowItems: MenuItem[] = [
  {
    icon: CheckSquare,
    label: "Home",
    href: "/task-manager",
    id: "task-manager",
    status: "active",
  },
  {
    icon: Sparkles,
    label: "Action Studio",
    href: "/action-studio",
    id: "action-studio",
    status: "active",
  },
  {
    icon: Book,
    label: "Knowledge Base",
    href: "/knowledge-base",
    id: "knowledge-base", 
    status: "active",
  },
];
