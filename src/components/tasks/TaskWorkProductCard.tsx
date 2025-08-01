
import React from "react";

// Use the uploaded kimchi image
const KIMCHI_IMAGE_URL = "/lovable-uploads/6194ca4c-9763-4396-806a-742978abbe74.png";

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

  // Force use of the kimchi image instead of checking product.image
  const imgSrc = KIMCHI_IMAGE_URL;

  return (
    <div className="bg-[#F7F7FC] border border-[#EEE] rounded-xl p-3 flex flex-col md:flex-row gap-4 items-center shadow-none min-h-[90px]">
      {/* Product photo */}
      <div className="flex-shrink-0 flex items-center justify-center min-w-[60px]">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-16 h-16 object-cover rounded bg-white border border-gray-200"
          style={{ background: "#fff" }}
          draggable={false}
        />
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-3 md:gap-6 w-full items-center md:items-stretch">
        <div className="flex-1 min-w-0 self-center md:self-auto max-w-full">
          {/* Added max-w-full and used line-clamp-2 for product name */}
          <p className="font-semibold mb-1 text-base md:text-lg text-zinc-800 line-clamp-2 break-words">
            {product.name}
          </p>
          <div className="text-xs text-gray-500 flex flex-wrap gap-2">
            <span>ASIN: {product.asin}</span>
            <span className="mx-1 text-gray-300">•</span>
            <span>SKU: {product.sku}</span>
          </div>
        </div>
        {/* Made stats more responsive with better flex behavior */}
        <div className="flex flex-row flex-wrap md:flex-nowrap justify-between md:justify-end gap-4 md:gap-6 mt-1 md:mt-0 w-full md:w-auto">
          <div className="text-center md:text-left">
            <span className="block uppercase text-gray-400 text-[10px] mb-1 tracking-wide">Price</span>
            <span className="font-bold text-base md:text-lg">£{product.price}</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block uppercase text-gray-400 text-[10px] mb-1 tracking-wide">Available Units</span>
            <span className="font-bold text-base md:text-lg">{product.units}</span>
          </div>
          <div className="text-center md:text-left">
            <span className="block uppercase text-gray-400 text-[10px] mb-1 tracking-wide">Last 30D Sales</span>
            <span className="font-bold text-base md:text-lg">{product.last30Sales}</span>
            <span className="block text-xs text-gray-500 font-medium whitespace-nowrap">
              Last 30D Units Sold: {product.last30Units}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
