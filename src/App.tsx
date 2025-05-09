
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Toaster } from "@/components/ui/toaster";

import Home from './pages/Home';
import NotFound from './pages/NotFound';
import TaskManager from './pages/TaskManager';
import TaskWork from './pages/TaskWork';
import ActionStudio from './pages/ActionStudio';
import JarviFlows from './pages/JarviFlows';
import FlowBuilder from './pages/FlowBuilder';
import KnowledgeBase from './pages/KnowledgeBase';
import SalesHub from './pages/SalesHub';
import AgentsHub from './pages/AgentsHub';
import AgentProfile from './pages/AgentProfile';
import AdsManager from './pages/AdsManager';
import AllProductReviews from './pages/AllProductReviews';
import MyOffers from './pages/MyOffers';
import ReportsBuilder from './pages/ReportsBuilder';
import MyInventory from './pages/MyInventory';
import SellerReimbursements from './pages/SellerReimbursements';
import ListingQuality from './pages/ListingQuality';
import ListingBuilder from './pages/ListingBuilder';
import CustomerInsights from './pages/CustomerInsights';
import CompetitorInsights from './pages/CompetitorInsights';
import AdsPerformance from './pages/AdsPerformance';
import GetSupport from './pages/GetSupport';
import Dashboard from './pages/Dashboard';
import Financing from './pages/Financing';
import AnalyticsStudio from './pages/AnalyticsStudio';
import AdvertisingInsights from './pages/AdvertisingInsights';
import AIAssistant from './pages/AIAssistant';

function App() {
  return (
    <div className="App">
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/task-manager" element={<TaskManager />} />
          <Route path="/task/:taskId" element={<TaskWork />} />
          <Route path="/action-studio" element={<ActionStudio />} />
          <Route path="/jarvi-flows" element={<JarviFlows />} />
          <Route path="/jarvi-flows/builder" element={<FlowBuilder />} />
          <Route path="/jarvi-flows/builder/:flowId" element={<FlowBuilder />} />
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          <Route path="/sales-hub" element={<SalesHub />} />
          <Route path="/agents-hub" element={<AgentsHub />} />
          <Route path="/agents-hub/agent/:agentId" element={<AgentProfile />} />
          <Route path="/ads-manager" element={<AdsManager />} />
          <Route path="/all-product-reviews" element={<AllProductReviews />} />
          
          {/* Brand Toolkit Routes */}
          <Route path="/my-offers" element={<MyOffers />} />
          <Route path="/reports-builder" element={<ReportsBuilder />} />
          <Route path="/inventory" element={<MyInventory />} />
          <Route path="/seller-reimbursements" element={<SellerReimbursements />} />
          <Route path="/listing-quality" element={<ListingQuality />} />
          <Route path="/listing-builder" element={<ListingBuilder />} />
          <Route path="/customer-insights" element={<CustomerInsights />} />
          <Route path="/my-competitors" element={<CompetitorInsights />} />
          <Route path="/ads-performance" element={<AdsPerformance />} />
          
          {/* Support Routes */}
          <Route path="/get-support" element={<GetSupport />} />
          
          {/* Other Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/financing" element={<Financing />} />
          <Route path="/analytics-studio" element={<AnalyticsStudio />} />
          <Route path="/advertising-insights" element={<AdvertisingInsights />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;
