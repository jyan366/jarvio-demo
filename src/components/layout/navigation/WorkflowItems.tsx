
import {
  CheckSquare,
  Sparkles,
  Book,
  GitBranch,
  Settings,
  TestTube,
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
    label: "Insights Studio",
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
    icon: TestTube,
    label: "Block Testing",
    href: "/block-testing",
    id: "block-testing",
  },
  {
    icon: Book,
    label: "Knowledge Base",
    href: "/knowledge-base",
    id: "knowledge-base",
  },
];
