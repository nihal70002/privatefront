import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { 
  Package, 
  IndianRupee, 
  Users, 
  Clock, 
  ChevronRight, 
  KeyRound,
  LayoutDashboard,
  ExternalLink
} from "lucide-react";

export default function SalesProfile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPwd, setShowPwd] = useState(false);

  useEffect(() => {
    api.get("/sales/orders")
      .then((res) => {
        setOrders(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error("Data fetch error", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#009688] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#F8FAFC] min-h-screen font-sans">
      <ProfileHeader onChangePassword={() => setShowPwd(true)} />
      
      <StatsCards orders={orders} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Top Customers */}
        <div className="lg:col-span-1">
          <TopCustomers orders={orders} />
        </div>

        {/* Main Content: Recent Activity */}
        <div className="lg:col-span-2">
          <RecentOrders orders={orders} />
        </div>
      </div>

      {showPwd && <ChangePasswordModal onClose={() => setShowPwd(false)} />}
    </div>
  );
}

/* =========================
   HEADER
========================= */
function ProfileHeader({ onChangePassword }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 text-[#009688]">
          <LayoutDashboard size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-[#1E293B] tracking-tight">
            Sales Dashboard
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Overview of your accounts and order status
          </p>
        </div>
      </div>

      <button
        onClick={onChangePassword}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-[#009688] hover:text-[#009688] transition-all text-gray-700 rounded-xl font-semibold text-sm shadow-sm"
      >
        <KeyRound size={16} />
        Security Settings
      </button>
    </div>
  );
}

/* =========================
   STATS CARDS
========================= */
function StatsCards({ orders }) {
  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "PendingSalesApproval").length;
  const customersCount = new Set(orders.map(o => o.customer?.companyName).filter(Boolean)).size;

  const stats = [
    { label: "Total Revenue", value: `₹${totalSales.toLocaleString()}`, icon: <IndianRupee size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Orders", value: orders.length, icon: <Package size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Clients", value: customersCount, icon: <Users size={20}/>, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Approval", value: pendingOrders, icon: <Clock size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>
            {s.icon}
          </div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{s.label}</p>
          <p className="text-2xl font-black text-[#1E293B] mt-1">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

/* =========================
   TOP CUSTOMERS (SIDEBAR)
========================= */
function TopCustomers({ orders }) {
  const customers = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const name = o.customer?.companyName;
      if (!name) return;
      if (!map[name]) map[name] = { orders: 0, revenue: 0 };
      map[name].orders += 1;
      map[name].revenue += o.totalAmount || 0;
    });
    return Object.entries(map).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 6);
  }, [orders]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <div className="p-6 border-b border-gray-50 flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#1E293B]">Key Accounts</h3>
        <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded font-bold uppercase">Top 6</span>
      </div>
      <div className="p-2 grow">
        {customers.map(([name, c]) => (
          <div key={name} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs group-hover:bg-[#009688]/10 group-hover:text-[#009688] transition-colors">
                {name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-sm text-[#334155] leading-none">{name}</p>
                <p className="text-xs text-gray-400 mt-1">{c.orders} Orders</p>
              </div>
            </div>
            <span className="font-bold text-[#009688] text-sm">₹{c.revenue.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   RECENT ORDERS (MAIN TABLE)
========================= */
function RecentOrders({ orders }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "PendingSalesApproval": return "bg-amber-100 text-amber-700 border-amber-200";
      case "Approved": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Rejected": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#1E293B]">Recent Transactions</h3>
        <button className="text-xs font-bold text-[#009688] hover:underline flex items-center gap-1">
          View All <ExternalLink size={12}/>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] uppercase tracking-wider font-bold text-gray-400">
            <tr>
              <th className="px-6 py-4">Ref ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Amount</th>
              <th className="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.slice(0, 8).map((o) => (
              <tr key={o.orderId} className="hover:bg-gray-50/50 transition-colors group">
                <td className="px-6 py-4 font-bold text-sm text-gray-700">#{o.orderId}</td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-600 truncate max-w-[150px]">
                    {o.customer?.companyName || "Unknown Client"}
                  </p>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold border ${getStatusStyle(o.status)} uppercase`}>
                    {o.status.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </td>
                <td className="px-6 py-4 font-bold text-sm text-[#1E293B] text-right">
                  ₹{o.totalAmount?.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1 text-gray-300 group-hover:text-[#009688] transition-colors">
                    <ChevronRight size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-20 text-center text-gray-400 text-sm">
            No orders found in this period.
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   CHANGE PASSWORD MODAL
========================= */
function ChangePasswordModal({ onClose }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!current || !next) return alert("Please complete all fields");
    try {
      setLoading(true);
      await api.post("/sales/change-password", {
        currentPassword: current,
        newPassword: next,
      });
      alert("Password updated successfully");
      onClose();
    } catch {
      alert("Authentication failed. Please check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-8">
          <h3 className="text-xl font-bold text-[#1E293B] mb-2">Update Credentials</h3>
          <p className="text-sm text-gray-500 mb-6">Ensure your account remains secure by using a strong password.</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">Current Password</label>
              <input
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#009688] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-400 uppercase mb-1 block">New Password</label>
              <input
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-[#009688] focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-6 flex justify-end gap-3">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
          >
            Discard
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-[#009688] hover:bg-[#00796B] text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-[#009688]/20 transition-all disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}