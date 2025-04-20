
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

  // Use the kimchi jar image if a generic or broken product image is set
  const kimchiJarImg = "/lovable-uploads/98f7d2f8-e54c-46c1-bc30-7cea0a73ca70.png";
  const imgSrc =
    product.image && product.image !== ""
      ? product.image
      : kimchiJarImg;

  return (
    <div className="mb-3 mt-2 w-full bg-[#F7F7FC] rounded-2xl p-4 flex flex-col sm:flex-row gap-6 items-center shadow-[0px_1px_6px_rgba(31,27,137,0.07)]">
      {/* Responsive product image, prominent */}
      <div className="flex-shrink-0">
        <img
          src={imgSrc}
          alt={product.name}
          className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl bg-white border border-gray-200 shadow-sm"
          style={{ background: "#fff" }}
        />
      </div>
      <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate max-w-xs mb-1 text-lg text-zinc-800">{product.name}</p>
          <div className="text-xs text-gray-500 flex gap-2">
            <span>ASIN: {product.asin}</span>
            <span className="mx-1 text-gray-300">|</span>
            <span>SKU: {product.sku}</span>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col md:flex-row gap-5 md:gap-10 mt-2 md:mt-0 w-full md:w-auto justify-center">
          <div>
            <span className="block uppercase text-gray-400 text-[10px] mb-1 tracking-wide">Price</span>
            <span className="font-bold text-lg">£{product.price}</span>
          </div>
          <div>
            <span className="block uppercase text-gray-400 text-[10px] mb-1 tracking-wide">Available Units</span>
            <span className="font-bold text-lg">{product.units}</span>
          </div>
          <div>
            <span className="block uppercase text-gray-400 text-[10px] mb-1 tracking-wide">Last 30D Sales</span>
            <span className="font-bold text-lg">{product.last30Sales}</span>
            <span className="block text-xs text-gray-500 font-medium">
              Last 30D Units Sold: {product.last30Units}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
