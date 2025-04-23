
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CustomerInsights() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Customer Insights</h1>
            <p className="text-muted-foreground mt-1">Analyze and understand your customer behavior</p>
          </div>
          <Button 
            onClick={() => navigate('/task-manager/new')}
            className="bg-[#4457ff] hover:bg-[#4457ff]/90"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Task
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
