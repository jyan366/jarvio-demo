import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, CheckCircle, XCircle, Wifi } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExecutionResult {
  status: 'idle' | 'running' | 'success' | 'error';
  data?: any;
  error?: string;
  executionTime?: number;
  timestamp?: string;
}

const N8N_WEBHOOK_URL = 'https://jarvio.app.n8n.cloud/webhook/698a75e6-643c-496e-9a84-31543b7d9573';

export function ProductDetailsRetriever() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ExecutionResult>({ status: 'idle' });
  const [connectionTest, setConnectionTest] = useState<ExecutionResult>({ status: 'idle' });
  const { toast } = useToast();

  const testConnection = async () => {
    setConnectionTest({ status: 'running' });
    const startTime = Date.now();

    try {
      console.log('Making POST request to n8n webhook:', N8N_WEBHOOK_URL);
      
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          test: true,
          action: 'connection_test',
          message: 'Connection test from Block Testing page',
          timestamp: new Date().toISOString(),
          source: 'block-testing-interface'
        }),
      });

      const executionTime = Date.now() - startTime;
      console.log('Response status:', response.status);
      
      if (response.ok) {
        let responseData;
        try {
          responseData = await response.json();
        } catch (e) {
          responseData = await response.text();
        }
        
        setConnectionTest({
          status: 'success',
          data: responseData,
          executionTime,
          timestamp: new Date().toISOString(),
        });

        toast({
          title: "Connection Test Successful",
          description: `Connected to n8n webhook in ${executionTime}ms`,
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Connection test failed:', error);
      const executionTime = Date.now() - startTime;
      
      setConnectionTest({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Connection Test Failed",
        description: error instanceof Error ? error.message : 'Failed to connect to n8n webhook',
        variant: "destructive",
      });
    }
  };

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
      console.log('Making POST request to trigger n8n workflow for URL:', url);
      
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          test: false,
          action: 'extract_product_details',
          blockType: 'collect',
          blockName: 'Retrieve Product Details from Website',
          url: url,
          blockId: 'product-details-retriever',
          timestamp: new Date().toISOString(),
          source: 'block-testing-interface'
        }),
      });

      const executionTime = Date.now() - startTime;
      console.log('Response status:', response.status);

      if (response.ok) {
        let responseData;
        try {
          responseData = await response.json();
        } catch (e) {
          responseData = await response.text();
        }
        
        setResult({
          status: 'success',
          data: responseData,
          executionTime,
          timestamp: new Date().toISOString(),
        });

        toast({
          title: "Block Execution Successful",
          description: `n8n workflow completed in ${executionTime}ms`,
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Error executing block:', error);
      const executionTime = Date.now() - startTime;
      
      setResult({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Execution Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: ExecutionResult['status']) => {
    switch (status) {
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

  const getStatusBadge = (status: ExecutionResult['status']) => {
    switch (status) {
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
      {/* Connection Test Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wifi className="h-5 w-5" />
            Connection Test
          </CardTitle>
          <CardDescription>
            Test the POST connection to your n8n webhook: {N8N_WEBHOOK_URL}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={testConnection} 
              disabled={connectionTest.status === 'running'}
              className="flex items-center gap-2"
              variant="outline"
            >
              {getStatusIcon(connectionTest.status)}
              {connectionTest.status === 'running' ? 'Testing...' : 'Test Connection'}
            </Button>
            
            {getStatusBadge(connectionTest.status)}
          </div>

          {connectionTest.status !== 'idle' && (
            <div className="mt-4 p-3 bg-muted rounded text-sm">
              <div className="font-medium mb-2">Connection Test Result:</div>
              {connectionTest.status === 'success' && (
                <div className="text-green-700">
                  ✅ POST request successful ({connectionTest.executionTime}ms)
                  {connectionTest.data && (
                    <pre className="mt-2 text-xs bg-background p-2 rounded overflow-auto">
                      {JSON.stringify(connectionTest.data, null, 2)}
                    </pre>
                  )}
                </div>
              )}
              {connectionTest.status === 'error' && (
                <div className="text-red-700">
                  ❌ POST request failed: {connectionTest.error}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
              {getStatusIcon(result.status)}
              {result.status === 'running' ? 'Executing...' : 'Execute Block'}
            </Button>
            
            {getStatusBadge(result.status)}
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result.status !== 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(result.status)}
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
                <div>
                  <h4 className="font-semibold mb-2">Execution Results</h4>
                  <div className="bg-green-50 border border-green-200 rounded p-3 text-sm">
                    <pre className="text-xs bg-background p-2 rounded overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </div>
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
