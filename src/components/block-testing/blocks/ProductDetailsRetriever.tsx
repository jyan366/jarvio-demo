import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Play, CheckCircle, XCircle, ShoppingBag, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExecutionResult {
  status: 'idle' | 'running' | 'success' | 'error';
  data?: any;
  error?: string;
  executionTime?: number;
  timestamp?: string;
}

interface ProductDetails {
  name?: string;
  price?: string;
  description?: string;
  image?: string;
  availability?: string;
  brand?: string;
  [key: string]: any;
}

interface OtherProduct {
  name: string;
  link: string;
  price?: string;
  [key: string]: any;
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
        // Fix: Only read the response once
        const responseData = await response.json();
        console.log('Response data:', responseData);
        
        setResult({
          status: 'success',
          data: responseData,
          executionTime,
          timestamp: new Date().toISOString(),
        });

        toast({
          title: "Request Completed!",
          description: `Received response in ${executionTime}ms`,
        });
      } else {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
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
        title: "Request Failed",
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
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Processing...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Ready</Badge>;
    }
  };

  const renderProductDetails = (productData: ProductDetails) => {
    if (!productData || typeof productData !== 'object') return null;

    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-lg text-gray-900">Product Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(productData).map(([key, value]) => (
            <div key={key} className="bg-gray-50 rounded-lg p-3 border">
              <dt className="font-medium text-gray-600 capitalize text-sm">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </dt>
              <dd className="text-gray-900 mt-1">
                {typeof value === 'string' ? value : JSON.stringify(value)}
              </dd>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOtherProductsTable = (otherProducts: OtherProduct[]) => {
    if (!Array.isArray(otherProducts) || otherProducts.length === 0) return null;

    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-lg text-gray-900">Other Products from Brand</h4>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otherProducts.map((product, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{product.name || 'N/A'}</TableCell>
                  <TableCell>{product.price || 'N/A'}</TableCell>
                  <TableCell>
                    {product.link ? (
                      <a
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
                      >
                        View Product
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  const renderResults = (data: any) => {
    if (!data) return null;

    // Handle different possible response structures
    const productDetails = data.productDetails || data.product || data.productpage || null;
    const otherProducts = data.otherProducts || data.relatedProducts || data.otherproducts || null;

    return (
      <div className="space-y-6">
        {/* Product Details Section */}
        {productDetails && renderProductDetails(productDetails)}
        
        {/* Other Products Table */}
        {otherProducts && renderOtherProductsTable(otherProducts)}
        
        {/* Raw Data Fallback */}
        {(!productDetails && !otherProducts) && (
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900">Raw Response Data</h4>
            <div className="bg-gray-50 rounded-lg p-4 border">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </div>
        )}
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
              {result.status === 'running' ? 'Processing...' : 'Extract Details'}
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
              renderResults(result.data)
            ) : result.status === 'error' ? (
              <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Request Failed</h4>
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
