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
          `/products?search=${encodeURIComponent(searchQuery)}`
        );

        setSuggestions(res.data.items.slice(0, 5));
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
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* SEARCH */}
          <div className="w-[320px] ml-auto mr-6 relative">
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
              <div className="absolute top-full mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">

                {loading && (
                  <div className="p-3 text-xs text-gray-500">
                    Searching...
                  </div>
                )}

                {!loading && suggestions.length === 0 && (
                  <div className="p-3 text-xs text-gray-500">
                    No results found
                  </div>
                )}

                {!loading &&
                  suggestions.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => {
                        navigate(`/products/${item._id}`);
                        setSearchQuery("");
                        setShowDropdown(false);
                      }}
                      className="px-4 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                      {item.name}
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-6 text-gray-600">
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