import { useNavigate, useLocation } from "react-router-dom";


export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Safeguard for nested data
  const variant = product?.variants?.[0];
  const price = variant?.price || 0;
  const originalPrice = Math.round(price * 1.5); // Mocked original price for the "Myntra" look

  return (
    <div 
      onClick={() => {
  sessionStorage.setItem("productsScrollY", window.scrollY);
  navigate(`/products/${product.productId}${location.search}`);
}}
      className="group flex flex-col bg-white overflow-hidden cursor-pointer relative"
    >
      {/* IMAGE SECTION - 3:4 Aspect Ratio is standard for fashion */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product?.primaryImageUrl || "/no-image.png"}
         alt={
  (localStorage.getItem("lang") === "ar" && product?.nameArabic)
    ? product.nameArabic
    : product?.name
}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Rating Badge - Matches the white pill style in your screenshot */}
       

        {/* Wishlist Icon - Hidden on mobile usually, or top right */}
        
      </div>

      {/* CONTENT SECTION */}
      <div className="p-2.5 space-y-0.5">
        {/* Brand Name - Bold and slightly larger */}
       <h3 className="text-[12px] text-gray-500 truncate leading-tight font-light">
  {product?.brandName || "Brand Name"}
</h3>

        {/* Product Name - Soft gray and smaller */}
       <p className="text-[12px] font-semibold text-gray-800 truncate leading-tight">
  {(localStorage.getItem("lang") === "ar" && product?.nameArabic)
    ? product.nameArabic
    : product?.name}
</p>

        {/* Price Row */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-sm font-semibold text-emerald-600">SAR {price}</span>
         
         
        </div>
        
        {/* Extra Info - Only visible on Myntra for specific items */}
       
      </div>
    </div>
  );
}