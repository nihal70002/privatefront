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
    <div className="group flex flex-col rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all duration-300">
      
      {/* IMAGE */}
      <div
        onClick={handleView}
        className="relative h-72 w-full cursor-pointer rounded-t-3xl 
                   bg-slate-100 flex items-center justify-center overflow-hidden
                   group-hover:bg-slate-200 transition"
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
      <div className="flex flex-col gap-2 p-4">

        {/* BRAND NAME */}
        {product.brandName && (
          <p className="text-xs font-bold text-slate-600 tracking-wide uppercase">
            {product.brandName}
          </p>
        )}

        {/* PRODUCT NAME */}
        <h3 className="line-clamp-2 font-semibold text-slate-900">
          {product.name}
        </h3>

        {/* PRICE */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-slate-900">
            ₹{price}
          </span>

          <span className="text-sm text-slate-400 line-through">
            ₹{price + 200}
          </span>

          <span className="text-sm font-medium text-emerald-600">
            50% OFF
          </span>
        </div>

      </div>
    </div>
  );
}
