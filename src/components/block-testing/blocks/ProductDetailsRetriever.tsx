
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ExecutionResult {
  status: 'idle' | 'running' | 'success' | 'error';
  data?: any;
  error?: string;
  executionTime?: number;
  timestamp?: string;
}

export function ProductDetailsRetriever() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ExecutionResult>({ status: 'idle' });
  const { toast } = useToast();

  const executeBlock = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setResult({ status: 'running' });
    const startTime = Date.now();

    try {
      // TODO: Replace this with actual n8n workflow trigger
      // For now, we'll simulate the workflow execution
      console.log('Triggering n8n workflow for URL:', url);
      
      // Simulate API call to n8n webhook
      const response = await fetch('/api/trigger-n8n-workflow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          workflowId: 'product-details-retriever',
          input: { url }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const executionTime = Date.now() - startTime;

      setResult({
        status: 'success',
        data,
        executionTime,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Success",
        description: "Product details retrieved successfully",
      });

    } catch (error) {
      console.error('Error executing block:', error);
      const executionTime = Date.now() - startTime;
      
      // For demo purposes, simulate a successful response
      const mockData = {
        title: "Sample Product Title",
        price: "$29.99",
        description: "This is a sample product description extracted from the URL.",
        images: [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg"
        ],
        availability: "In Stock",
        rating: 4.5,
        reviews: 123,
        brand: "Sample Brand",
        sku: "SKU123456",
        extractedFrom: url,
        extractionMethod: "n8n workflow simulation"
      };

      setResult({
        status: 'success',
        data: mockData,
        executionTime,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Demo Mode",
        description: "Showing simulated data (n8n workflow not connected yet)",
      });
    }
  };

  const getStatusIcon = () => {
    switch (result.status) {
      case 'running':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  const getStatusBadge = () => {
    switch (result.status) {
      case 'running':
        return <Badge variant="secondary">Running...</Badge>;
      case 'success':
        return <Badge variant="default">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Ready</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Test Configuration
          </CardTitle>
          <CardDescription>
            Enter the product URL to extract details from
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-url">Product URL</Label>
            <Input
              id="product-url"
              type="url"
              placeholder="https://example.com/product/123"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={result.status === 'running'}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Button 
              onClick={executeBlock} 
              disabled={result.status === 'running' || !url.trim()}
              className="flex items-center gap-2"
            >
              {getStatusIcon()}
              {result.status === 'running' ? 'Executing...' : 'Execute Block'}
            </Button>
            
            {getStatusBadge()}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result.status !== 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon()}
              Execution Results
            </CardTitle>
            <CardDescription>
              {result.timestamp && (
                <>
                  Executed at {new Date(result.timestamp).toLocaleString()}
                  {result.executionTime && ` • ${result.executionTime}ms`}
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result.status === 'success' && result.data && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Product Information</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Title:</strong> {result.data.title}</div>
                      <div><strong>Price:</strong> {result.data.price}</div>
                      <div><strong>Brand:</strong> {result.data.brand}</div>
                      <div><strong>SKU:</strong> {result.data.sku}</div>
                      <div><strong>Availability:</strong> {result.data.availability}</div>
                      <div><strong>Rating:</strong> {result.data.rating} ({result.data.reviews} reviews)</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Extraction Details</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Source URL:</strong> <span className="break-all">{result.data.extractedFrom}</span></div>
                      <div><strong>Method:</strong> {result.data.extractionMethod}</div>
                      <div><strong>Images Found:</strong> {result.data.images?.length || 0}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground bg-muted p-3 rounded">
                    {result.data.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Raw Output</h4>
                  <pre className="bg-muted p-3 rounded text-xs overflow-auto max-h-40">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            
            {result.status === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded">
                <h4 className="font-semibold text-red-800 mb-2">Error Details</h4>
                <p className="text-red-700 text-sm">{result.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
