import React from "react";
import { ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product, onAddToCart }) {
  const navigate = useNavigate();

  const variant = product?.variants?.[0];
  const price = variant?.price || 0;
  const stock = variant?.stock || 0;

  const handleView = () => {
    navigate(`/products/${product.productId}`);
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
      
      {/* IMAGE (UNCHANGED) */}
      <div
  onClick={handleView}
  className="relative h-64 w-full cursor-pointer rounded-t-2xl 
             bg-white flex items-center justify-center overflow-hidden
             transition"
>

        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-full w-full object-contain 
                     p-2 scale-110 
                     transition-transform duration-300 
                     group-hover:scale-125"
        />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col gap-1.5 p-3">

        {/* BRAND */}
        {product.brandName && (
          <p className="text-[10px] font-bold text-slate-600 tracking-wide uppercase">
            {product.brandName}
          </p>
        )}

        {/* PRODUCT NAME */}
        <h3 className="line-clamp-2 text-sm font-semibold text-slate-900 leading-snug">
          {product.name}
        </h3>

        {/* PRICE */}
        <div className="flex items-center gap-1.5">
          <span className="text-base font-bold text-slate-900">
            ₹{price}
          </span>

          
        </div>

      </div>
    </div>
  );
}
