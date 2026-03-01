import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Search, Package, User, ShoppingCart } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const isCartPage = location.pathname === "/cart";

  // 🔎 Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🛒 Cart Context
  const { cartCount, setCartFromApi } = useCart();

  // ✅ Hydrate cart count
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await api.get("/cart");
        setCartFromApi(res.data.length || 0);
      } catch (err) {
        console.error("Failed to fetch cart count", err);
        setCartFromApi(0);
      }
    };

    fetchCartCount();
  }, [location.pathname]);

  // 🔍 Handle Enter Search
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      const query = searchQuery.trim();
      if (!query) return;

      navigate(`/products?search=${encodeURIComponent(query)}`);
      setShowDropdown(false);
      setSearchQuery("");
    }
  };

  // 🔥 Suggestion Fetch (Debounced)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/products/search-suggestions?query=${encodeURIComponent(searchQuery)}`
        );

        setSuggestions(res.data);
      } catch (err) {
        console.error("Suggestion fetch error", err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-between px-6 py-3 max-w-screen-2xl mx-auto">

          {/* LOGO */}
          <div
            onClick={() => navigate("/products")}
            className="cursor-pointer hover:scale-105 transition-transform"
          >
            <img
  src="/logo/logo.png"
  alt="Safa Store"
  className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-all duration-200"
/>
          </div>

          {/* SEARCH */}
          <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />

              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full pl-12 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500 focus:bg-white"
              />
            </div>

            {/* DROPDOWN */}
            {showDropdown && searchQuery.trim().length > 0 && (
  <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-2xl shadow-2xl border border-emerald-100 z-50 p-4">

    {loading && (
      <div className="text-sm text-gray-500 px-2 py-2">
        Searching...
      </div>
    )}

    {!loading && suggestions.length === 0 && (
      <div className="text-sm text-gray-500 px-2 py-2">
        No results found
      </div>
    )}

    {!loading && suggestions.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

        {suggestions.slice(0, 6).map((item) => (
          <div
            key={item.productId}
            onClick={() => {
              navigate(`/products/${item.productId}`);
              setSearchQuery("");
              setShowDropdown(false);
            }}
            className="flex items-center gap-3 cursor-pointer hover:bg-emerald-50 p-2 rounded-lg transition"
          >
            <img
              src={item.primaryImageUrl}
              alt={item.name}
              className="w-10 h-10 md:w-12 md:h-12 rounded-md object-cover border border-gray-100"
            />

            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-800 line-clamp-1">
                {item.name}
              </span>

              <span className="text-xs text-gray-500">
                {item.brandName}
              </span>

              <span className="text-sm font-semibold text-emerald-600">
                ₹{item.startingPrice}
              </span>
            </div>
          </div>
        ))}

      </div>
    )}
  </div>
)}
</div>

          {/* ACTIONS */}
          <div className="flex items-center gap-6 text-gray-600">
             <button
  onClick={() => setShowDropdown(true)}
  className="sm:hidden flex flex-col items-center gap-1 hover:text-gray-900 transition-colors"
>
  <Search size={22} />
  <span className="text-xs">Search</span>
</button>



            <button
              onClick={() => navigate("/orders")}
              className="flex flex-col items-center gap-1 hover:text-gray-900 transition-colors"
            >

             

              <Package size={22} />
              <span className="text-xs">Orders</span>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="flex flex-col items-center gap-1 hover:text-gray-900 transition-colors"
            >
              <User size={22} />
              <span className="text-xs">Profile</span>
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="relative flex flex-col items-center gap-1 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart size={22} />
              <span className="text-xs">Bag</span>

              {cartCount > 0 && !isCartPage && (
                <span className="absolute -top-1 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}