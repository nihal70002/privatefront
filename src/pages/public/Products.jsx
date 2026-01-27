import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../api/products.api";
import { addToCartApi, getCart } from "../../api/cart.api";
import ProductCard from "../../components/products/ProductCard";
import { ShoppingCart, User, Package, Search, ChevronRight, Filter, SlidersHorizontal } from "lucide-react";
import api from "../../api/axios";

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
const [brands, setBrands] = useState([]);
const [selectedBrand, setSelectedBrand] = useState(null);


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
useEffect(() => {
  const loadFilters = async () => {
    try {
      const res = await api.get("/brands");
      setBrands(res.data || []);
    } catch (err) {
      console.error("Failed to load brands", err);
    }
  };

  loadFilters();
}, []);



  const handleAddToCart = async (variantId) => {
    try {
      await addToCartApi(Number(variantId), 1);
      const updatedCart = await getCart();
      setCartCount(updatedCart.data?.length || 0);
      
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-6 bg-teal-600 text-white px-5 py-2.5 rounded-md shadow-lg font-medium z-50 text-xs';
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
    product.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.brandName &&
      product.brandName.toLowerCase().includes(searchQuery.toLowerCase()));

  const matchesCategory =
    selectedCategories.length === 0 ||
    selectedCategories.includes(product.categoryId);

  const matchesBrand =
    !selectedBrand || product.brandId === selectedBrand;

  return matchesSearch && matchesCategory && matchesBrand;
});


  if (loading) {
    return (
      <div className="w-full overflow-x-hidden bg-white">
        <div className="min-h-screen bg-white origin-top scale-[0.9] w-[111.111%] -ml-[5.555%]"></div>
        <div className="text-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-teal-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

     

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
      <div className="flex w-full px-4 py-6">


        {/* SIDEBAR FILTERS */}
        {showFilters && (
          <aside className="w-49 bg-white border-r border-gray-200 p-4 sticky top-24">

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-teal-600" />
                <h3 className="text-xs font-bold text-gray-900">FILTERS</h3>
              </div>
              <button
  onClick={clearFilters}
  className="text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors"
>
  CLEAR
</button>

            </div>

          <div className="mb-6 pb-6 border-b border-gray-100">
  <h4 className="text-xs font-bold text-gray-900 mb-4">
    CATEGORIES
  </h4>

  <div className="space-y-1">
    {categories.map((cat) => (
      <label
        key={cat.categoryId}
        className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer
                   hover:text-teal-700 transition-colors"
      >
        <input
          type="checkbox"
          checked={selectedCategories.includes(cat.categoryId)}
          onChange={() => toggleCategory(cat.categoryId)}
          className="w-4 h-4 rounded border-gray-300 text-teal-600"
        />
        <span className="leading-snug">
          {cat.categoryName}
        </span>
      </label>
    ))}
  </div>
</div>


<div className="mb-6">
  <h4 className="text-xs font-bold text-gray-900 mb-3">BRAND</h4>


  <div className="space-y-2">
    {brands.map((brand) => (
      <label
        key={brand.brandId}
        className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer"
      >
        <input
          type="checkbox"
          checked={selectedBrand === brand.brandId}
          onChange={() =>
            setSelectedBrand(
              selectedBrand === brand.brandId ? null : brand.brandId
            )
          }
          className="accent-indigo-600"
        />
        {brand.brandName}
      </label>
    ))}
  </div>
</div>

            

            {/* Price */}
            <div className="mb-4">
              
              <div className="space-y-3">
               
              </div>
            </div>
          </aside>
        )}

        {/* PRODUCTS SECTION */}
        <main className="flex-1 pl-6">

          {/* Header Bar */}
          <div className="flex items-cnter justify-between mb-4 px-2 py-2 border-b border-gray-200">

            <div className="flex items-center gap-4">
              
              
              <div className="h-6 w-px bg-gray-300"></div>
              
              <h1 className="text-base font-bold text-gray-900">
                {filteredProducts.length} <span className="font-normal text-gray-600">Products</span>
              </h1>
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