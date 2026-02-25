import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  LogOut,
  ShieldCheck,
  User,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";

export default function SalesSidebar() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-4 px-6 py-4 transition-all border-l-4 ${
      isActive
        ? "border-[#009688] bg-[#f5f5f6] text-[#009688] font-bold"
        : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-200"
    }`;

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <>
      {/* ================= FIXED MOBILE HEADER (Menu Left, Logo Right) ================= */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-[60] shadow-sm">
        
        {/* Hamburger Menu on the LEFT */}
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors active:bg-gray-200"
        >
          <Menu size={24} />
        </button>

        {/* Logo on the RIGHT */}
        <div className="flex items-center">
          <img 
            src="/logo/logo.png" 
            alt="Logo" 
            className="h-8 w-auto object-contain" 
          />
        </div>
      </div>

      {/* ================= SIDEBAR / DRAWER ================= */}
      <aside
        className={`
          fixed top-0 left-0 z-[70]
          h-screen w-72
          bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:sticky
        `}
      >
        {/* Close Button Inside Drawer */}
        <div className="md:hidden absolute top-5 right-5">
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* LOGO SECTION (Inside Sidebar) */}
        <div className="py-8 px-4 border-b border-gray-100 flex flex-col items-center text-center bg-[#fcfcfc]">
          <div 
            onClick={() => {
              navigate("/sales-executive");
              setIsOpen(false);
            }}
            className="cursor-pointer mb-4 transition-transform hover:scale-105"
          >
            <img 
              src="/logo/logo.png" 
              alt="Safa Store" 
              className="h-10 w-auto object-contain" 
            />
          </div>

          <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
             <ShieldCheck size={12} className="text-[#009688]" />
             <p className="text-[10px] text-[#009688] uppercase font-bold tracking-widest">
               Sales Executive
             </p>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <NavLink to="/sales-executive" className={linkClass} end onClick={() => setIsOpen(false)}>
            <LayoutDashboard size={20} />
            <span className="text-sm font-medium">Dashboard</span>
          </NavLink>

          <NavLink to="/sales/orders" className={linkClass} onClick={() => setIsOpen(false)}>
            <ClipboardList size={20} />
            <span className="text-sm font-medium">Orders</span>
          </NavLink>

          <NavLink to="/sales/customers" className={linkClass} onClick={() => setIsOpen(false)}>
            <Users size={20} />
            <span className="text-sm font-medium">Customers</span>
          </NavLink>

          <NavLink to="/sales/profile" className={linkClass} onClick={() => setIsOpen(false)}>
            <User size={20} />
            <span className="text-sm font-medium">My Profile</span>
          </NavLink>
        </nav>

        {/* LOGOUT BUTTON */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={logout}
            className="flex items-center gap-4 px-6 py-4 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-widest w-full"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= BLACK OVERLAY ================= */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[65] md:hidden"
        />
      )}
    </>
  );
}