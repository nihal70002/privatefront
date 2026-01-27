import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Search, Package, User, ShoppingCart } from "lucide-react";
import api from "../api/axios"; // Adjust path based on your folder structure

export default function UserLayout() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);

  // Optional: Fetch actual cart count if you have the endpoint
  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const res = await api.get("/cart"); // Adjust to your cart endpoint
        setCartCount(res.data.items?.length || 0);
      } catch (err) {
        console.error("Failed to fetch cart count", err);
      }
    };
    fetchCartCount();
  }, []);

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

          {/* SEARCH BAR */}
          <div className="w-[320px] ml-auto mr-6">
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
                  w-full pl-12 pr-4 py-2.5 text-xs
                  bg-slate-50
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
              className="flex flex-col items-center gap-1 text-xs font-bold text-gray-500 hover:text-teal-600 transition-colors group"
            >
              <Package size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              <span>Orders</span>
            </button>

            <button
              onClick={() => navigate("/profile")}
              className="flex flex-col items-center gap-1 text-xs font-bold text-gray-500 hover:text-teal-600 transition-colors group"
            >
              <User size={22} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
              <span>Profile</span>
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="relative flex flex-col items-center gap-1 text-xs font-bold text-gray-500 hover:text-teal-600 transition-colors group"
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

      {/* PAGE CONTENT */}
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}