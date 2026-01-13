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

      {/* IMAGE CONTAINER (FIXED WHITE ISSUE) */}
     {/* IMAGE CONTAINER */}
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

        {/* BRAND */}
        <p className="text-xs uppercase text-slate-500 tracking-wide">
          Brand
        </p>

        {/* NAME */}
        <h3 className="line-clamp-2 font-semibold text-slate-900">
          {product.name}
        </h3>

        {/* RATING */}
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">4.3</span>
          <span className="text-slate-400">(1.2k)</span>
        </div>

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

        {/* ACTION */}
        <button
          disabled={stock <= 0}
          onClick={() => onAddToCart(product)}
          className={`mt-3 flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition
            ${
              stock > 0
                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                : "bg-slate-300 text-slate-500 cursor-not-allowed"
            }
          `}
        >
          <ShoppingCart className="h-4 w-4" />
          {stock > 0 ? "Add to Cart" : "Out of Stock"}
        </button>

      </div>
    </div>
  );
}
