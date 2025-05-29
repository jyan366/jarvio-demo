
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FlowTemplatesSection } from '@/components/jarvi-flows/FlowTemplatesSection';

export default function CommunityTemplates() {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            2,800+ Workflow
            <br />
            Automation Templates
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover proven workflows built by the community. Copy, customize, and deploy in minutes.
          </p>
        </div>
        
        <FlowTemplatesSection />
      </div>
    </MainLayout>
  );
}
