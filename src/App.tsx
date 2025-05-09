
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
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </ThemeProvider>
    </div>
  );
}

export default App;
