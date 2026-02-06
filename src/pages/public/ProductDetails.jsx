import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../api/products.api";
import { addToCartApi } from "../../api/cart.api";
import {
  ChevronLeft, ShoppingCart, Star, Heart, Search,
  Package, User, Share2, ChevronRight, Truck, Shield, RefreshCw, Plus, Minus
} from "lucide-react";

import api from "../../api/axios";          // ✅ ADD THIS
import { useCart } from "../../context/CartContext"; // ✅ already there



export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCartFromApi } = useCart();



  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);
const [showToast, setShowToast] = useState(false);

const hasImages = product?.images?.length > 0;

const nextImage = () => {
  if (!hasImages) return;
  setSelectedImage((prev) =>
    prev === product.images.length - 1 ? 0 : prev + 1
  );
};

const prevImage = () => {
  if (!hasImages) return;
  setSelectedImage((prev) =>
    prev === 0 ? product.images.length - 1 : prev - 1
  );
};


  useEffect(() => {
  const loadProduct = async () => {
    try {
      const res = await getProductById(id);

      // ✅ Build image array (primary first)
      const images = res.data.imageUrls?.length
        ? res.data.imageUrls
        : res.data.primaryImageUrl
          ? [res.data.primaryImageUrl]
          : [];

      const mappedProduct = {
        id: res.data.productId,
        name: res.data.name,
        category: res.data.categoryName,
        description: res.data.description,

        // ✅ MULTI IMAGE SUPPORT
        images,
        primaryImage: res.data.primaryImageUrl,

        // ✅ SAFE VARIANT MAP
        variants: (res.data.sizes || []).map(s => ({
          id: s.variantId,
          size: s.size,
          price: s.price,
          stock: s.availableStock
        }))
      };

      setProduct(mappedProduct);

      // ✅ RESET IMAGE + VARIANT SAFELY
      setSelectedImage(0);
      setSelectedVariant(mappedProduct.variants[0] || null);

    } catch (err) {
      console.error("Failed to load product", err);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  loadProduct();
}, [id]);

const handleAddToCart = async () => {
  if (!selectedVariant) return;


  try {
    setAddingToCart(true);

    // 1️⃣ Add/update cart in backend
    await addToCartApi(selectedVariant.id, quantity);

    // 2️⃣ Re-sync cart count from backend (DISTINCT items)
    const res = await api.get("/cart");
    setCartFromApi(res.data.length || 0);

    // UI only
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
    setQuantity(1);
  } catch (err) {
    console.error("Failed to add to cart:", err);
  } finally {
    setAddingToCart(false);
  }
};


  const MAX_QTY = 1000;

const increaseQuantity = () => {
  if (quantity < MAX_QTY) {
    setQuantity(prev => prev + 1);
  }
};

const decreaseQuantity = () => {
  if (quantity > 1) {
    setQuantity(prev => prev - 1);
  }
};


  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-3 border-teal-600 border-t-transparent mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product || !selectedVariant) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-white">
        <div className="text-5xl mb-3">😕</div>
        <p className="text-lg text-gray-700 font-medium">Product not found</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 px-6 py-2.5 bg-teal-600 text-white rounded font-bold text-sm hover:bg-teal-700"
        >
          Back to Products
        </button>
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gray-50">
      

      {/* BREADCRUMB */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex items-center gap-1 px-4 py-2.5 max-w-screen-2xl mx-auto text-xs text-gray-600">
          <span onClick={() => navigate("/products")} className="hover:text-gray-900 cursor-pointer">Home</span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="hover:text-gray-900 cursor-pointer">{product.category}</span>
          <ChevronRight size={12} className="text-gray-400" />
          <span className="text-gray-900 truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      {/* PRODUCT CONTENT */}
      <div className="max-w-screen-2xl mx-auto flex bg-white my-4 shadow-sm">
        {showToast && (
        <div className="fixed top-20 right-6 z-[99999] bg-teal-600 text-white px-5 py-2.5 rounded-md shadow-lg font-medium text-sm">
          ✓ {quantity} item(s) added to bag
        </div>
      )}
        {/* LEFT: IMAGES */}
        <div className="w-1/3 p-4 border-r border-gray-100">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
 <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white group">
  
  {/* LEFT ARROW */}
  {product.images.length > 1 && (
    <button
      onClick={prevImage}
      className="absolute left-3 top-1/2 -translate-y-1/2 z-20 
                 bg-white/80 hover:bg-white shadow rounded-full p-2
                 transition opacity-0 group-hover:opacity-100"
    >
      <ChevronLeft size={22} />
    </button>
  )}

  {/* IMAGE WITH ZOOM */}
  <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-white h-[550px] w-full">

  {/* TRACK */}
  <div
    className="flex h-full transition-transform ease-in-out"
    style={{
      transform: `translateX(-${selectedImage * 100}%)`,
      transitionDuration: "700ms"
    }}
  >
    {product.images.map((img, index) => (
      <div
        key={index}
        className="h-full w-full flex-shrink-0 flex items-center justify-center"
      >
        <img
          src={img}
          alt={`${product.name} ${index + 1}`}
          className="h-full w-full object-contain"
        />
      </div>
    ))}
  </div>

  {/* LEFT */}
  
</div>


  {/* RIGHT ARROW */}
  {product.images.length > 1 && (
    <button
      onClick={nextImage}
      className="absolute right-3 top-1/2 -translate-y-1/2 z-20
                 bg-white/80 hover:bg-white shadow rounded-full p-2
                 transition opacity-0 group-hover:opacity-100"
    >
      <ChevronRight size={22} />
    </button>
  )}
</div>


</div>
<div className="flex gap-3 p-3 justify-center bg-white ">
  {product.images.map((img, index) => (
    <button
      key={index}
      onClick={() => setSelectedImage(index)}
      className={`w-20 h-20 border rounded-md overflow-hidden transition ${
        selectedImage === index
          ? "border-teal-600 ring-2 ring-teal-500"
          : "border-gray-300 hover:border-teal-400"
      }`}
    >
      <img
        src={img}
        alt={`thumb-${index}`}
        className="w-full h-full object-contain"
      />
    </button>
  ))}
</div>



        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div className="w-3/5 px-8 py-6 border-l border-gray-100">
          {/* Brand & Name */}
          <div className="mb-1">
            <h2 className="text-xl font-bold text-gray-900">{product.category}</h2>
            <h1 className="text-lg font-bold mt-1">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-5 pb-5 border-b border-gray-200">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-teal-600 text-white rounded text-xs font-bold">
              <span>4.8</span>
              <Star size={11} className="fill-white" />
            </div>
            
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-gray-900">₹{selectedVariant.price}</span>
             
            </div>
            <p className="text-sm font-semibold text-teal-700">inclusive of all taxes</p>
          </div>
          

          {/* Select Size */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase">Select Size</h3>
              
            </div>
            
            <div className="flex gap-3">
              {product.variants.map(v => (
                <button
                  key={v.id}
                  disabled={false}
                  onClick={() => {
                    setSelectedVariant(v);
                    setQuantity(1); // Reset quantity when size changes
                  }}
                  className={`w-14 h-14 rounded-full border-2 font-bold text-sm transition ${
  selectedVariant.id === v.id
    ? "border-teal-600 text-teal-600 bg-teal-50"
    : "border-gray-300 text-gray-900 hover:border-teal-400"
}`}

                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase mb-3">Quantity</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center border-2 border-gray-300 rounded-md">
                <button
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Minus size={16} className="text-gray-700" />
                </button>
                <span className="px-6 font-bold text-gray-900 text-base min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  disabled={quantity >= MAX_QTY}

                  className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Plus size={16} className="text-gray-700" />
                </button>
              </div>
              
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
  disabled={addingToCart}
  onClick={handleAddToCart}
  className={`flex-1 py-3.5 rounded-md font-bold text-sm transition shadow-sm ${
    addingToCart
      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
      : "bg-teal-600 text-white hover:bg-teal-700"
  }`}
>
  <ShoppingCart size={18} className="inline mr-2 mb-0.5" />
  {addingToCart ? "ADDING..." : "ADD TO BAG"}
</button>


            <button className="px-5 py-3.5 border-2 border-gray-300 rounded-md hover:border-teal-400 hover:bg-teal-50 transition group">
              <Heart size={18} className="text-gray-700 group-hover:text-teal-600" />
            </button>
          </div>

        

   

          {/* Product Details */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Product Details</h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-2 mb-4">
  {(product.description || "")
    .split("\n")
    .filter(line => line.trim() !== "")
    .map((line, index) => (
      <li key={index}>{line}</li>
    ))}
</ul>

            <div className="bg-gray-50 rounded-md p-4 space-y-2">
              <div className="flex text-sm">
                <span className="w-28 text-gray-600 font-medium">Category:</span>
                <span className="text-gray-900">{product.category}</span>
              </div>
              <div className="flex text-sm">
                <span className="w-28 text-gray-600 font-medium">Material:</span>
                <span className="text-gray-900">Premium Quality</span>
              </div>
              <div className="flex text-sm">
                <span className="w-28 text-gray-600 font-medium">Warranty:</span>
                <span className="text-gray-900">1 Year Manufacturer</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    
  );
}