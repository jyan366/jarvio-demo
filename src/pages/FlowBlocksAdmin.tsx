
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FlowBlocksConfig } from '@/components/jarvi-flows/admin/FlowBlocksConfig';
import { FlowBlockDatabaseSync } from '@/components/jarvi-flows/FlowBlockDatabaseSync';
import { toast } from '@/hooks/use-toast';

export default function FlowBlocksAdmin() {
  // Add a toast to notify users that the blocks are being synchronized on page load
  React.useEffect(() => {
    toast({
      title: "Synchronizing flow blocks",
      description: "Flow blocks are being synchronized with the database...",
      duration: 3000,
    });
  }, []);
  
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
