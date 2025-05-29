import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Loader2, Play, CheckCircle, XCircle, ShoppingBag, ExternalLink } from 'lucide-react';
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

const N8N_WEBHOOK_URL = 'https://jarvio.app.n8n.cloud/webhook/698a75e6-643c-496e-9a84-31543b7d9573';

export function ProductDetailsRetriever() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ExecutionResult>({ status: 'idle' });
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const ITEMS_PER_PAGE = 15;

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

    // Skip header and separator lines
    const dataLines = lines.slice(2);
    
    return dataLines.map(line => {
      const cells = line.split('|').map(cell => cell.trim()).filter(cell => cell);
      return {
        name: cells[0] || '',
        link: cells[1] || ''
      };
    }).filter(product => product.name && product.link);
  };

  const formatFieldName = (key: string) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/_/g, ' ')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  const formatFieldValue = (value: any) => {
    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }
    if (typeof value === 'string') {
      return value;
    }
    return JSON.stringify(value);
  };

  const renderProductDetails = (productPage: ProductPage) => {
    if (!productPage || typeof productPage !== 'object') return null;

    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-lg text-gray-900">Product Information</h4>
        <div className="space-y-3">
          {Object.entries(productPage).map(([key, value]) => (
            <div key={key} className="flex items-start space-x-4 py-2 border-b border-gray-100 last:border-b-0">
              <dt className="font-medium text-gray-600 min-w-[140px] text-sm">
                {formatFieldName(key)}:
              </dt>
              <dd className="text-gray-900 flex-1">
                {formatFieldValue(value)}
              </dd>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderOtherProductsTable = (otherProducts: string) => {
    if (!otherProducts || typeof otherProducts !== 'string') return null;

    const products = parseMarkdownTable(otherProducts);
    if (products.length === 0) return null;

    // Calculate pagination
    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentProducts = products.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
      setCurrentPage(page);
    };

    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-lg text-gray-900">
          {products.length} Other Products found from this Brand
        </h4>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Link</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProducts.map((product, index) => (
                <TableRow key={startIndex + index}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <a
                      href={product.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 underline"
                    >
                      View Product
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {totalPages > 1 && (
          <Pagination className="justify-center">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                  className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    );
  };

  const renderResults = (data: any) => {
    if (!data) return null;

    // Handle array response format
    const responseArray = Array.isArray(data) ? data : [data];
    const firstItem = responseArray[0];

    if (!firstItem) return null;

    const productPage = firstItem.productpage;
    const otherProducts = firstItem.otherproducts;

    return (
      <div className="space-y-6">
        {/* Product Details Section */}
        {productPage && renderProductDetails(productPage)}
        
        {/* Other Products Table */}
        {otherProducts && renderOtherProductsTable(otherProducts)}
        
        {/* Raw Data Fallback */}
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
