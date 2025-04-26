
import { Brain, Users, Layers } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function KnowledgeBaseStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-b from-purple-200/20 to-transparent rounded-full transform translate-x-8 -translate-y-8" />
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AI Insights Generated</p>
              <h3 className="text-2xl font-bold">184</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-b from-blue-200/20 to-transparent rounded-full transform translate-x-8 -translate-y-8" />
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Team Members</p>
              <h3 className="text-2xl font-bold">7</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden bg-gradient-to-br from-green-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="absolute right-0 top-0 w-32 h-32 bg-gradient-to-b from-green-200/20 to-transparent rounded-full transform translate-x-8 -translate-y-8" />
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <Layers className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Knowledge Base Docs</p>
              <h3 className="text-2xl font-bold">13</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
