
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { FlowBlock } from '@/types/flowTypes';
import { Database, Brain, Zap, User, Play, Loader2, Save, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BlockConfigDialogProps {
  block: FlowBlock | null;
  isOpen: boolean;
  onClose: () => void;
}

export function BlockConfigDialog({ block, isOpen, onClose }: BlockConfigDialogProps) {
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [blockConfig, setBlockConfig] = useState<any>(null);
  const [isPopulatingAI, setIsPopulatingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const { toast } = useToast();

  // Initialize block parameters state
  const [blockParams, setBlockParams] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchBlockConfig = async () => {
      if (!block) return;
      
      try {
        const { data, error } = await supabase
          .from('flow_block_configs')
          .select('*')
          .eq('block_name', block.option)
          .single();

        if (error) {
          console.error('Error fetching block config:', error);
          return;
        }

        setBlockConfig(data);
        
        // Initialize parameters with default values
        const configData = data?.config_data as { parameters?: string[] } | null;
        const parameters = configData?.parameters || ['Configuration', 'Enabled'];
        const defaultParams: Record<string, any> = {};
        parameters.forEach((param: string) => {
          defaultParams[param] = '';
        });
        defaultParams['Enabled'] = true;
        
        setBlockParams(defaultParams);
        setTestOutput(null);
      } catch (error) {
        console.error('Failed to fetch block config:', error);
      }
    };

    fetchBlockConfig();
  }, [block]);

  if (!block) return null;

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
        return null;
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

  const getBlockDefaults = (option: string) => {
    const defaults: Record<string, Record<string, any>> = {
      'All Listing Info': {
        'Number of Days': 30,
        'Marketplace': 'US',
        'Include Images': true,
        'ASIN Filter': 'All Active'
      },
      'Send Email': {
        'Recipients': 'team@company.com',
        'Subject': 'Weekly Performance Report',
        'Template': 'default',
        'Include Attachments': false
      },
      'Basic AI Analysis': {
        'Analysis Type': 'Performance Trends',
        'Confidence Threshold': 0.8,
        'Output Format': 'Summary',
        'Include Recommendations': true
      },
      'AI Summary': {
        'Summary Length': 'Medium',
        'Focus Areas': 'Key Insights',
        'Language': 'English',
        'Include Charts': true
      },
      'Get Keywords': {
        'Product Category': 'Electronics',
        'Search Volume': 'High',
        'Competition Level': 'Medium',
        'Keyword Count': 50
      },
      'User Text': {
        'Input Type': 'Text',
        'Required Fields': 'Product Name',
        'Validation': 'Not Empty',
        'Max Length': 500
      },
      'Upload Sheet': {
        'File Format': 'Excel',
        'Sheet Name': 'Products',
        'Column Mapping': 'Auto-detect',
        'Skip Rows': 1
      }
    };

    return defaults[option] || {
      'Configuration': 'Default',
      'Enabled': true
    };
  };

  const getBlockDetails = (option: string) => {
    const blockDetails: Record<string, { description: string; parameters: string[] }> = {
      'All Listing Info': {
        description: 'Fetches comprehensive listing information including titles, descriptions, prices, and performance metrics from Amazon.',
        parameters: ['Number of Days', 'Marketplace', 'Include Images', 'ASIN Filter']
      },
      'Send Email': {
        description: 'Sends automated emails with customizable templates and dynamic content insertion.',
        parameters: ['Recipients', 'Subject', 'Template', 'Include Attachments']
      },
      'Basic AI Analysis': {
        description: 'Performs intelligent analysis on data using AI to identify patterns, trends, and insights.',
        parameters: ['Analysis Type', 'Confidence Threshold', 'Output Format', 'Include Recommendations']
      },
      'AI Summary': {
        description: 'Generates comprehensive summaries of data using AI with customizable output formats.',
        parameters: ['Summary Length', 'Focus Areas', 'Language', 'Include Charts']
      },
      'Get Keywords': {
        description: 'Research and gather relevant keywords for your products and market analysis.',
        parameters: ['Product Category', 'Search Volume', 'Competition Level', 'Keyword Count']
      },
      'User Text': {
        description: 'Gather custom input and instructions from you to proceed with the task.',
        parameters: ['Input Type', 'Required Fields', 'Validation', 'Max Length']
      },
      'Upload Sheet': {
        description: 'Process uploaded spreadsheets and extract data for analysis.',
        parameters: ['File Format', 'Sheet Name', 'Column Mapping', 'Skip Rows']
      }
    };

    return blockDetails[option] || {
      description: `Execute the ${option} operation with configured parameters.`,
      parameters: ['Configuration', 'Enabled']
    };
  };

  const generateDummyOutput = (option: string, params: Record<string, any>) => {
    const outputs: Record<string, (params: Record<string, any>) => string> = {
      'All Listing Info': (params) => `
Successfully fetched listing data for ${params['Number of Days'] || 30} days from ${params['Marketplace'] || 'US'} marketplace.

Found 23 active listings:
• Product A: $24.99, 156 units sold, 4.2★ rating
• Product B: $39.99, 89 units sold, 4.5★ rating  
• Product C: $14.99, 234 units sold, 4.0★ rating

Total Revenue: $8,456.78
Average Rating: 4.2/5
${params['Include Images'] ? 'Product images included in dataset' : 'Images excluded from dataset'}
      `,
      'Send Email': (params) => `
Email sent successfully!

To: ${params['Recipients'] || 'team@company.com'}
Subject: ${params['Subject'] || 'Weekly Performance Report'}
Template: ${params['Template'] || 'default'}
Sent at: ${new Date().toLocaleString()}

Email delivered to 3 recipients
Open rate: 87%
${params['Include Attachments'] ? 'Attachments: performance_report.pdf' : 'No attachments'}
      `,
      'Basic AI Analysis': (params) => `
AI Analysis Complete (${params['Analysis Type'] || 'Performance Trends'})

Key Findings:
• Sales increased 23% compared to last period
• Buy Box win rate: 78% (↑12%)
• Top performing ASIN: B08XYZ123 (+45% sales)
• Recommended price adjustment for 3 products

Confidence Score: ${(params['Confidence Threshold'] || 0.8) * 100}%
${params['Include Recommendations'] ? 'Actionable recommendations generated' : 'Analysis only, no recommendations'}
      `,
      'AI Summary': (params) => `
${params['Summary Length'] || 'Medium'} Summary Generated

Focus: ${params['Focus Areas'] || 'Key Insights'}
Language: ${params['Language'] || 'English'}

Executive Summary:
Your Amazon business showed strong performance this period with 23% growth in sales and improved customer satisfaction. The AI analysis identified 3 key opportunities for optimization and 2 potential risks to monitor.

${params['Include Charts'] ? 'Charts and visualizations included' : 'Text-only summary'}
      `,
      'Get Keywords': (params) => `
Keyword Research Complete

Category: ${params['Product Category'] || 'Electronics'}
Search Volume Filter: ${params['Search Volume'] || 'High'}
Competition: ${params['Competition Level'] || 'Medium'}

Found ${params['Keyword Count'] || 50} relevant keywords:
• "wireless earbuds" - 245K searches/month, Competition: Medium
• "bluetooth headphones" - 189K searches/month, Competition: High  
• "noise cancelling" - 167K searches/month, Competition: Low
• "waterproof speakers" - 98K searches/month, Competition: Medium

Top opportunities identified for your products.
      `,
      'User Text': (params) => `
User Input Collected

Input Type: ${params['Input Type'] || 'Text'}
Required Fields: ${params['Required Fields'] || 'Product Name'}
Validation: ${params['Validation'] || 'Not Empty'}

Sample collected data:
• Product Name: "Premium Wireless Earbuds"
• Category: "Electronics > Audio"
• Price Range: "$50-$100"

Input validation passed. Ready for next step.
      `,
      'Upload Sheet': (params) => `
Spreadsheet Processed Successfully

File Format: ${params['File Format'] || 'Excel'}
Sheet: ${params['Sheet Name'] || 'Products'}
Rows Processed: 157 (skipped ${params['Skip Rows'] || 1} header row)

Data Summary:
• Products: 157 items
• Categories: 12 unique
• Price Range: $5.99 - $299.99
• ${params['Column Mapping'] === 'Auto-detect' ? 'Columns auto-mapped successfully' : 'Manual column mapping applied'}

Ready for analysis or next processing step.
      `
    };

    const generator = outputs[option];
    return generator ? generator(params) : `Test completed for ${option} block with parameters: ${JSON.stringify(params, null, 2)}`;
  };

  const handleTestBlock = async () => {
    setIsTesting(true);
    
    try {
      // Simulate API call to test the block
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const output = generateDummyOutput(block.option, blockParams);
      setTestOutput(output);
      
      toast({
        title: "Block Test Successful",
        description: `${block.option} block executed successfully with test data.`,
      });
      
      console.log(`Testing ${block.option} block with parameters:`, blockParams);
      
    } catch (error) {
      console.error('Block test failed:', error);
      toast({
        title: "Block Test Failed",
        description: "The block test encountered an error. Please check the configuration.",
        variant: "destructive"
      });
    } finally {
      setIsTesting(false);
    }
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

  const handleParamChange = (paramName: string, value: any) => {
    setBlockParams(prev => ({
      ...prev,
      [paramName]: value
    }));
  };

  const handleAIPopulate = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a prompt to generate parameters.",
        variant: "destructive"
      });
      return;
    }

    setIsPopulatingAI(true);
    
    try {
      // Call AI service to populate parameters
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Generate parameters for a ${block?.type} block called "${block?.option}" based on this prompt: "${aiPrompt}". 
          
          Available parameters: ${blockDetails.parameters.join(', ')}
          
          Please provide realistic values for each parameter based on the prompt. Return a JSON object with parameter names as keys and appropriate values.
          
          Example format:
          {
            "Input Type": "Text",
            "Required Fields": "Product Name, Category",
            "Validation": "Not Empty",
            "Max Length": 500
          }`,
          type: 'parameters'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate parameters');
      }

      const data = await response.json();
      let aiResponse = data.response || data.message || '';
      
      // Extract JSON from the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const generatedParams = JSON.parse(jsonMatch[0]);
        
        // Update parameters with AI-generated values
        const updatedParams = { ...blockParams };
        Object.entries(generatedParams).forEach(([key, value]) => {
          if (blockDetails.parameters.includes(key)) {
            updatedParams[key] = value;
          }
        });
        
        setBlockParams(updatedParams);
        setShowAiPrompt(false);
        setAiPrompt('');
        
        toast({
          title: "Parameters Populated",
          description: "AI has successfully populated the block parameters based on your prompt.",
        });
      } else {
        throw new Error('Invalid AI response format');
      }
      
    } catch (error) {
      console.error('AI populate failed:', error);
      toast({
        title: "AI Population Failed",
        description: "Failed to generate parameters with AI. Please try again or set them manually.",
        variant: "destructive"
      });
    } finally {
      setIsPopulatingAI(false);
    }
  };

  // Use blockConfig from database instead of hardcoded data
  const blockDetails = blockConfig ? {
    description: blockConfig.credentials?.description || 
      `Execute the ${blockConfig.block_name} operation with configured parameters.`,
    parameters: (blockConfig.config_data as { parameters?: string[] })?.parameters || ['Configuration', 'Enabled']
  } : {
    description: `Execute the ${block.option} operation with configured parameters.`,
    parameters: ['Configuration', 'Enabled']
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getBlockIcon(block.type)}
            Configure Block: {block.option}
          </DialogTitle>
        </DialogHeader>
        
        <div className={`p-4 rounded-lg border ${getBlockColor(block.type)}`}>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize text-xs">
                  {block.type}
                </Badge>
                <span className="text-sm font-medium">{block.option}</span>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <p className="text-sm text-gray-600 mt-1">{blockDetails.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Block Parameters</Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowAiPrompt(!showAiPrompt)}
                    className="flex items-center gap-2 text-xs"
                  >
                    <Sparkles className="w-3 h-3" />
                    AI Populate
                  </Button>
                </div>
                
                {showAiPrompt && (
                  <div className="space-y-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <Label className="text-xs font-medium">Describe what you want this block to do:</Label>
                    <Textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g., 'Collect product information from user including name, description, and price range'"
                      rows={2}
                      className="text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleAIPopulate}
                        disabled={isPopulatingAI}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        {isPopulatingAI ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3 h-3 mr-1" />
                            Generate
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowAiPrompt(false);
                          setAiPrompt('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                
                {blockDetails.parameters.map((param) => (
                  <div key={param} className="space-y-2">
                    <Label className="text-xs font-medium">{param}</Label>
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
                    ) : typeof blockParams[param] === 'number' ? (
                      <Input
                        type="number"
                        value={blockParams[param] || 0}
                        onChange={(e) => handleParamChange(param, parseInt(e.target.value) || 0)}
                        className="text-sm"
                      />
                    ) : (
                      <Input
                        value={blockParams[param] || ''}
                        onChange={(e) => handleParamChange(param, e.target.value)}
                        className="text-sm"
                        placeholder={`Enter ${param.toLowerCase()}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-medium">Test Output</Label>
                {testOutput ? (
                  <div className="bg-gray-50 p-3 rounded border text-xs">
                    <pre className="text-gray-700 whitespace-pre-wrap font-mono">
                      {testOutput}
                    </pre>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-3 rounded border text-xs text-gray-500 text-center">
                    Click "Test Block" to see sample output
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleSaveConfig}
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Configuration
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleTestBlock}
                disabled={isTesting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Test Block
                  </>
                )}
              </Button>
              
              <Button
                onClick={onClose}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
