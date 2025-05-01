
import {
  LayoutGrid,
  Sparkles,
  ShoppingCart,
  LineChart,
  Tag,
  FileBarChart2,
  CreditCard,
  Package,
  ArrowRightLeft,
  FileCheck,
  FilePlus2,
  Users,
  UserSearch,
  Activity,
  MessageSquare,
  Bot,
  FolderClock,
} from "lucide-react";

import { MenuItem } from "./types";

export const workflowItems: MenuItem[] = [
  {
    icon: FolderClock,
    label: "Task Manager",
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
    icon: Bot,
    label: "Agents Hub",
    href: "/agents-hub",
    id: "agents-hub", 
    status: "active",
  },
  {
    icon: ShoppingCart,
    label: "Sales Hub",
    href: "/sales-hub",
    id: "sales-hub",
    status: "active",
  },
  {
    icon: LineChart,
    label: "Analytics Studio",
    href: "/analytics-studio",
    id: "analytics-studio",
    status: "active",
    submenu: [
      {
        label: "Overview",
        href: "/analytics-studio",
      },
      {
        label: "Business Reports",
        href: "/reports-builder",
      },
    ],
  },
  {
    icon: LayoutGrid,
    label: "Brand Toolkit",
    href: "#",
    id: "brand-toolkit",
    status: "active",
    submenu: [
      {
        label: "My Inventory",
        href: "/inventory",
      },
      {
        label: "My Offers",
        href: "/my-offers",
      },
      {
        label: "Listing Quality Score",
        href: "/listing-quality",
      },
      {
        label: "Listing Builder",
        href: "/listing-builder",
      },
    ],
  },
  {
    icon: UserSearch,
    label: "Customer Insights",
    href: "/customer-insights",
    id: "customer-insights",
    status: "active",
    submenu: [
      {
        label: "Overview",
        href: "/customer-insights",
      },
      {
        label: "Product Reviews",
        href: "/all-product-reviews",
      },
    ],
  },
  {
    icon: Users,
    label: "Competitor Insights",
    href: "/my-competitors",
    id: "competitor-insights",
    status: "active",
  },
  {
    icon: Activity,
    label: "Advertising",
    href: "/ads-manager",
    id: "advertising",
    status: "active",
    submenu: [
      {
        label: "Ads Manager",
        href: "/ads-manager",
      },
      {
        label: "Performance",
        href: "/ads-performance",
      },
    ],
  },
  {
    icon: MessageSquare,
    label: "AI Assistant",
    href: "/ai-assistant",
    id: "ai-assistant",
    status: "active",
  },
];
