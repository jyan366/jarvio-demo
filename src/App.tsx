import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import Main from "./Main";
import TaskWorkContainer from "./pages/TaskWorkContainer";
import NotFound from "./pages/NotFound";
import BlockTesting from "./pages/BlockTesting";
import Flows from "./pages/Flows";
import FlowBuilder from "./pages/FlowBuilder";
import FlowBlocksAdmin from "./pages/FlowBlocksAdmin";
import Agents from "./pages/Agents";
import BlocksPitchDeck from "./pages/BlocksPitchDeck";

function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Toaster />
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/tasks/:taskId" element={<TaskWorkContainer />} />
            <Route path="/block-testing" element={<BlockTesting />} />
            <Route path="/flows" element={<Flows />} />
            <Route path="/flows/new" element={<FlowBuilder />} />
            <Route path="/flows/:flowId" element={<FlowBuilder />} />
            <Route path="/flow-blocks-admin" element={<FlowBlocksAdmin />} />
            <Route path="/agents" element={<Agents />} />
            <Route path="/blocks-pitch-deck" element={<BlocksPitchDeck />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
