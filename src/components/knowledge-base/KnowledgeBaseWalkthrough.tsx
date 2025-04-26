
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Upload, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KnowledgeBaseWalkthroughProps {
  onComplete: () => void;
}

export function KnowledgeBaseWalkthrough({ onComplete }: KnowledgeBaseWalkthroughProps) {
  const [step, setStep] = React.useState(1);

  const handleNext = () => {
    if (step === 3) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto px-4 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {[1, 2, 3].map((number) => (
            <div
              key={number}
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                step >= number
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-600 dark:bg-gray-800"
              )}
            >
              {step > number ? (
                <Check className="w-4 h-4" />
              ) : (
                number
              )}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg mb-6">
        {step === 1 && (
          <div className="text-center">
            <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-6 inline-block">
              <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Upload Your First Document</h3>
            <p className="text-muted-foreground mb-6">
              Start by uploading your first document. We support various file formats including PDF, 
              Word, and Excel files. Your documents will be processed and analyzed by our AI.
            </p>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleNext}
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-6 inline-block">
              <Upload className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Processing Your Document</h3>
            <p className="text-muted-foreground mb-6">
              Your document is being processed. Our AI is analyzing the content to generate insights 
              and organize information for your team.
            </p>
            <div className="w-full max-w-xs mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full h-2">
              <div className="bg-purple-600 h-2 rounded-full w-2/3 animate-pulse" />
            </div>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleNext}
            >
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/20 mb-6 inline-block">
              <Check className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Setup Complete!</h3>
            <p className="text-muted-foreground mb-6">
              Great! Your document has been processed and your Knowledge Hub is ready to use. 
              You can now start collaborating with your team and leveraging AI-powered insights.
            </p>
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700"
              onClick={handleNext}
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
