import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react"; // Import for the wishlist icon

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  // Safeguard for nested data
  const variant = product?.variants?.[0];
  const price = variant?.price || 0;
  const originalPrice = Math.round(price * 1.5); // Mocked original price for the "Myntra" look

  return (
    <div 
      onClick={() => navigate(`/products/${product.productId}`)}
      className="group flex flex-col bg-white overflow-hidden cursor-pointer relative"
    >
      {/* IMAGE SECTION - 3:4 Aspect Ratio is standard for fashion */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
        <img
          src={product?.primaryImageUrl || "/no-image.png"}
          alt={product?.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Rating Badge - Matches the white pill style in your screenshot */}
        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-sm flex items-center gap-1 text-[10px] font-bold text-gray-800 border border-gray-100 shadow-sm">
           4.2 <span className="text-teal-600 text-[8px]">★</span>
           <span className="text-gray-400 font-normal border-l border-gray-300 pl-1">628</span>
        </div>

        {/* Wishlist Icon - Hidden on mobile usually, or top right */}
        <button className="absolute top-2 right-2 p-1.5 rounded-full bg-white/20 hover:bg-white transition-colors lg:opacity-0 lg:group-hover:opacity-100">
           <Heart size={16} className="text-gray-600" />
        </button>
      </div>

      {/* CONTENT SECTION */}
      <div className="p-2.5 space-y-0.5">
        {/* Brand Name - Bold and slightly larger */}
        <h3 className="text-[14px] font-bold text-gray-900 truncate tracking-tight">
          {product?.brandName || "Brand Name"}
        </h3>

        {/* Product Name - Soft gray and smaller */}
        <p className="text-[12px] text-gray-500 truncate leading-tight font-light">
          {product?.name}
        </p>

        {/* Price Row */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[13px] font-bold text-gray-900">₹{price}</span>
          <span className="text-[11px] text-gray-400 line-through">₹{originalPrice}</span>
          <span className="text-[11px] text-orange-500 font-bold">(50% OFF)</span>
        </div>
        
        {/* Extra Info - Only visible on Myntra for specific items */}
        <p className="text-[10px] text-gray-400 mt-1">
          Delivery by Feb 21
        </p>
      </div>
    </div>
  );
}