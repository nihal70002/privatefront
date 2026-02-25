import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Warehouse,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased overflow-hidden">
      
      {/* SIDEBAR */}
      <aside
      
  className={`
    fixed top-0 left-0 z-40 h-full w-56 bg-[#F1F5FF] border-r border-blue-100
    transform transition-transform duration-300
    ${open ? "translate-x-0" : "-translate-x-full"}
    lg:static lg:translate-x-0 lg:flex
  `}
>
  {/* MOBILE CLOSE BUTTON */}
<div className="lg:hidden flex justify-end p-3">
  <button onClick={() => setOpen(false)}>
    <X size={18} />
  </button>
</div>

        {/* LOGO */}
        <div className="p-5 border-b border-blue-100">
          <img
            src="/logo/logo.png"
            alt="Logo"
            className="h-8 w-auto object-contain"
          />
        </div>

        {/* NAV */}
       <nav className="flex-1 px-2 py-3 space-y-1">
  <SidebarItem
    icon={<LayoutDashboard size={16} />}
    label="Dashboard"
    active={location.pathname === "/admin/dashboard"}
    onClick={() => {
      navigate("/admin/dashboard");
      setOpen(false);
    }}
  />

  <SidebarItem
    icon={<ShoppingCart size={16} />}
    label="Orders"
    active={location.pathname.startsWith("/admin/orders")}
    onClick={() => {
      navigate("/admin/orders");
      setOpen(false);
    }}
  />

  <SidebarItem
    icon={<Package size={16} />}
    label="Products"
    active={location.pathname.startsWith("/admin/products")}
    onClick={() => {
      navigate("/admin/products");
      setOpen(false);
    }}
  />

  <SidebarItem
    icon={<Users size={16} />}
    label="Sales Executive"
    active={location.pathname.startsWith("/admin/sales-executives")}
    onClick={() => {
      navigate("/admin/sales-executives");
      setOpen(false);
    }}
  />

  <SidebarItem
    icon={<Users size={16} />}
    label="Customers"
    active={location.pathname.startsWith("/admin/customers")}
    onClick={() => {
      navigate("/admin/customers");
      setOpen(false);
    }}
  />

  <SidebarItem
    icon={<Warehouse size={16} />}
    label="Warehouse"
    active={location.pathname.startsWith("/admin/warehouse")}
    onClick={() => {
      navigate("/admin/warehouse");
      setOpen(false);
    }}
  />

  <SidebarItem
    icon={<BarChart3 size={16} />}
    label="Reports"
    active={location.pathname.startsWith("/admin/reports")}
    onClick={() => {
      navigate("/admin/reports");
      setOpen(false);
    }}
  />
</nav>

        {/* LOGOUT */}
        <div className="p-3 border-t border-blue-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-[12px] text-red-600 hover:bg-red-100/50 transition"
          >
            <LogOut size={16} />
            <span>LOGOUT</span>
          </button>
        </div>
      </aside>


      {open && (
  <div
    onClick={() => setOpen(false)}
    className="fixed inset-0 bg-black/30 z-30 lg:hidden"
  />
)}

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden relative">


        {/* MOBILE MENU BUTTON */}
<div className="lg:hidden p-3">
  <button onClick={() => setOpen(true)}>
    <Menu size={22} />
  </button>
</div>

        <Outlet />
      </main>
    </div>
  );
}

/* SIDEBAR ITEM */
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-semibold text-[12px] transition cursor-pointer outline-none
        ${
          active
            ? "bg-blue-600 text-white shadow-sm"
            : "text-slate-700 hover:bg-blue-100 hover:text-slate-900"
        }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
