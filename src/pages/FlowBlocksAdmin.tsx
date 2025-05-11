
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FlowBlocksConfig } from '@/components/jarvi-flows/admin/FlowBlocksConfig';

export default function FlowBlocksAdmin() {
  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Flow Blocks Administration</h1>
        </div>
        <FlowBlocksConfig />
      </div>
    </MainLayout>
  );
}
