import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Box,
  AlertCircle,
  ArrowLeftRight,
  UserCircle,
  LogOut,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import usePendingCount from "../../hooks/usePendingCount";
import useLowStockCount from "../../hooks/useLowStockCount";


export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const pendingCount = usePendingCount();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar automatically when the route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
const lowStockCount = useLowStockCount();

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const menuItems = [
    { name: "Dashboard", path: "/warehouse/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Order Processing", path: "/warehouse/orders/process", icon: <ArrowLeftRight size={18} /> },
    {
  name: "Pending Orders",
  path: "/warehouse/orders/pending",
  icon: <ClipboardList size={18} />,
  badgeCount: pendingCount,
},

    { name: "All Orders", path: "/warehouse/orders/all", icon: <ClipboardList size={18} /> },
    { divider: true },
    { name: "Products", path: "/warehouse/inventory", icon: <Box size={18} /> },
    
    { name: "Stock Movements", path: "/warehouse/inventory/stock-movements", icon: <ArrowLeftRight size={18} /> },
    { divider: true },
    
  ];

  const isActive = (path) => {
    const current = location.pathname;
    if (current === path) return true;
    if (path === "/warehouse/orders/all" && current.match(/^\/warehouse\/orders\/\d+$/)) return true;
    return false;
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      
      {/* 1. MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        
        {/* MOBILE CLOSE BUTTON */}
        <button 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute right-4 top-5 p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close menu"
        >
          <X size={22} />
        </button>

        {/* LOGO SECTION */}
        <div className="py-6 px-4 border-b border-gray-100 flex flex-col items-center text-center bg-[#fcfcfc]">
          <div 
            onClick={() => {
              navigate("/warehouse/dashboard");
              setSidebarOpen(false);
            }}
            className="cursor-pointer mb-3 transition-transform hover:scale-105"
          >
            <img src="/logo/logo.png" alt="Safa Store" className="h-9 w-auto object-contain" />
          </div>

          <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
            <ShieldCheck size={10} className="text-blue-600" />
            <p className="text-[9px] text-blue-600 uppercase font-bold tracking-widest">Warehouse</p>
          </div>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item, idx) => {
            if (item.divider) return <div key={idx} className="h-px bg-gray-100 my-2" />;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-6 py-3.5 transition-all border-l-4 ${
                  active
                    ? "border-blue-600 bg-blue-50 text-blue-600 font-bold"
                    : "border-transparent text-gray-600 hover:bg-gray-50"
                }`}
              >
                <span>{item.icon}</span>
                <span className="flex justify-between w-full text-sm">
                  {item.name}
                  {item.badgeCount > 0 && (
  <span className="ml-2 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full">
    {item.badgeCount}
  </span>
)}

                </span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 rounded-lg text-red-500 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-widest w-full"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* MOBILE TOP BAR */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200 sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          
          <div onClick={() => navigate("/warehouse/dashboard")} className="cursor-pointer">
            <img src="/logo/logo.png" alt="Logo" className="h-7 w-auto" />
          </div>

          <div className="w-10"></div> {/* Balanced spacer */}
        </header>

        {/* MAIN SCROLLABLE AREA */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50">
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}