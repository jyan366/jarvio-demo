
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import JarviFlows from './pages/JarviFlows';
import FlowBuilder from './pages/FlowBuilder';
import TaskManager from './pages/TaskManager';
import TaskWork from './pages/TaskWork';
import TaskWorkContainer from './pages/TaskWorkContainer';
import SalesHub from './pages/SalesHub';
import MyInventory from './pages/MyInventory';
import ProductReviews from './pages/ProductReviews';
import AllProductReviews from './pages/AllProductReviews';
import ListingQuality from './pages/ListingQuality';
import ListingBuilder from './pages/ListingBuilder';
import CompetitorInsights from './pages/CompetitorInsights';
import CustomerInsights from './pages/CustomerInsights';
import AdvertisingInsights from './pages/AdvertisingInsights';
import AdsManager from './pages/AdsManager';
import AdsPerformance from './pages/AdsPerformance';
import ReportsBuilder from './pages/ReportsBuilder';
import AnalyticsStudio from './pages/AnalyticsStudio';
import ActionStudio from './pages/ActionStudio';
import MyOffers from './pages/MyOffers';
import SellerReimbursements from './pages/SellerReimbursements';
import Financing from './pages/Financing';
import AIAssistant from './pages/AIAssistant';
import AgentsHub from './pages/AgentsHub';
import AgentProfile from './pages/AgentProfile';
import ChatTest from './pages/ChatTest';
import KnowledgeBase from './pages/KnowledgeBase';
import GetSupport from './pages/GetSupport';
import FlowBlocksAdmin from './pages/FlowBlocksAdmin';
import BlockTesting from './pages/BlockTesting';
import NotFound from './pages/NotFound';
import PitchDeck from './pages/PitchDeck';
import CommunityTemplates from './pages/CommunityTemplates';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/jarvi-flows" element={<JarviFlows />} />
        <Route path="/community-templates" element={<CommunityTemplates />} />
        <Route path="/flow-builder/:flowId?" element={<FlowBuilder />} />
        <Route path="/task-manager" element={<TaskManager />} />
        <Route path="/task/:taskId" element={<TaskWorkContainer />} />
        <Route path="/sales-hub" element={<SalesHub />} />
        <Route path="/my-inventory" element={<MyInventory />} />
        <Route path="/product-reviews" element={<ProductReviews />} />
        <Route path="/all-product-reviews" element={<AllProductReviews />} />
        <Route path="/listing-quality" element={<ListingQuality />} />
        <Route path="/listing-builder" element={<ListingBuilder />} />
        <Route path="/competitor-insights" element={<CompetitorInsights />} />
        <Route path="/customer-insights" element={<CustomerInsights />} />
        <Route path="/advertising-insights" element={<AdvertisingInsights />} />
        <Route path="/ads-manager" element={<AdsManager />} />
        <Route path="/ads-performance" element={<AdsPerformance />} />
        <Route path="/reports-builder" element={<ReportsBuilder />} />
        <Route path="/analytics-studio" element={<AnalyticsStudio />} />
        <Route path="/action-studio" element={<ActionStudio />} />
        <Route path="/my-offers" element={<MyOffers />} />
        <Route path="/seller-reimbursements" element={<SellerReimbursements />} />
        <Route path="/financing" element={<Financing />} />
        <Route path="/ai-assistant" element={<AIAssistant />} />
        <Route path="/agents-hub" element={<AgentsHub />} />
        <Route path="/agent/:agentId" element={<AgentProfile />} />
        <Route path="/chat-test" element={<ChatTest />} />
        <Route path="/knowledge-base" element={<KnowledgeBase />} />
        <Route path="/get-support" element={<GetSupport />} />
        <Route path="/flow-blocks-admin" element={<FlowBlocksAdmin />} />
        <Route path="/block-testing" element={<BlockTesting />} />
        <Route path="/pitch-deck" element={<PitchDeck />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
