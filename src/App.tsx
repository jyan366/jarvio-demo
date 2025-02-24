
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import ActionStudio from "./pages/ActionStudio";
import SalesHub from "./pages/SalesHub";
import MyOffers from "./pages/MyOffers";
import ReportsBuilder from "./pages/ReportsBuilder";
import Financing from "./pages/Financing";
import MyInventory from "./pages/MyInventory";
import ListingQuality from "./pages/ListingQuality";
import ListingBuilder from "./pages/ListingBuilder";
import CustomerInsights from "./pages/CustomerInsights";
import CompetitorInsights from "./pages/CompetitorInsights";
import AdvertisingInsights from "./pages/AdvertisingInsights";
import AIAssistant from "./pages/AIAssistant";
import GetSupport from "./pages/GetSupport";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";

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
              <Route path="/" element={<Index />} />
              <Route path="/action-studio" element={<ActionStudio />} />
              <Route path="/sales-hub" element={<SalesHub />} />
              <Route path="/my-offers" element={<MyOffers />} />
              <Route path="/reports-builder" element={<ReportsBuilder />} />
              <Route path="/financing" element={<Financing />} />
              <Route path="/inventory" element={<MyInventory />} />
              <Route path="/listing-quality" element={<ListingQuality />} />
              <Route path="/listing-builder" element={<ListingBuilder />} />
              <Route path="/customer-insights" element={<CustomerInsights />} />
              <Route path="/my-competitors" element={<CompetitorInsights />} />
              <Route path="/ads-manager" element={<AdvertisingInsights />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/get-support" element={<GetSupport />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
