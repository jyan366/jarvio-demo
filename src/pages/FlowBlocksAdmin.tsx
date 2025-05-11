
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FlowBlocksConfig } from '@/components/jarvi-flows/admin/FlowBlocksConfig';
import { FlowBlockDatabaseSync } from '@/components/jarvi-flows/FlowBlockDatabaseSync';

export default function FlowBlocksAdmin() {
  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Flow Blocks Administration</h1>
        </div>
        {/* Add FlowBlockDatabaseSync to automatically sync blocks on page load */}
        <FlowBlockDatabaseSync />
        <FlowBlocksConfig />
      </div>
    </MainLayout>
  );
}
