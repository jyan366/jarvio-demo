
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, CheckCircle, XCircle, ShoppingBag, DollarSign, Package, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExecutionResult {
  status: 'idle' | 'running' | 'success' | 'error';
  data?: any;
  error?: string;
  executionTime?: number;
  timestamp?: string;
}

const N8N_WEBHOOK_URL = 'https://jarvio.app.n8n.cloud/webhook-test/698a75e6-643c-496e-9a84-31543b7d9573';

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
      console.log('Triggering n8n workflow with URL:', url);
      
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          url: url,
          action: 'extract_product_details',
          blockType: 'collect',
          blockName: 'Retrieve Product Details from Website',
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
          title: "Product Details Extracted!",
          description: `Successfully analyzed product in ${executionTime}ms`,
        });
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Error triggering workflow:', error);
      const executionTime = Date.now() - startTime;
      
      setResult({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime,
        timestamp: new Date().toISOString(),
      });

      toast({
        title: "Extraction Failed",
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
        return <ShoppingBag className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: ExecutionResult['status']) => {
    switch (status) {
      case 'running':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Analyzing...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Ready</Badge>;
    }
  };

  const renderProductDetails = (data: any) => {
    if (!data || !data.data) return null;
    
    const product = data.data;
    
    return (
      <div className="space-y-6">
        {/* Product Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">{product.price}</span>
                  {product.currency && (
                    <span className="text-sm text-gray-500">({product.currency})</span>
                  )}
                </div>
                {product.has_video && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    Video Available
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Description */}
          {product.description && (
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {product.benefits && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Health Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{product.benefits}</p>
              </CardContent>
            </Card>
          )}

          {/* Ingredients */}
          {product.ingredients_or_materials && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-500" />
                  Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{product.ingredients_or_materials}</p>
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{product.number_of_images || 0}</div>
                  <div className="text-sm text-gray-600">Images</div>
                </div>
                
                {product.shipping_cost && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">{product.shipping_cost}</div>
                    <div className="text-sm text-gray-600">Shipping</div>
                  </div>
                )}
                
                {product.variations && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-lg font-semibold text-gray-900">Available</div>
                    <div className="text-sm text-gray-600">Variations</div>
                  </div>
                )}
                
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-lg font-semibold text-gray-900">{data.status}</div>
                  <div className="text-sm text-gray-600">Status</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <ShoppingBag className="h-6 w-6 text-blue-600" />
            Product Details Extractor
          </CardTitle>
          <CardDescription>
            Enter any product URL to extract detailed information using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-url" className="text-sm font-medium">Product URL</Label>
            <Input
              id="product-url"
              type="url"
              placeholder="https://example.com/product/amazing-product"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={result.status === 'running'}
              className="text-sm"
            />
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <Button 
              onClick={executeBlock} 
              disabled={result.status === 'running' || !url.trim()}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              {getStatusIcon(result.status)}
              {result.status === 'running' ? 'Extracting Details...' : 'Extract Product Details'}
            </Button>
            
            <div className="flex items-center gap-2">
              {getStatusBadge(result.status)}
              {result.executionTime && (
                <span className="text-xs text-gray-500">
                  {result.executionTime}ms
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result.status !== 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(result.status)}
              Extraction Results
            </CardTitle>
            <CardDescription>
              {result.timestamp && (
                <>
                  Completed at {new Date(result.timestamp).toLocaleString()}
                  {result.executionTime && ` • ${result.executionTime}ms`}
                </>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {result.status === 'success' && result.data ? (
              renderProductDetails(result.data)
            ) : result.status === 'error' ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Extraction Failed</h4>
                <p className="text-red-700 text-sm">{result.error}</p>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
