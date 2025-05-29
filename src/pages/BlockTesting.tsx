
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { BlockTestingInterface } from '@/components/block-testing/BlockTestingInterface';

export default function BlockTesting() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Block Testing</h1>
          <p className="text-muted-foreground mt-2">
            Test and debug individual flow blocks
          </p>
        </div>
        
        <BlockTestingInterface />
      </div>
    </MainLayout>
  );
}
