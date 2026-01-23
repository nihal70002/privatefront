import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Settings, LogOut
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased overflow-hidden">
      {/* SIDEBAR - Width reduced to w-56 for a tighter look */}
      <aside className="w-56 hidden lg:flex flex-col bg-[#1C1C1E] border-r border-slate-800 shrink-0">
        <div className="p-5">
          <div className="flex items-center gap-2 px-1">
            <img src="/logo/logo.png" alt="Logo" className="h-7 w-auto object-contain" />
          </div>
        </div>

        <nav className="flex-1 px-2 space-y-0.5">
          <SidebarItem icon={<LayoutDashboard size={16} />} label="Dashboard" active={location.pathname === "/admin/dashboard"} onClick={() => navigate("/admin/dashboard")} />
          <SidebarItem icon={<ShoppingCart size={16} />} label="Orders" active={location.pathname.startsWith("/admin/orders")} onClick={() => navigate("/admin/orders")} />
          <SidebarItem icon={<Package size={16} />} label="Products" active={location.pathname.startsWith("/admin/products")} onClick={() => navigate("/admin/products")} />
          <SidebarItem icon={<Users size={16} />} label="Sales Executive" active={location.pathname.startsWith("/admin/sales-executives")} onClick={() => navigate("/admin/sales-executives")} />
          <SidebarItem icon={<Users size={16} />} label="Customers" active={location.pathname.startsWith("/admin/customers")} onClick={() => navigate("/admin/customers")} />
          <SidebarItem icon={<BarChart3 size={16} />} label="Reports" active={location.pathname.startsWith("/admin/reports")} onClick={() => navigate("/admin/reports")} />

          <div className="pt-3 mt-3 border-t border-slate-800/50">
            <SidebarItem icon={<Settings size={16} />} label="Settings" active={location.pathname.startsWith("/admin/settings")} onClick={() => navigate("/admin/settings")} />
          </div>
        </nav>

        <div className="p-3 border-t border-slate-800/50">
          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all font-semibold text-[11px] text-slate-400 hover:bg-red-500/10 hover:text-red-500 cursor-pointer">
            <LogOut size={16} />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <Outlet /> 
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all font-semibold text-[12px] cursor-pointer outline-none ${active ? "bg-[#2C2C2E] text-white shadow-sm" : "text-slate-400 hover:bg-[#2C2C2E]/50 hover:text-white"}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}