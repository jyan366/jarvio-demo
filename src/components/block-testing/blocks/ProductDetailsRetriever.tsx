
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Play, CheckCircle, XCircle, ShoppingBag, ExternalLink, Star, Truck, Package, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExecutionResult {
  status: 'idle' | 'running' | 'success' | 'error';
  data?: any;
  error?: string;
  executionTime?: number;
  timestamp?: string;
}

interface ProductPage {
  price?: string;
  title?: string;
  benefits?: string;
  currency?: string;
  has_video?: boolean;
  variations?: string;
  description?: string;
  shipping_cost?: string;
  number_of_images?: number;
  ingredients_or_materials?: string;
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

  const parseMarkdownTable = (markdownTable: string) => {
    const lines = markdownTable.trim().split('\n');
    if (lines.length < 3) return [];

    const dataLines = lines.slice(2);
    
    return dataLines.map(line => {
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      return {
        name: cells[0] || '',
        link: cells[1] || ''
      };
    }).filter(product => product.name && product.link);
  };

  const renderEcommerceProductDetails = (productPage: ProductPage) => {
    if (!productPage || typeof productPage !== 'object') return null;

    return (
      <div className="max-w-6xl mx-auto bg-white">
        {/* Product Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Product Image Placeholder */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border">
              <Package className="h-20 w-20 text-gray-400" />
            </div>
            {productPage.number_of_images && (
              <p className="text-sm text-gray-600 text-center">
                {productPage.number_of_images} images available
              </p>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {productPage.title || 'Product Title'}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(Based on reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {productPage.price || 'Price not available'}
                </span>
                {productPage.currency && (
                  <Badge variant="secondary" className="text-xs">
                    {productPage.currency}
                  </Badge>
                )}
              </div>
              {productPage.shipping_cost && (
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Truck className="h-4 w-4" />
                  <span>Shipping: {productPage.shipping_cost}</span>
                </div>
              )}
            </div>

            {/* Variations */}
            {productPage.variations && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Available Sizes:</Label>
                <div className="flex flex-wrap gap-2">
                  {productPage.variations.split(',').map((variation, index) => (
                    <Badge key={index} variant="outline" className="px-3 py-1">
                      {variation.trim()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg">
                Add to Cart
              </Button>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Save for Later
                </Button>
                <Button variant="outline" className="flex-1">
                  Share Product
                </Button>
              </div>
            </div>

            {/* Key Features */}
            {productPage.has_video !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <Badge variant={productPage.has_video ? "success" : "secondary"}>
                  {productPage.has_video ? "✓ Video Available" : "No Video"}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="space-y-6">
          {/* Benefits Section */}
          {productPage.benefits && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Key Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{productPage.benefits}</p>
              </CardContent>
            </Card>
          )}

          {/* Description */}
          {productPage.description && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Product Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {productPage.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Ingredients/Materials */}
          {productPage.ingredients_or_materials && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{productPage.ingredients_or_materials}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  };

  const renderOtherProductsTable = (otherProducts: string) => {
    if (!otherProducts || typeof otherProducts !== 'string') return null;

    const products = parseMarkdownTable(otherProducts);
    if (products.length === 0) return null;

    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl">More Products from This Brand</CardTitle>
          <CardDescription>
            Discover other products you might like
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Product Name</TableHead>
                  <TableHead className="font-semibold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.slice(0, 10).map((product, index) => (
                  <TableRow key={index} className="hover:bg-gray-50">
                    <TableCell className="font-medium py-3">
                      {product.name}
                    </TableCell>
                    <TableCell className="py-3">
                      <a
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline text-sm"
                      >
                        View Product
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {products.length > 10 && (
              <div className="p-4 bg-gray-50 border-t text-center">
                <p className="text-sm text-gray-600">
                  And {products.length - 10} more products...
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderResults = (data: any) => {
    if (!data) return null;

    const responseArray = Array.isArray(data) ? data : [data];
    const firstItem = responseArray[0];

    if (!firstItem) return null;

    const productPage = firstItem.productpage;
    const otherProducts = firstItem.otherproducts;

    return (
      <div className="space-y-6">
        {productPage && renderEcommerceProductDetails(productPage)}
        {otherProducts && renderOtherProductsTable(otherProducts)}
        
        {(!productPage && !otherProducts) && (
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
        <div>
          {result.status === 'success' && result.data ? (
            renderResults(result.data)
          ) : result.status === 'error' ? (
            <Card>
              <CardContent className="p-6">
                <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Request Failed</h4>
                  <p className="text-red-700 text-sm">{result.error}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
