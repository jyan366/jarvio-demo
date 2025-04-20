
import React from "react";

interface Product {
  image: string;
  name: string;
  asin: string;
  sku: string;
  price: string;
  units: string;
  last30Sales: string;
  last30Units: string;
}

export const TaskWorkProductCard: React.FC<{ product: Product }> = ({
  product,
}) => {
  if (!product) return null;

  return (
    <div className="mb-2 mt-2 transition border rounded-2xl p-3 pl-4 flex flex-col md:flex-row gap-4 bg-[#F7F7FC]">
      <img
        src={product.image}
        alt={product.name}
        className="w-16 h-16 object-cover rounded"
      />
      <div className="flex-1 flex flex-col md:flex-row gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate max-w-xs mb-0.5">{product.name}</p>
          <p className="text-xs text-gray-500 flex gap-2">
            ASIN: {product.asin} <span>•</span> SKU: {product.sku}
          </p>
        </div>
        <div className="flex flex-wrap gap-7 md:gap-12 mt-2 md:mt-0">
          <div>
            <span className="block uppercase text-gray-400 text-[10px] mb-1 tracking-wide">Price</span>
            <span className="font-bold text-[15px]">£{product.price}</span>
          </div>
          <div>
            <span className="block uppercase text-gray-400 text-[10px] mb-1 tracking-wide">Available Units</span>
            <span className="font-bold text-[15px]">{product.units}</span>
          </div>
          <div>
            <span className="block uppercase text-gray-400 text-[10px] mb-1 tracking-wide">Last 30D Sales</span>
            <span className="font-bold text-[15px]">{product.last30Sales}</span>
            <span className="block text-xs text-gray-500 font-medium">
              Last 30D Units Sold: {product.last30Units}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
