

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Home from "./pages/Home";
import TaskWorkContainer from "./pages/TaskWorkContainer";
import NotFound from "./pages/NotFound";
import BlockTesting from "./pages/BlockTesting";
import JarviFlows from "./pages/JarviFlows";
import FlowBuilder from "./pages/FlowBuilder";
import FlowBlocksAdmin from "./pages/FlowBlocksAdmin";
import AgentsHub from "./pages/AgentsHub";
import BlocksPitchDeck from "./pages/BlocksPitchDeck";
import TaskManager from "./pages/TaskManager";
import KnowledgeBase from "./pages/KnowledgeBase";
import SalesHub from "./pages/SalesHub";
import MyOffers from "./pages/MyOffers";
import SellerReimbursements from "./pages/SellerReimbursements";
import ReportsBuilder from "./pages/ReportsBuilder";
import Financing from "./pages/Financing";
import Dashboard from "./pages/Dashboard";
import ActionStudio from "./pages/ActionStudio";
import AnalyticsStudio from "./pages/AnalyticsStudio";
import AdsManager from "./pages/AdsManager";
import AdsPerformance from "./pages/AdsPerformance";
import AdvertisingInsights from "./pages/AdvertisingInsights";
import MyInventory from "./pages/MyInventory";
import ListingBuilder from "./pages/ListingBuilder";
import ListingQuality from "./pages/ListingQuality";
import ProductReviews from "./pages/ProductReviews";
import AllProductReviews from "./pages/AllProductReviews";
import CompetitorInsights from "./pages/CompetitorInsights";
import CustomerInsights from "./pages/CustomerInsights";
import GetSupport from "./pages/GetSupport";
import AIAssistant from "./pages/AIAssistant";
import ChatTest from "./pages/ChatTest";
import Auth from "./pages/Auth";
import AgentProfile from "./pages/AgentProfile";
import TaskWork from "./pages/TaskWork";

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Toaster />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks/:taskId" element={<TaskWorkContainer />} />
            <Route path="/block-testing" element={<BlockTesting />} />
            <Route path="/flows" element={<JarviFlows />} />
            <Route path="/flows/new" element={<FlowBuilder />} />
            <Route path="/flows/:flowId" element={<FlowBuilder />} />
            <Route path="/flow-blocks-admin" element={<FlowBlocksAdmin />} />
            <Route path="/agents" element={<AgentsHub />} />
            <Route path="/blocks-pitch-deck" element={<BlocksPitchDeck />} />
            <Route path="/task-manager" element={<TaskManager />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/sales-hub" element={<SalesHub />} />
            <Route path="/my-offers" element={<MyOffers />} />
            <Route path="/seller-reimbursements" element={<SellerReimbursements />} />
            <Route path="/reports-builder" element={<ReportsBuilder />} />
            <Route path="/financing" element={<Financing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/action-studio" element={<ActionStudio />} />
            <Route path="/analytics-studio" element={<AnalyticsStudio />} />
            <Route path="/ads-manager" element={<AdsManager />} />
            <Route path="/ads-performance" element={<AdsPerformance />} />
            <Route path="/advertising-insights" element={<AdvertisingInsights />} />
            <Route path="/my-inventory" element={<MyInventory />} />
            <Route path="/listing-builder" element={<ListingBuilder />} />
            <Route path="/listing-quality" element={<ListingQuality />} />
            <Route path="/product-reviews" element={<ProductReviews />} />
            <Route path="/all-product-reviews" element={<AllProductReviews />} />
            <Route path="/competitor-insights" element={<CompetitorInsights />} />
            <Route path="/customer-insights" element={<CustomerInsights />} />
            <Route path="/get-support" element={<GetSupport />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/chat-test" element={<ChatTest />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/agent/:agentId" element={<AgentProfile />} />
            <Route path="/task-work/:taskId" element={<TaskWork />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;

