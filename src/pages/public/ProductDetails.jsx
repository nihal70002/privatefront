import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../api/products.api";
import { addToCartApi } from "../../api/cart.api";
import {
  ChevronLeft, ShoppingCart, Star, Heart, 
  ChevronRight, Heart as HeartIcon, Share2, 
  Plus, Minus, Info
} from "lucide-react";

import api from "../../api/axios";
import { useCart } from "../../context/CartContext";

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

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await getProductById(id);
        const images = res.data.imageUrls?.length
          ? res.data.imageUrls
          : res.data.primaryImageUrl ? [res.data.primaryImageUrl] : [];

        const mappedProduct = {
          id: res.data.productId,
          name: res.data.name,
          category: res.data.categoryName,
          description: res.data.description,
          images,
          variants: (res.data.sizes || []).map(v => ({
            id: v.variantId,
            class: v.class,
            style: v.style,
            material: v.material,
            color: v.color,
            size: v.size,
            price: v.price,
            stock: v.availableStock
          }))
        };

        setProduct(mappedProduct);
        if (mappedProduct.variants.length > 0) {
          const first = mappedProduct.variants[0];
          setSelectedClass(first.class || null);
          setSelectedStyle(first.style || null);
          setSelectedVariant(first);
        }
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const getUniqueValues = (key) => [...new Set(product?.variants?.map(v => v[key]).filter(Boolean))];
  const classOptions = getUniqueValues("class");

  const filteredVariants = product?.variants?.filter(v =>
    (!selectedClass || v.class === selectedClass) &&
    (!selectedStyle || v.style === selectedStyle)
  ) || [];

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    try {
      setAddingToCart(true);
      await addToCartApi(selectedVariant.id, quantity);
      const res = await api.get("/cart");
      setCartFromApi(res.data.length || 0);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center bg-white">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
    </div>
  );

  if (!product) return <div className="p-20 text-center">Product not found</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-6 z-[100] bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <div className="bg-teal-500 rounded-full p-1"><ShoppingCart size={14}/></div>
          <span className="text-sm font-bold">Added to bag successfully!</span>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row">
        
        {/* IMAGE SECTION - Takes full width on mobile, scrolls naturally */}
        <div className="w-full lg:w-[60%] lg:p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Desktop Thumbnails */}
            <div className="hidden lg:flex flex-col gap-3 w-16">
              {product.images.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  onMouseEnter={() => setSelectedImage(i)}
                  className={`w-full aspect-[3/4] object-cover cursor-pointer border transition ${selectedImage === i ? 'border-teal-600' : 'border-transparent'}`}
                />
              ))}
            </div>

            {/* Main Image - Mobile shows first, then user scrolls down to info */}
            <div className="relative flex-1 bg-gray-50 aspect-[3/4] overflow-hidden">
              <img 
                src={product.images[selectedImage]} 
                className="w-full h-full object-cover" 
                alt="Product"
              />
              <div className="absolute bottom-4 left-4">
                 <div className="flex items-center gap-1 px-2 py-0.5 bg-white/90 rounded text-xs font-bold shadow-sm">
                   4.4 <Star size={12} className="fill-teal-600 text-teal-600" /> | 256
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* INFO SECTION - Follows the image on mobile */}
        <div className="w-full lg:w-[40%] p-4 lg:p-8">
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 leading-tight uppercase tracking-tight">{product.name}</h1>
            <p className="text-gray-500 text-md">{product.category}</p>
          </div>

          <div className="mb-6 flex items-baseline gap-2">
            <span className="text-2xl font-bold">₹{selectedVariant?.price}</span>
            <span className="text-gray-400 line-through text-sm">MRP ₹{selectedVariant?.price + 500}</span>
            <span className="text-orange-500 font-bold text-sm">(33% OFF)</span>
          </div>

          <hr className="mb-6 border-gray-100" />

          {/* SIZE SELECTION - Aligned as per Myntra reference */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wide">Select Size</h3>
              <button className="text-pink-600 text-xs font-bold flex items-center gap-1">
                Size Chart <ChevronRight size={14} />
              </button>
            </div>
            
            <div className="flex gap-3 flex-wrap">
              {filteredVariants.map(v => (
                <button 
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`w-14 h-14 flex items-center justify-center rounded-full border text-sm font-bold transition ${selectedVariant?.id === v.id ? 'border-pink-600 text-pink-600 bg-pink-50' : 'border-gray-200 hover:border-gray-400'}`}
                >
                  {v.size}
                </button>
              ))}
            </div>
          </div>

          {/* ACTION BUTTONS - Fixed at bottom for mobile to match reference alignment */}
          <div className="flex gap-3 mt-10 sticky bottom-0 bg-white py-4 border-t lg:static lg:border-none lg:p-0">
            <button className="flex-1 h-14 border border-gray-300 rounded-md flex items-center justify-center gap-2 font-bold text-sm hover:border-gray-900 transition">
              <HeartIcon size={18} /> WISHLIST
            </button>
            <button 
              disabled={addingToCart}
              onClick={handleAddToCart}
              className="flex-[1.5] bg-[#ff3e6c] text-white h-14 rounded-md font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#e73961] transition"
            >
              <ShoppingCart size={18} />
              {addingToCart ? "ADDING..." : "ADD TO BAG"}
            </button>
          </div>

          {/* CHECK DELIVERY BOX */}
          <div className="mt-10 p-4 border border-gray-100 rounded-lg">
             <h3 className="text-sm font-bold uppercase mb-4">Check Delivery</h3>
             <div className="flex border border-gray-200 rounded-md overflow-hidden">
               <input type="text" placeholder="Enter PIN Code" className="flex-1 px-4 py-2 text-sm focus:outline-none" />
               <button className="px-4 text-pink-600 font-bold text-xs uppercase border-l border-gray-200">Check</button>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}