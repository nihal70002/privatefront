import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  LogOut,
  ShieldCheck,
  User
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
    <aside
  className={`
     fixed md:sticky top-0 left-0 z-40
    h-screen w-64
    bg-white border-r border-gray-200
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `}
>

      
      {/* ================= LOGO SECTION ================= */}
      {/* Reduced padding from p-8 to py-6 px-4 to match smaller logo */}
      <div className="py-4 px-4 border-b border-gray-100 flex flex-col items-center text-center bg-[#fcfcfc]">
        <div 
          onClick={() => navigate("/sales-executive")}
          className="cursor-pointer mb-3 transition-transform hover:scale-105"
        >
          {/* Changed h-16 to h-8 (exactly half size) */}
          <img 
            src="/logo/logo.png" 
            alt="Safa Store" 
            className="h-9 w-auto object-contain" 
          />
        </div>

        <div>
          <div className="flex items-center justify-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-100">
             <ShieldCheck size={10} className="text-[#009688]" />
             <p className="text-[9px] text-[#009688] uppercase font-bold tracking-widest">
                Sales Executive
             </p>
          </div>
        </div>
      </div>

      {/* ================= NAVIGATION ================= */}
      <nav className="flex-1 py-4">
  <NavLink
    to="/sales-executive"
    className={linkClass}
    end
    onClick={() => setIsOpen(false)}
  >
    <LayoutDashboard size={18} />
    <span className="text-sm">Dashboard</span>
  </NavLink>

  <NavLink
    to="/sales/orders"
    className={linkClass}
    onClick={() => setIsOpen(false)}
  >
    <ClipboardList size={18} />
    <span className="text-sm">Orders</span>
  </NavLink>

  <NavLink
    to="/sales/customers"
    className={linkClass}
    onClick={() => setIsOpen(false)}
  >
    <Users size={18} />
    <span className="text-sm">Customers</span>
  </NavLink>

  <NavLink
    to="/sales/profile"
    className={linkClass}
    onClick={() => setIsOpen(false)}
  >
    <User size={18} />
    <span className="text-sm">My Profile</span>
  </NavLink>
</nav>

     


      {/* ================= LOGOUT ================= */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-4 px-6 py-4 rounded-lg text-red-500 hover:bg-red-50 transition-all font-bold text-xs uppercase tracking-[0.1em] w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
    {isOpen && (
  <div
    onClick={() => setIsOpen(false)}
    className="fixed inset-0 bg-black/40 z-30 md:hidden"
  />
)}
</>

  );
}