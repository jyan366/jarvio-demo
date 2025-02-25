
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { ProductItem } from '@/types/sales';

interface ProductsTableProps {
  products: ProductItem[];
}

export const ProductsTable: React.FC<ProductsTableProps> = ({ products }) => {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>ASIN</TableHead>
              <TableHead>Units Sold</TableHead>
              <TableHead>Total Sales</TableHead>
              <TableHead>Total Costs</TableHead>
              <TableHead>Avg Price</TableHead>
              <TableHead>Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="w-16 h-16 flex items-center justify-center bg-muted rounded-md overflow-hidden">
                    <img 
                      src={product.image || "https://aojrdgobdavxjpnymskc.supabase.co/storage/v1/object/public/product-images//411tW589v5L.jpg"} 
                      alt={product.name}
                      className="w-full h-full object-contain" 
                    />
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px] md:max-w-[300px]">{product.name}</TableCell>
                <TableCell>{product.asin}</TableCell>
                <TableCell>{product.unitsSold}</TableCell>
                <TableCell>{product.totalSales}</TableCell>
                <TableCell>{product.totalCosts}</TableCell>
                <TableCell>{product.avgPrice}</TableCell>
                <TableCell>{product.profit}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};
