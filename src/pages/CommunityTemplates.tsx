
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FlowTemplatesSection } from '@/components/jarvi-flows/FlowTemplatesSection';

export default function CommunityTemplates() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-white mb-6">
              2,800+ Workflow
              <br />
              Automation Templates
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
              Discover proven workflows built by the community. Copy, customize, and deploy in minutes.
            </p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <FlowTemplatesSection />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
