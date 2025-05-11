
import {
  CheckSquare,
  Sparkles,
  Book,
  GitBranch,
  Settings,
} from "lucide-react";

import { MenuItem } from "./types";

export const workflowItems: MenuItem[] = [
  {
    icon: CheckSquare,
    label: "Home",
    href: "/task-manager",
    id: "task-manager",
  },
  {
    icon: Sparkles,
    label: "Action Studio",
    href: "/action-studio",
    id: "action-studio",
  },
  {
    icon: GitBranch,
    label: "Flows",
    href: "/jarvi-flows",
    id: "jarvi-flows",
  },
  {
    icon: Settings,
    label: "Flow Blocks Admin",
    href: "/flow-blocks-admin",
    id: "flow-blocks-admin",
  },
  {
    icon: Book,
    label: "Knowledge Base",
    href: "/knowledge-base",
    id: "knowledge-base",
  },
];
