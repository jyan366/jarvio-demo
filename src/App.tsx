
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
import SalesHub from './pages/SalesHub';
import MyOffers from './pages/MyOffers';
import ReportsBuilder from './pages/ReportsBuilder';
import SellerReimbursements from './pages/SellerReimbursements';
import AgentsHub from './pages/AgentsHub';
import KnowledgeBase from './pages/KnowledgeBase';

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
          
          {/* Brand Toolkit Routes */}
          <Route path="/sales-hub" element={<SalesHub />} />
          <Route path="/my-offers" element={<MyOffers />} />
          <Route path="/reports-builder" element={<ReportsBuilder />} />
          <Route path="/seller-reimbursements" element={<SellerReimbursements />} />
          
          {/* Knowledge Base Routes */}
          <Route path="/knowledge-base" element={<KnowledgeBase />} />
          
          {/* Support Routes */}
          <Route path="/agents-hub" element={<AgentsHub />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;
