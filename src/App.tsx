
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ActionStudio from "./pages/ActionStudio";
import SalesHub from "./pages/SalesHub";
import MyOffers from "./pages/MyOffers";
import ReportsBuilder from "./pages/ReportsBuilder";
import MyInventory from "./pages/MyInventory";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/action-studio" element={<ActionStudio />} />
          <Route path="/sales-hub" element={<SalesHub />} />
          <Route path="/my-offers" element={<MyOffers />} />
          <Route path="/reports-builder" element={<ReportsBuilder />} />
          <Route path="/inventory" element={<MyInventory />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
