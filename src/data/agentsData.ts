
import { Agent } from "@/components/agents/types";

export const agentsData: Agent[] = [
  {
    id: "analise",
    name: "Analise",
    domain: "Analytics",
    personality: "Insightful, calm, thoughtful",
    role: "Spots trends, flags anomalies, makes sense of data",
    tagline: "I help you see what matters.",
    avatarColor: "#1EAEDB", // Bright blue
    description: "I analyze your data to identify performance trends and provide actionable insights to improve your business metrics."
  },
  {
    id: "ivy",
    name: "Ivy",
    domain: "Inventory",
    personality: "Proactive, organised, dependable",
    role: "Manages stock levels and forecasts supply needs",
    tagline: "Never caught off guard.",
    avatarColor: "#33C3F0", // Sky blue
    description: "I track your inventory levels, predict stockouts, and help you maintain optimal stock levels to meet customer demand."
  },
  {
    id: "lena",
    name: "Lena",
    domain: "Listings",
    personality: "Persuasive, elegant, detail-oriented",
    role: "Optimises titles, bullets, and descriptions",
    tagline: "I write to convert.",
    avatarColor: "#7E69AB", // Secondary purple
    description: "I help you craft compelling product listings that convert browsers to buyers through optimized content."
  },
  {
    id: "clara",
    name: "Clara",
    domain: "Customer Insights",
    personality: "Empathetic, clear-eyed, intuitive",
    role: "Understands review patterns and user sentiment",
    tagline: "I turn feedback into growth.",
    avatarColor: "#9b87f5", // Primary purple
    description: "I analyze customer feedback and reviews to help you understand what customers love and where you can improve."
  },
  {
    id: "cam",
    name: "Cam",
    domain: "Competitor Insights",
    personality: "Strategic, observant, quietly competitive",
    role: "Monitors rival listings, pricing, and positioning",
    tagline: "I keep you one move ahead.",
    avatarColor: "#1A1F2C", // Dark purple
    description: "I track your competitors' strategies and market positioning to help you stay competitive and identify opportunities."
  },
  {
    id: "addie",
    name: "Addie",
    domain: "Advertising",
    personality: "Fast, creative, ROI-obsessed",
    role: "Manages and optimises PPC performance",
    tagline: "I make every click count.",
    avatarColor: "#8E9196", // Neutral gray
    description: "I optimize your advertising campaigns to maximize ROI and help you reach your target audience effectively."
  }
];
