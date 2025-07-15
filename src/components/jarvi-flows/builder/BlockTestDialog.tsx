import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FlowBlock, FlowStep } from '@/types/flowTypes';
import { Database, Brain, Zap, User, Play, Loader2, AlertCircle, Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BlockTestDialogProps {
  block: FlowBlock | null;
  step: FlowStep | null;
  isOpen: boolean;
  onClose: () => void;
  steps: FlowStep[];
}

export function BlockTestDialog({ block, step, isOpen, onClose, steps }: BlockTestDialogProps) {
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [executionResults, setExecutionResults] = useState<string>('');
  const [blockParams, setBlockParams] = useState<Record<string, any>>({});
  const [blockConfig, setBlockConfig] = useState<any>(null);
  const [previousStepData, setPreviousStepData] = useState<Record<string, any>>({});
  const [availableFields, setAvailableFields] = useState<Record<string, string[]>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchBlockConfig = async () => {
      if (!block) return;
      
      try {
        const { data, error } = await supabase
          .from('flow_block_configs')
          .select('*')
          .eq('block_name', block.option)
          .maybeSingle();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching block config:', error);
          return;
        }

        setBlockConfig(data);
        
        // Initialize parameters with default values
        const configData = data?.config_data as { parameters?: string[] } | null;
        const parameters = configData?.parameters || getBlockDefaults(block.option).parameters;
        const defaultParams = getBlockDefaults(block.option);
        
        setBlockParams(defaultParams);
      } catch (error) {
        console.error('Failed to fetch block config:', error);
      }
    };

    if (isOpen) {
      setExecutionResults('');
      fetchBlockConfig();
    }
  }, [isOpen, block]);

  if (!block || !step) return null;

  const getBlockDefaults = (option: string) => {
    const defaults: Record<string, any> = {
      'All Listing Info': {
        'Number of Days': 30,
        'Marketplace': 'US',
        'Include Images': true,
        'ASIN Filter': 'All Active',
        parameters: ['Number of Days', 'Marketplace', 'Include Images', 'ASIN Filter']
      },
      'Send Email': {
        'Recipients': 'team@company.com',
        'Subject': 'Weekly Performance Report',
        'Template': 'default',
        'Include Attachments': false,
        parameters: ['Recipients', 'Subject', 'Template', 'Include Attachments']
      },
      'Basic AI Analysis': {
        'Analysis Type': 'Performance Trends',
        'Confidence Threshold': 0.8,
        'Output Format': 'Summary',
        'Include Recommendations': true,
        parameters: ['Analysis Type', 'Confidence Threshold', 'Output Format', 'Include Recommendations']
      },
      'AI Summary': {
        'Summary Length': 'Medium',
        'Focus Areas': 'Key Insights',
        'Language': 'English',
        'Include Charts': true,
        parameters: ['Summary Length', 'Focus Areas', 'Language', 'Include Charts']
      },
      'Get Keywords': {
        'Product Category': 'Electronics',
        'Search Volume': 'High',
        'Competition Level': 'Medium',
        'Keyword Count': 50,
        parameters: ['Product Category', 'Search Volume', 'Competition Level', 'Keyword Count']
      },
      'User Text': {
        'Input Type': 'Text',
        'Required Fields': 'Product Name',
        'Validation': 'Not Empty',
        'Max Length': 500,
        parameters: ['Input Type', 'Required Fields', 'Validation', 'Max Length']
      },
      'Upload Sheet': {
        'File Format': 'Excel',
        'Sheet Name': 'Products',
        'Column Mapping': 'Auto-detect',
        'Skip Rows': 1,
        parameters: ['File Format', 'Sheet Name', 'Column Mapping', 'Skip Rows']
      }
    };

    return defaults[option] || {
      'Configuration': 'Default',
      'Enabled': true,
      parameters: ['Configuration', 'Enabled']
    };
  };

  const getBlockDescription = (option: string) => {
    const descriptions: Record<string, string> = {
      'All Listing Info': 'Fetches comprehensive listing information including titles, descriptions, prices, and performance metrics from Amazon.',
      'Send Email': 'Sends automated emails with customizable templates and dynamic content insertion.',
      'Basic AI Analysis': 'Performs intelligent analysis on data using AI to identify patterns, trends, and insights.',
      'AI Summary': 'Generates comprehensive summaries of data using AI with customizable output formats.',
      'Get Keywords': 'Research and gather relevant keywords for your products and market analysis.',
      'User Text': 'Gather custom input and instructions from you to proceed with the task.',
      'Upload Sheet': 'Process uploaded spreadsheets and extract data for analysis.'
    };

    return descriptions[option] || `Execute the ${option} operation with configured parameters.`;
  };

  const handleParamChange = (paramName: string, value: any) => {
    setBlockParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  // Auto-populate field from previous step data
  const handleAutoPopulate = (paramName: string, sourceStep: string, sourceField: string) => {
    const stepData = previousStepData[sourceStep];
    if (stepData && stepData[sourceField]) {
      const value = Array.isArray(stepData[sourceField]) 
        ? stepData[sourceField][0] // Take first item if array
        : stepData[sourceField];
      
      setBlockParams(prev => ({
        ...prev,
        [paramName]: value
      }));

      toast({
        title: "Field Auto-Populated",
        description: `${paramName} set to: ${value}`,
      });
    }
  };

  // Get available data for auto-population
  const getAvailableDataForField = (paramName: string) => {
    const suggestions: Array<{stepId: string, stepTitle: string, field: string, value: any}> = [];
    
    Object.entries(previousStepData).forEach(([stepId, data]) => {
      Object.entries(data).forEach(([field, value]) => {
        // Smart matching based on parameter name
        const paramLower = paramName.toLowerCase();
        const fieldLower = field.toLowerCase();
        
        if (
          paramLower.includes('asin') && fieldLower.includes('asin') ||
          paramLower.includes('category') && fieldLower.includes('categor') ||
          paramLower.includes('product') && fieldLower.includes('product') ||
          paramLower.includes('keyword') && fieldLower.includes('keyword') ||
          paramLower.includes('email') && fieldLower.includes('email') ||
          paramLower.includes('price') && fieldLower.includes('price') ||
          paramLower.includes('sku') && fieldLower.includes('sku')
        ) {
          const stepTitle = getPreviousSteps().find(s => s.id === stepId)?.title || 'Unknown Step';
          suggestions.push({ stepId, stepTitle, field, value });
        }
      });
    });
    
    return suggestions;
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    
    try {
      // Simulate saving configuration
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configuration Saved",
        description: `Parameters for ${block.option} have been saved successfully.`,
      });
      
      console.log(`Saved configuration for ${block.option}:`, blockParams);
      
    } catch (error) {
      console.error('Save failed:', error);
      toast({
        title: "Save Failed",
        description: "Failed to save block configuration.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

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
  ASIN: B08XYZ123 | Price: $79.99 | Sales: 245 units | Rating: 4.6★
  BSR: #1,234 in Electronics | Stock: 156 units
  Category: Electronics > Audio > Headphones

• Product B: Bluetooth Speaker  
  ASIN: B08ABC456 | Price: $49.99 | Sales: 189 units | Rating: 4.4★
  BSR: #2,567 in Electronics | Stock: 89 units
  Category: Electronics > Audio > Speakers

• Product C: USB Charging Cable
  ASIN: B08DEF789 | Price: $12.99 | Sales: 567 units | Rating: 4.2★
  BSR: #890 in Accessories | Stock: 234 units
  Category: Electronics > Accessories > Cables

Available Data Fields:
- ASINs: B08XYZ123, B08ABC456, B08DEF789
- Categories: Electronics, Audio, Headphones, Speakers, Accessories
- Price Range: $12.99 - $79.99
- Stock Levels: 89 - 234 units`,

      'Send Email': `Email successfully sent!

Recipients: team@company.com, manager@company.com
Subject: Weekly Performance Report - ${new Date().toLocaleDateString()}
Delivery Status: ✅ Delivered

Email Content Preview:
- Weekly sales summary
- Top performing products  
- Inventory alerts
- Performance charts attached

Available Data Fields:
- Email IDs: team@company.com, manager@company.com
- Email Subject: Weekly Performance Report
- Delivery Time: ${new Date().toLocaleString()}
- Attachment Names: performance_report.pdf, sales_summary.xlsx`,

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

Available Data Fields:
- Growth Rate: 23%
- Top Product: Premium Wireless Earbuds
- Growth Percentage: 45%
- Low Stock Count: 3
- Optimization Opportunities: 5
- Trend Categories: Electronics, Audio, Accessories`,

      'AI Summary': `Executive Summary Generated 📊

Period: Last 30 days
Analysis Date: ${new Date().toLocaleDateString()}

Key Highlights:
Your Amazon business demonstrates strong growth momentum with significant improvements across multiple metrics.

Performance Overview:
✅ Revenue Growth: 23% increase
✅ Unit Sales: +18% vs previous period
✅ Customer Satisfaction: 4.4/5 average rating
⚠️ Inventory Turnover: Needs attention

Available Data Fields:
- Time Period: 30 days
- Revenue Growth: 23%
- Unit Sales Growth: 18%
- Average Rating: 4.4
- Analysis Date: ${new Date().toLocaleDateString()}
- Key Metrics: Revenue, Sales, Rating, Inventory`,

      'Get Keywords': `Keyword Research Results 🔍

Product Category: Electronics
Search Volume: High Traffic Keywords

Top Keywords Found:
🔥 "wireless earbuds" - 245K monthly searches | CPC: $1.23
🔥 "bluetooth headphones" - 189K monthly searches | CPC: $0.98  
🔥 "noise cancelling" - 167K monthly searches | CPC: $1.45

Long-tail Opportunities:
• "best wireless earbuds 2024" - 23K searches
• "budget bluetooth headphones" - 18K searches
• "waterproof wireless earbuds" - 15K searches

Available Data Fields:
- Keywords: wireless earbuds, bluetooth headphones, noise cancelling
- Search Volumes: 245K, 189K, 167K, 23K, 18K, 15K
- CPC Values: $1.23, $0.98, $1.45
- Categories: Electronics, Audio, Headphones
- Competition Levels: High, Medium, Low`,

      'User Text': `User Input Successfully Collected ✏️

Input Type: Product Information
Validation: ✅ All required fields completed

Collected Data:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Product Name: "Advanced Noise-Cancelling Headphones"
ASIN: B09XYZ789
Category: Electronics > Audio > Headphones  
Target Price: $150-200
Market Position: Premium segment
Target Audience: Professionals & Audiophiles

Available Data Fields:
- Product Name: Advanced Noise-Cancelling Headphones
- ASIN: B09XYZ789  
- Category: Electronics > Audio > Headphones
- Price Range: $150-200
- Market Segment: Premium
- Audience: Professionals, Audiophiles`,

      'Upload Sheet': `Spreadsheet Processing Complete 📋

File: product_inventory_2024.xlsx
Sheet: Product Data | Rows Processed: 234 products

Data Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Products: 234
Categories: 12 unique
Price Range: $8.99 - $299.99  
Active Listings: 221 (94.4%)
Out of Stock: 13 items

Sample Product Data:
- ASIN: B08XYZ111, B08ABC222, B08DEF333
- SKUs: WE-001, BS-002, UC-003
- Categories: Electronics, Home & Garden, Sports
- Brands: TechPro, AudioMax, CableWorks

Available Data Fields:
- ASINs: B08XYZ111, B08ABC222, B08DEF333, B08GHI444
- SKUs: WE-001, BS-002, UC-003, HG-004  
- Categories: Electronics, Home & Garden, Sports, Automotive
- Price Range: $8.99 - $299.99
- Stock Status: In Stock, Low Stock, Out of Stock`
    };

    return outputs[block.option] || `Test execution completed for ${block.option}

✅ Block executed successfully
⏱️ Processing time: 1.8 seconds
📊 Data processed: Sample dataset
🎯 Output generated: Mock results

Available Data Fields:
- Block Name: ${block.option}
- Execution Time: 1.8 seconds
- Status: Success
- Output Type: Mock Data`;
  };

  // Generate structured data from previous steps
  const generatePreviousStepData = (stepTitle: string) => {
    const dataOutputs: Record<string, Record<string, any>> = {
      'Gather Current Inventory Data': {
        ASINs: ['B08XYZ123', 'B08ABC456', 'B08DEF789'],
        SKUs: ['WE-001', 'BS-002', 'UC-003'],
        Categories: ['Electronics', 'Audio', 'Accessories'],
        StockLevels: [156, 89, 234],
        Prices: [79.99, 49.99, 12.99],
        ProductNames: ['Premium Wireless Earbuds', 'Bluetooth Speaker', 'USB Charging Cable']
      },
      'All Listing Info': {
        ASINs: ['B08XYZ123', 'B08ABC456', 'B08DEF789'],
        Categories: ['Electronics > Audio > Headphones', 'Electronics > Audio > Speakers', 'Electronics > Accessories'],
        BSR: [1234, 2567, 890],
        Ratings: [4.6, 4.4, 4.2],
        SalesUnits: [245, 189, 567],
        ProductTitles: ['Premium Wireless Earbuds', 'Bluetooth Speaker', 'USB Charging Cable']
      },
      'Send Email': {
        EmailRecipients: ['team@company.com', 'manager@company.com'],
        EmailSubject: 'Weekly Performance Report',
        AttachmentNames: ['performance_report.pdf', 'sales_summary.xlsx'],
        DeliveryTime: new Date().toISOString(),
        EmailIDs: ['email_001', 'email_002']
      },
      'Basic AI Analysis': {
        GrowthRate: 23,
        TopProduct: 'Premium Wireless Earbuds',
        GrowthPercentage: 45,
        LowStockCount: 3,
        OptimizationOpportunities: 5,
        TrendCategories: ['Electronics', 'Audio', 'Accessories'],
        PerformanceMetrics: ['Revenue', 'Sales', 'Rating', 'Inventory']
      },
      'Get Keywords': {
        Keywords: ['wireless earbuds', 'bluetooth headphones', 'noise cancelling'],
        SearchVolumes: [245000, 189000, 167000],
        CPCValues: [1.23, 0.98, 1.45],
        CompetitionLevels: ['High', 'Medium', 'Low'],
        Categories: ['Electronics', 'Audio', 'Headphones']
      }
    };

    return dataOutputs[stepTitle] || {
      OutputData: `Data from ${stepTitle}`,
      Timestamp: new Date().toISOString(),
      Status: 'Completed'
    };
  };

  const handleExecutePreviousSteps = async () => {
    setIsExecuting(true);
    const newPreviousStepData: Record<string, any> = {};
    const newAvailableFields: Record<string, string[]> = {};

    try {
      const previousSteps = getPreviousSteps();
      let results = '';

      if (previousSteps.length > 0) {
        results += '📋 Executing Previous Steps...\n\n';
        setExecutionResults(results);
        
        for (let i = 0; i < previousSteps.length; i++) {
          const prevStep = previousSteps[i];
          const stepTitle = prevStep.title || `Step ${i + 1}`;
          results += `${i + 1}. ${stepTitle}: `;
          setExecutionResults(results + '⏳ Running...');
          
          // Simulate step execution
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Generate and store structured data for this step
          const stepData = generatePreviousStepData(stepTitle);
          newPreviousStepData[prevStep.id] = stepData;
          newAvailableFields[stepTitle] = Object.keys(stepData);
          
          results += '✅ Completed\n';
          setExecutionResults(results);
        }
        
        results += '\n✅ Previous steps execution complete!\n';
        results += '📊 Data is now available for auto-population in configuration fields.\n';
        
        setExecutionResults(results);
      } else {
        setExecutionResults('ℹ️ No previous steps to execute - this is the first step in the flow.');
      }

      // Store the data for use in config auto-population
      setPreviousStepData(newPreviousStepData);
      setAvailableFields(newAvailableFields);

      toast({
        title: "Previous Steps Complete",
        description: `Successfully executed ${previousSteps.length} previous step${previousSteps.length === 1 ? '' : 's'}. Data is now available for auto-population.`,
      });

    } catch (error) {
      console.error('Previous steps execution failed:', error);
      setExecutionResults('❌ Previous steps execution failed: ' + (error as Error).message);
      toast({
        title: "Execution Failed",
        description: "Failed to execute previous steps.",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleExecuteSteps = async () => {
    setIsExecuting(true);
    setExecutionResults('');

    try {
      let results = '';

      // Check if we have previous step data, if not execute previous steps first
      if (Object.keys(previousStepData).length === 0) {
        const previousSteps = getPreviousSteps();
        const newPreviousStepData: Record<string, any> = {};

        if (previousSteps.length > 0) {
          results += '📋 Executing Previous Steps...\n\n';
          
          for (let i = 0; i < previousSteps.length; i++) {
            const prevStep = previousSteps[i];
            const stepTitle = prevStep.title || `Step ${i + 1}`;
            results += `${i + 1}. ${stepTitle}: `;
            setExecutionResults(results + '⏳ Running...');
            
            await new Promise(resolve => setTimeout(resolve, 800));
            
            const stepData = generatePreviousStepData(stepTitle);
            newPreviousStepData[prevStep.id] = stepData;
            
            results += '✅ Completed\n';
            setExecutionResults(results);
          }
          
          setPreviousStepData(newPreviousStepData);
          results += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
        }
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
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getBlockIcon(block.type)}
            Test Block: {block.option}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-4 flex-1 min-h-0">
          {/* Left Panel - Execute Previous Steps */}
          <Card className="w-1/3 flex flex-col">
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
                      Execute these steps first to generate data for auto-population:
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
                    <div className="pt-3">
                      <Button
                        onClick={handleExecutePreviousSteps}
                        disabled={isExecuting}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8"
                        size="sm"
                      >
                        {isExecuting ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                            Executing...
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 mr-2" />
                            Execute Previous Steps
                          </>
                        )}
                      </Button>
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
              </div>
            </CardContent>
          </Card>

          {/* Middle Panel - Block Configuration & Test */}
          <Card className="w-1/3 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Block Configuration & Test
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col space-y-4">
              <div className={`p-3 rounded-lg ${getBlockColor(block.type)}`}>
                <div className="flex items-center gap-2 mb-2">
                  {getBlockIcon(block.type)}
                  <Badge variant="outline" className="text-xs">
                    {block.type}
                  </Badge>
                  <span className="font-medium text-sm">{block.option}</span>
                </div>
                <p className="text-xs text-gray-600">
                  {getBlockDescription(block.option)}
                </p>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                <Label className="text-sm font-medium">Block Parameters</Label>
                
                {getBlockDefaults(block.option).parameters.map((param) => {
                  const suggestions = getAvailableDataForField(param);
                  
                  return (
                    <div key={param} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium">{param}</Label>
                        {suggestions.length > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-green-600">📊 {suggestions.length} available</span>
                          </div>
                        )}
                      </div>
                      
                      {typeof blockParams[param] === 'boolean' ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={blockParams[param] || false}
                            onChange={(e) => handleParamChange(param, e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-xs">Enabled</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {typeof blockParams[param] === 'number' ? (
                            <Input
                              type="number"
                              value={blockParams[param] || 0}
                              onChange={(e) => handleParamChange(param, parseInt(e.target.value) || 0)}
                              className="text-sm h-8"
                            />
                          ) : (
                            <Input
                              value={blockParams[param] || ''}
                              onChange={(e) => handleParamChange(param, e.target.value)}
                              className="text-sm h-8"
                              placeholder={`Enter ${param.toLowerCase()}`}
                            />
                          )}
                          
                          {/* Auto-populate suggestions */}
                          {suggestions.length > 0 && (
                            <div className="bg-green-50 border border-green-200 rounded p-2 space-y-1">
                              <div className="text-xs text-green-700 font-medium">
                                📊 Available from previous steps:
                              </div>
                              {suggestions.slice(0, 3).map((suggestion, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => handleAutoPopulate(param, suggestion.stepId, suggestion.field)}
                                  className="block w-full text-left text-xs p-1 hover:bg-green-100 rounded"
                                >
                                  <span className="font-medium text-green-700">{suggestion.stepTitle}</span>
                                  <span className="text-green-600"> → {suggestion.field}: </span>
                                  <span className="text-gray-700">
                                    {Array.isArray(suggestion.value) 
                                      ? suggestion.value.slice(0, 2).join(', ') + (suggestion.value.length > 2 ? '...' : '')
                                      : String(suggestion.value).slice(0, 30) + (String(suggestion.value).length > 30 ? '...' : '')
                                    }
                                  </span>
                                </button>
                              ))}
                              {suggestions.length > 3 && (
                                <div className="text-xs text-green-600">
                                  +{suggestions.length - 3} more options available
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Button
                  onClick={handleSaveConfig}
                  disabled={isSaving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white h-8"
                  size="sm"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-3 h-3 mr-2" />
                      Save Config
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleExecuteSteps}
                  disabled={isExecuting}
                  className="w-full bg-green-600 hover:bg-green-700 text-white h-8"
                  size="sm"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 mr-2" />
                      Test This Block
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Panel - Output */}
          <Card className="w-1/3 flex flex-col">
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
                  size="sm"
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