import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlowBlock, FlowStep } from '@/types/flowTypes';
import { Database, Brain, Zap, User, Play, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlockTestDialogProps {
  block: FlowBlock | null;
  step: FlowStep | null;
  isOpen: boolean;
  onClose: () => void;
  steps: FlowStep[];
}

export function BlockTestDialog({ block, step, isOpen, onClose, steps }: BlockTestDialogProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResults, setExecutionResults] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setExecutionResults('');
    }
  }, [isOpen, block]);

  if (!block || !step) return null;

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'collect':
        return <Database className="w-4 h-4 text-blue-600" />;
      case 'think':
        return <Brain className="w-4 h-4 text-purple-600" />;
      case 'act':
        return <Zap className="w-4 h-4 text-green-600" />;
      case 'agent':
        return <User className="w-4 h-4 text-orange-600" />;
      default:
        return <Database className="w-4 h-4 text-blue-600" />;
    }
  };

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'collect':
        return 'bg-blue-50 border-blue-200';
      case 'think':
        return 'bg-purple-50 border-purple-200';
      case 'act':
        return 'bg-green-50 border-green-200';
      case 'agent':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Get previous steps that need to be executed
  const getCurrentStepIndex = () => {
    return steps.findIndex(s => s.id === step.id);
  };

  const getPreviousSteps = () => {
    const currentIndex = getCurrentStepIndex();
    return steps.slice(0, currentIndex);
  };

  const generateMockOutput = () => {
    const outputs: Record<string, string> = {
      'All Listing Info': `Successfully retrieved listing data:

• Product A: Premium Wireless Earbuds
  Price: $79.99 | Sales: 245 units | Rating: 4.6★
  ASIN: B08XYZ123 | BSR: #1,234 in Electronics

• Product B: Bluetooth Speaker
  Price: $49.99 | Sales: 189 units | Rating: 4.4★
  ASIN: B08ABC456 | BSR: #2,567 in Electronics

• Product C: USB Charging Cable
  Price: $12.99 | Sales: 567 units | Rating: 4.2★
  ASIN: B08DEF789 | BSR: #890 in Accessories

Total Revenue: $24,567.89
Average Rating: 4.4/5
Data fetched for last 30 days`,

      'Send Email': `Email successfully sent!

Recipients: team@company.com, manager@company.com
Subject: Weekly Performance Report - ${new Date().toLocaleDateString()}
Delivery Status: ✅ Delivered

Email Content Preview:
- Weekly sales summary
- Top performing products
- Inventory alerts
- Performance charts attached

Delivery Metrics:
• Sent: 2 emails
• Delivered: 2 emails
• Open Rate: 85%
• Click Rate: 23%`,

      'Basic AI Analysis': `AI Analysis Complete ✨

Key Insights:
📈 Sales Performance: +23% increase vs last period
🎯 Top Performer: Premium Wireless Earbuds (+45% growth)
⚠️ Inventory Alert: 3 products running low stock
💰 Revenue Optimization: 5 pricing opportunities identified

Trending Products:
1. Wireless Earbuds - Strong upward trend
2. Bluetooth Speakers - Stable performance
3. USB Cables - Seasonal increase

Recommendations:
• Increase inventory for top performers
• Adjust pricing on 2 underperforming items
• Consider promotional campaigns for slow movers

Confidence Score: 94%`,

      'AI Summary': `Executive Summary Generated 📊

Period: Last 30 days
Analysis Date: ${new Date().toLocaleDateString()}

Key Highlights:
Your Amazon business demonstrates strong growth momentum with significant improvements across multiple metrics. The data reveals strategic opportunities for continued expansion.

Performance Overview:
✅ Revenue Growth: 23% increase
✅ Unit Sales: +18% vs previous period
✅ Customer Satisfaction: 4.4/5 average rating
⚠️ Inventory Turnover: Needs attention

Strategic Recommendations:
1. Scale successful product lines
2. Optimize inventory management
3. Enhance marketing for underperformers

Next Steps: Review pricing strategy and inventory levels`,

      'Get Keywords': `Keyword Research Results 🔍

Product Category: Electronics
Search Volume: High Traffic Keywords
Competition Analysis: Medium-High

Top Keywords Found:
🔥 "wireless earbuds" - 245K monthly searches
   Competition: High | CPC: $1.23 | Opportunity Score: 8/10

🔥 "bluetooth headphones" - 189K monthly searches
   Competition: High | CPC: $0.98 | Opportunity Score: 7/10

🔥 "noise cancelling" - 167K monthly searches
   Competition: Medium | CPC: $1.45 | Opportunity Score: 9/10

Long-tail Opportunities:
• "best wireless earbuds 2024" - 23K searches
• "budget bluetooth headphones" - 18K searches
• "waterproof wireless earbuds" - 15K searches

Total Keywords: 47 high-value terms identified`,

      'User Text': `User Input Successfully Collected ✏️

Input Type: Product Information
Validation: ✅ All required fields completed

Collected Data:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Product Name: "Advanced Noise-Cancelling Headphones"
Category: Electronics > Audio > Headphones
Target Price: $150-200
Key Features: 
• Active noise cancellation
• 30-hour battery life
• Quick charge capability
• Premium materials

Market Position: Premium segment
Target Audience: Professionals & Audiophiles
━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Input validation passed
✅ Ready for next processing step`,

      'Upload Sheet': `Spreadsheet Processing Complete 📋

File Details:
📄 File: product_inventory_2024.xlsx
📊 Sheet: Product Data
📈 Rows Processed: 234 products
⏱️ Processing Time: 1.2 seconds

Data Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Products: 234
Categories: 12 unique
Price Range: $8.99 - $299.99
Active Listings: 221 (94.4%)
Out of Stock: 13 items
━━━━━━━━━━━━━━━━━━━━━━━━━━

Column Mapping:
✅ SKU → Product ID
✅ Title → Product Name  
✅ Price → Current Price
✅ Stock → Inventory Count
✅ Sales → Monthly Sales

Ready for analysis pipeline!`
    };

    return outputs[block.option] || `Test execution completed for ${block.option}

✅ Block executed successfully
⏱️ Processing time: 1.8 seconds
📊 Data processed: Sample dataset
🎯 Output generated: Mock results

The ${block.option} block is properly configured and ready for production use. All parameters have been validated and the execution completed without errors.

Sample output data has been generated for testing purposes.`;
  };

  const handleExecuteSteps = async () => {
    setIsExecuting(true);
    setExecutionResults('');

    try {
      const previousSteps = getPreviousSteps();
      let results = '';

      if (previousSteps.length > 0) {
        results += '📋 Executing Previous Steps...\n\n';
        
        for (let i = 0; i < previousSteps.length; i++) {
          const prevStep = previousSteps[i];
          results += `${i + 1}. ${prevStep.title || `Step ${i + 1}`}: `;
          setExecutionResults(results + '⏳ Running...');
          
          // Simulate step execution
          await new Promise(resolve => setTimeout(resolve, 800));
          
          results += '✅ Completed\n';
          setExecutionResults(results);
        }
        
        results += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
      }

      results += `🚀 Executing Current Step: ${step.title || block.option}\n\n`;
      setExecutionResults(results + '⏳ Processing...');

      // Simulate current step execution
      await new Promise(resolve => setTimeout(resolve, 1500));

      results += generateMockOutput();
      setExecutionResults(results);

      toast({
        title: "Execution Complete",
        description: `Successfully executed ${block.option} block with test data.`,
      });

    } catch (error) {
      console.error('Execution failed:', error);
      setExecutionResults(prev => prev + '\n\n❌ Execution failed: ' + (error as Error).message);
      toast({
        title: "Execution Failed",
        description: "The block execution encountered an error.",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const previousSteps = getPreviousSteps();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getBlockIcon(block.type)}
            Test Block: {block.option}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4 flex-1 min-h-0">
          {/* Left Panel - Execute Previous Steps */}
          <Card className="w-1/2 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Play className="w-5 h-5" />
                Execute Previous Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 mb-4">
                {previousSteps.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-600">
                      The following steps will be executed before testing this block:
                    </p>
                    <div className="space-y-2">
                      {previousSteps.map((prevStep, index) => (
                        <div 
                          key={prevStep.id} 
                          className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm"
                        >
                          <span className="text-gray-500 font-mono">
                            {index + 1}.
                          </span>
                          <span className="font-medium">
                            {prevStep.title || `Step ${index + 1}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-lg text-center">
                    <AlertCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-blue-700">
                      This is the first step - no previous steps to execute
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <div className={`p-3 rounded-lg ${getBlockColor(block.type)}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {getBlockIcon(block.type)}
                      <Badge variant="outline" className="text-xs">
                        {block.type}
                      </Badge>
                      <span className="font-medium text-sm">Current: {block.option}</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      {step.description || 'This block will be tested with sample data'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <Button
                  onClick={handleExecuteSteps}
                  disabled={isExecuting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  size="lg"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Executing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Execute & Test
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Output */}
          <Card className="w-1/2 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Database className="w-5 h-5" />
                Output
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 bg-gray-50 rounded border p-4 overflow-y-auto">
                {executionResults ? (
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                    {executionResults}
                  </pre>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <div className="text-center">
                      <Database className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Click "Execute & Test" to see output</p>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <Button
                  onClick={onClose}
                  variant="outline"
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}