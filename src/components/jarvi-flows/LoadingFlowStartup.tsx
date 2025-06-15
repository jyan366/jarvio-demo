
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Play, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface LoadingFlowStartupProps {
  flowName: string;
  onCancel: () => void;
}

export function LoadingFlowStartup({ flowName, onCancel }: LoadingFlowStartupProps) {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <div className="p-3 bg-blue-100 rounded-full">
              <Play className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-xl">Starting Flow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <h3 className="font-medium text-lg mb-2">{flowName}</h3>
            <p className="text-sm text-muted-foreground">
              Creating task and preparing execution environment...
            </p>
          </div>
          
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Setting up flow...</span>
              <span>{progress}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>This will only take a moment</span>
          </div>
          
          <div className="flex justify-center pt-2">
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
