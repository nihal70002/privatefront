import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, ClipboardList, Users, LogOut } from "lucide-react";

export default function SalesSidebar() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
      isActive
        ? "bg-[#4A86F7] text-white shadow-md shadow-[#4A86F7]/20"
        : "text-[#718096] hover:bg-gray-50 hover:text-[#2A334E]"
    }`;

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen p-6 flex flex-col shrink-0">
      {/* LOGO */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-[#4A86F7] flex items-center justify-center shadow-sm shadow-[#4A86F7]/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#2A334E]">
              MEDI-FLOW
            </h1>
          </div>
        </div>
        <p className="text-xs text-[#718096] uppercase font-bold tracking-wider pl-[52px]">
          Sales Executive
        </p>
      </div>

      {/* NAV */}
      <nav className="flex-1 space-y-2">
        <NavLink to="/sales-executive" className={linkClass}>
          <LayoutDashboard size={20} strokeWidth={2.5} />
          Dashboard
        </NavLink>

        <NavLink to="/sales/orders" className={linkClass}>
          <ClipboardList size={20} strokeWidth={2.5} />
          Orders
        </NavLink>

        <NavLink to="/sales/customers" className={linkClass}>
          <Users size={20} strokeWidth={2.5} />
          Customers
        </NavLink>
      </nav>

      {/* DIVIDER */}
      <div className="h-px bg-gray-200 my-4"></div>

      {/* LOGOUT */}
      <button
        onClick={logout}
        className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all font-semibold w-full"
      >
        <LogOut size={20} strokeWidth={2.5} />
        Logout
      </button>
    </aside>
  );
}