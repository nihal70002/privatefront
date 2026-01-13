import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductById } from "../../api/products.api";
import { addToCartApi } from "../../api/cart.api";
import {
  ChevronLeft, ShoppingCart, Star, Heart, Search,
  Package, User, Share2, ChevronRight, Truck, Shield, RefreshCw, Plus, Minus
} from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await getProductById(id);

        const mappedProduct = {
          id: res.data.productId,
          name: res.data.name,
          category: res.data.categoryName,
          description: res.data.description,
          imageUrl: res.data.imageUrl,
          variants: res.data.sizes.map(s => ({
            id: s.variantId,
            size: s.size,
            price: s.price,
            stock: s.availableStock
          }))
        };

        setProduct(mappedProduct);
        setSelectedVariant(mappedProduct.variants[0]);
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
    if (!selectedVariant || selectedVariant.stock === 0) {
      alert("Please select an available size");
      return;
    }

    try {
      setAddingToCart(true);
      // API: POST /api/cart/add with { productVariantId, quantity }
      await addToCartApi(selectedVariant.id, quantity);
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-6 bg-teal-600 text-white px-5 py-2.5 rounded-md shadow-lg font-medium z-50 text-sm';
      notification.textContent = `✓ ${quantity} item(s) added to bag`;
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2500);
      
      // Reset quantity after adding
      setQuantity(1);
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("Failed to add to cart. Please try again.");
    } finally {
      setAddingToCart(false);
    }
  };

  const increaseQuantity = () => {
    if (quantity < selectedVariant.stock) {
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

  const productImages = [product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-2.5 max-w-screen-2xl mx-auto">
          <div 
            onClick={() => navigate("/products")}
            className="cursor-pointer"
          >
            <img 
              src="/logo/logo.png" 
              alt="Safa Store" 
              className="h-11 w-auto object-contain"
            />
          </div>

          <div className="flex-1 max-w-lg mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full pl-10 pr-4 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded focus:outline-none focus:bg-white focus:border-gray-300"
              />
            </div>
          </div>

          <div className="flex items-center gap-7">
            <button
              onClick={() => navigate("/orders")}
              className="flex flex-col items-center gap-0.5 text-xs font-bold text-gray-800 hover:text-teal-600 transition-colors"
            >
              <Package size={20} strokeWidth={2} />
              <span>Orders</span>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="flex flex-col items-center gap-0.5 text-xs font-bold text-gray-800 hover:text-teal-600 transition-colors"
            >
              <User size={20} strokeWidth={2} />
              <span>Profile</span>
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="relative flex flex-col items-center gap-0.5 text-xs font-bold text-gray-800 hover:text-teal-600 transition-colors"
            >
              <ShoppingCart size={20} strokeWidth={2} />
              <span>Bag</span>
            </button>
          </div>
        </div>
      </nav>

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
        {/* LEFT: IMAGES */}
        <div className="w-2/5 p-6">
          <div className="space-y-3">
            {productImages.slice(0, 2).map((img, idx) => (
              <div key={idx} className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <img
                  src={img}
                  alt={`${product.name} - ${idx + 1}`}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div className="w-3/5 px-8 py-6 border-l border-gray-100">
          {/* Brand & Name */}
          <div className="mb-1">
            <h2 className="text-xl font-bold text-gray-900">{product.category}</h2>
            <h1 className="text-lg text-gray-600 mt-1">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-5 pb-5 border-b border-gray-200">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-teal-600 text-white rounded text-xs font-bold">
              <span>4.4</span>
              <Star size={11} className="fill-white" />
            </div>
            <span className="text-sm text-gray-600 font-medium">34.7k Ratings</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-gray-900">₹{selectedVariant.price}</span>
              <span className="text-base text-gray-400 line-through">₹{Math.round(selectedVariant.price * 2)}</span>
              <span className="text-base font-bold text-orange-600">(50% OFF)</span>
            </div>
            <p className="text-sm font-semibold text-teal-700">inclusive of all taxes</p>
          </div>

          {/* Select Size */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 uppercase">Select Size</h3>
              <button className="text-sm font-bold text-teal-600 hover:text-teal-700">
                SIZE CHART &gt;
              </button>
            </div>
            
            <div className="flex gap-3">
              {product.variants.map(v => (
                <button
                  key={v.id}
                  disabled={v.stock === 0}
                  onClick={() => {
                    setSelectedVariant(v);
                    setQuantity(1); // Reset quantity when size changes
                  }}
                  className={`w-14 h-14 rounded-full border-2 font-bold text-sm transition ${
                    v.stock === 0
                      ? "border-gray-200 text-gray-300 cursor-not-allowed line-through bg-gray-50"
                      : selectedVariant.id === v.id
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
                  disabled={quantity >= selectedVariant.stock}
                  className="p-3 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <Plus size={16} className="text-gray-700" />
                </button>
              </div>
              <span className="text-sm text-gray-600">
                {selectedVariant.stock > 0 ? (
                  <span className="text-teal-600 font-medium">
                    {selectedVariant.stock} items available
                  </span>
                ) : (
                  <span className="text-red-600 font-medium">Out of stock</span>
                )}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <button
              disabled={selectedVariant.stock === 0 || addingToCart}
              onClick={handleAddToCart}
              className={`flex-1 py-3.5 rounded-md font-bold text-sm transition shadow-sm ${
                selectedVariant.stock === 0 || addingToCart
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
            >
              <ShoppingCart size={18} className="inline mr-2 mb-0.5" />
              {selectedVariant.stock === 0 ? "OUT OF STOCK" : addingToCart ? "ADDING..." : "ADD TO BAG"}
            </button>

            <button className="px-5 py-3.5 border-2 border-gray-300 rounded-md hover:border-teal-400 hover:bg-teal-50 transition group">
              <Heart size={18} className="text-gray-700 group-hover:text-teal-600" />
            </button>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-50 rounded-full">
                <Truck size={16} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Free Delivery</p>
                <p className="text-[10px] text-gray-500">On orders above ₹500</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-50 rounded-full">
                <RefreshCw size={16} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Easy Returns</p>
                <p className="text-[10px] text-gray-500">7 days return policy</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-teal-50 rounded-full">
                <Shield size={16} className="text-teal-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Secure Payment</p>
                <p className="text-[10px] text-gray-500">100% safe & secure</p>
              </div>
            </div>
          </div>

          {/* Delivery Options */}
          <div className="border border-gray-300 rounded-md p-4 mb-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase">Delivery Options</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Enter pincode"
                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-teal-500"
              />
              <button className="px-5 py-2 bg-white border-2 border-teal-600 text-teal-600 rounded font-bold text-sm hover:bg-teal-50">
                CHECK
              </button>
            </div>
            <p className="text-xs text-gray-600">
              Enter PIN code to check delivery time & Cash on Delivery availability
            </p>
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