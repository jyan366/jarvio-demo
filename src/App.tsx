
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Dashboard from "./pages/Dashboard";
import TaskManager from "./pages/TaskManager";
import ActionStudio from "./pages/ActionStudio";
import SalesHub from "./pages/SalesHub";
import AnalyticsStudio from "./pages/AnalyticsStudio";
import MyOffers from "./pages/MyOffers";
import ReportsBuilder from "./pages/ReportsBuilder";
import Financing from "./pages/Financing";
import MyInventory from "./pages/MyInventory";
import SellerReimbursements from "./pages/SellerReimbursements";
import ListingQuality from "./pages/ListingQuality";
import ListingBuilder from "./pages/ListingBuilder";
import CustomerInsights from "./pages/CustomerInsights";
import CompetitorInsights from "./pages/CompetitorInsights";
import AdvertisingInsights from "./pages/AdvertisingInsights";
import AIAssistant from "./pages/AIAssistant";
import GetSupport from "./pages/GetSupport";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import AdsPerformance from "./pages/AdsPerformance";
import AdsManager from "./pages/AdsManager";
import TaskWork from "./pages/TaskWork";
import ProductReviews from "./pages/ProductReviews";
import AllProductReviews from "./pages/AllProductReviews";
import KnowledgeBase from "./pages/KnowledgeBase";
import AgentsHub from "./pages/AgentsHub";
import JarviFlows from "./pages/JarviFlows";
import FlowBuilder from "./pages/FlowBuilder";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Navigate to="/task-manager" replace />} />
              <Route path="/task-manager" element={<TaskManager />} />
              <Route path="/action-studio" element={<ActionStudio />} />
              <Route path="/jarvi-flows" element={<JarviFlows />} />
              <Route path="/jarvi-flows/builder" element={<FlowBuilder />} />
              <Route path="/jarvi-flows/builder/:flowId" element={<FlowBuilder />} />
              <Route path="/sales-hub" element={<SalesHub />} />
              <Route path="/analytics-studio" element={<AnalyticsStudio />} />
              <Route path="/my-offers" element={<MyOffers />} />
              <Route path="/reports-builder" element={<ReportsBuilder />} />
              <Route path="/financing" element={<Financing />} />
              <Route path="/inventory" element={<MyInventory />} />
              <Route path="/seller-reimbursements" element={<SellerReimbursements />} />
              <Route path="/listing-quality" element={<ListingQuality />} />
              <Route path="/listing-builder" element={<ListingBuilder />} />
              <Route path="/customer-insights" element={<CustomerInsights />} />
              <Route path="/all-product-reviews" element={<AllProductReviews />} />
              <Route path="/product-reviews/:asin" element={<ProductReviews />} />
              <Route path="/my-competitors" element={<CompetitorInsights />} />
              <Route path="/ads-manager" element={<AdsManager />} />
              <Route path="/ads-performance" element={<AdsPerformance />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/agents-hub" element={<AgentsHub />} />
              <Route path="/get-support" element={<GetSupport />} />
              <Route path="/task/:id" element={<TaskWork />} />
              <Route path="/knowledge-base" element={<KnowledgeBase />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
