import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../api/products.api";
import { addToCartApi, getCart } from "../../api/cart.api";
import ProductCard from "../../components/products/ProductCard";
import { ShoppingCart, User, Package, Search, ChevronRight, Filter, SlidersHorizontal } from "lucide-react";

export default function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
const [page, setPage] = useState(1);
const [hasMore, setHasMore] = useState(true);
const PAGE_SIZE = 12;
const [selectedCategories, setSelectedCategories] = useState([]);


useEffect(() => {
  loadProducts(1, true);
  loadCart();
}, []);

const loadCart = async () => {
  const cartRes = await getCart();
  setCartCount(cartRes.data?.length || 0);
};

const loadProducts = async (pageNo, reset = false) => {
  try {
    setLoading(true);
    const res = await getProducts(pageNo);

    const items = res.data.items || [];

    setProducts(prev =>
      reset ? items : [...prev, ...items]
    );

    setHasMore(items.length === PAGE_SIZE);
    setPage(pageNo);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  const handleAddToCart = async (variantId) => {
    try {
      await addToCartApi(Number(variantId), 1);
      const updatedCart = await getCart();
      setCartCount(updatedCart.data?.length || 0);
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-6 bg-teal-600 text-white px-5 py-2.5 rounded-md shadow-lg font-medium z-50 text-sm';
      notification.textContent = '✓ Added to bag';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2000);
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add to cart");
    }
  };

 const categories = Array.from(
  new Map(
    products.map(p => [
      p.categoryId,
      { categoryId: p.categoryId, categoryName: p.categoryName }
    ])
  ).values()
);
const toggleCategory = (categoryId) => {
  setSelectedCategories(prev =>
    prev.includes(categoryId)
      ? prev.filter(id => id !== categoryId)
      : [...prev, categoryId]
  );
};
const clearFilters = () => {
  setSelectedCategories([]);
  setSearchQuery("");
};


const filteredProducts = products.filter(product => {
  const matchesSearch =
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.categoryName.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesCategory =
    selectedCategories.length === 0 ||
    selectedCategories.includes(product.categoryId);

  return matchesSearch && matchesCategory;
});

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <div className="text-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-teal-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white shadow-md border-b border-teal-100">
        <div className="flex items-center justify-between px-6 py-3 max-w-screen-2xl mx-auto">
          {/* LOGO */}
          <div 
            onClick={() => navigate("/products")}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <img 
              src="/logo/logo.png" 
              alt="Safa Store" 
              className="h-12 w-auto object-contain"
            />
          </div>

         {/* SEARCH BAR */}
<div className="flex-1 max-w-2xl mx-8">
  <div className="relative">
    <Search
      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
      size={18}
    />
    <input
      type="text"
      placeholder="Search for products, brands and more..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="
        w-full pl-12 pr-4 py-2.5 text-sm
        bg-slate-100
        border border-slate-300
        rounded-lg
        focus:outline-none
        focus:border-slate-500
        focus:bg-white
        transition-all
        placeholder:text-slate-400
      "
    />
  </div>
</div>

          {/* NAV ACTIONS */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/orders")}
              className="flex flex-col items-center gap-1 text-xs font-bold text-gray-700 hover:text-teal-600 transition-colors group"
            >
              <Package size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              <span>Orders</span>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="flex flex-col items-center gap-1 text-xs font-bold text-gray-700 hover:text-teal-600 transition-colors group"
            >
              <User size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="relative flex flex-col items-center gap-1 text-xs font-bold text-gray-700 hover:text-teal-600 transition-colors group"
            >
              <ShoppingCart size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              <span>Bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 px-6 py-3 max-w-screen-2xl mx-auto text-xs">
          <span onClick={() => navigate("/")} className="text-gray-600 hover:text-teal-600 cursor-pointer font-medium transition-colors">
            Home
          </span>
          <ChevronRight size={14} className="text-gray-400" />
          <span className="font-bold text-teal-700">All Products</span>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex max-w-screen-2xl mx-auto gap-6 px-6 py-6">
        {/* SIDEBAR FILTERS */}
        {showFilters && (
          <aside className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-5 h-fit sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-teal-600" />
                <h3 className="text-sm font-bold text-gray-900">FILTERS</h3>
              </div>
              <button
  onClick={clearFilters}
  className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
>
  CLEAR
</button>

            </div>

            {/* Categories */}
           <div className="mb-6 pb-6 border-b border-gray-100">
  <h4 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-wide">
    Categories
  </h4>

  {categories.map(cat => (
    <label
      key={cat.categoryId}
      className="flex items-center text-sm text-gray-700 cursor-pointer hover:text-teal-700"
    >
      <input
        type="checkbox"
        checked={selectedCategories.includes(cat.categoryId)}
        onChange={() => toggleCategory(cat.categoryId)}
        className="mr-3 w-4 h-4 rounded border-gray-300 text-teal-600"
      />
      <span>{cat.categoryName}</span>
    </label>

  ))}
</div>


            {/* Brand */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <h4 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-wide">Brand</h4>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="Search brands..."
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              <div className="space-y-3 max-h-52 overflow-y-auto custom-scrollbar">
                <label className="flex items-center text-sm text-gray-700 hover:text-teal-700 cursor-pointer group">
                  <input type="checkbox" className="mr-3 w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Denver <span className="text-gray-400 text-xs">(32)</span></span>
                </label>
                <label className="flex items-center text-sm text-gray-700 hover:text-teal-700 cursor-pointer group">
                  <input type="checkbox" className="mr-3 w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Wild Stone <span className="text-gray-400 text-xs">(15)</span></span>
                </label>
                <label className="flex items-center text-sm text-gray-700 hover:text-teal-700 cursor-pointer group">
                  <input type="checkbox" className="mr-3 w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  <span className="group-hover:translate-x-0.5 transition-transform">OSCAR <span className="text-gray-400 text-xs">(13)</span></span>
                </label>
              </div>
            </div>

            {/* Price */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-gray-900 mb-4 uppercase tracking-wide">Price Range</h4>
              <div className="space-y-3">
                <label className="flex items-center text-sm text-gray-700 hover:text-teal-700 cursor-pointer group">
                  <input type="checkbox" className="mr-3 w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Under ₹500</span>
                </label>
                <label className="flex items-center text-sm text-gray-700 hover:text-teal-700 cursor-pointer group">
                  <input type="checkbox" className="mr-3 w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  <span className="group-hover:translate-x-0.5 transition-transform">₹500 - ₹1000</span>
                </label>
                <label className="flex items-center text-sm text-gray-700 hover:text-teal-700 cursor-pointer group">
                  <input type="checkbox" className="mr-3 w-4 h-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  <span className="group-hover:translate-x-0.5 transition-transform">Above ₹1000</span>
                </label>
              </div>
            </div>
          </aside>
        )}

        {/* PRODUCTS SECTION */}
        <main className="flex-1">
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-6 bg-white rounded-xl shadow-sm border border-gray-200 px-5 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-lg font-semibold text-sm hover:bg-teal-100 transition-colors"
              >
                <Filter size={16} />
                <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
              </button>
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <h1 className="text-base font-bold text-gray-900">
                {filteredProducts.length} <span className="font-normal text-gray-600">Products</span>
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-medium">Sort by:</span>
              <select className="px-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-semibold text-gray-900 focus:outline-none focus:border-teal-500 cursor-pointer transition-colors">
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
                <option>Popularity</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-xl font-semibold text-gray-700 mb-2">No products found</p>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.productId}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </main>
      </div>
      {hasMore && (
  <div className="flex justify-center mt-10">
    <button
      onClick={() => loadProducts(page + 1)}
      className="px-8 py-3 bg-teal-600 text-white font-bold rounded-lg hover:bg-teal-700 transition"
    >
      Load More Products
    </button>
  </div>
)}


      {/* Footer */}
      <footer className="bg-gradient-to-br from-teal-700 to-teal-900 text-white py-10 mt-20">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4 text-lg">About Us</h3>
              <p className="text-teal-100 text-sm leading-relaxed">
                Premium quality medical and industrial products for your needs.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Quick Links</h3>
              <ul className="space-y-2 text-teal-100 text-sm">
                <li className="hover:text-white cursor-pointer transition-colors">Products</li>
                <li className="hover:text-white cursor-pointer transition-colors">Orders</li>
                <li className="hover:text-white cursor-pointer transition-colors">Profile</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Support</h3>
              <ul className="space-y-2 text-teal-100 text-sm">
                <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
                <li className="hover:text-white cursor-pointer transition-colors">Returns</li>
                <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4 text-lg">Contact</h3>
              <p className="text-teal-100 text-sm">
                Email: support@safa.store<br />
                Phone: +1 234 567 890
              </p>
            </div>
          </div>
          <div className="border-t border-teal-600 pt-6 text-center">
            <p className="text-sm text-teal-200">
              © 2026 Safa Al-Tamayyuz Trading. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #14b8a6;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #0d9488;
        }
      `}</style>
    </div>
  );
}