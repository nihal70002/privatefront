import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // Added for navigation
import api from "../../api/axios";
import { 
  Package, 
  IndianRupee, 
  Users, 
  Clock, 
  ChevronRight, 
  KeyRound,
  LayoutDashboard,
  ExternalLink,
  ShieldCheck
} from "lucide-react";

export default function SalesProfile() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();

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
          <p className="text-gray-500 font-medium">Syncing Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 bg-[#F8FAFC] min-h-screen font-sans">
      <ProfileHeader onChangePassword={() => setShowPwd(true)} />
      
      <StatsCards orders={orders} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TopCustomers orders={orders} />
        </div>
        <div className="lg:col-span-2">
          <RecentOrders orders={orders} navigate={navigate} />
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
            Sales Overview
          </h2>
          <p className="text-gray-500 text-sm font-medium">
            Track performance and manage recent approvals
          </p>
        </div>
      </div>

      <button
        onClick={onChangePassword}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-[#009688] hover:text-[#009688] transition-all text-gray-700 rounded-xl font-semibold text-sm shadow-sm"
      >
        <KeyRound size={16} />
        Password & Security
      </button>
    </div>
  );
}

/* =========================
   STATS CARDS
========================= */
/* =========================
   STATS CARDS (2x2 Grid)
========================= */
function StatsCards({ orders }) {
  const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "PendingSalesApproval").length;
  const customersCount = new Set(orders.map(o => o.customer?.companyName).filter(Boolean)).size;

  const stats = [
    { label: "Total Revenue", value: `₹${totalSales.toLocaleString()}`, icon: <IndianRupee size={20}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Orders Count", value: orders.length, icon: <Package size={20}/>, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Clients", value: customersCount, icon: <Users size={20}/>, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Waitlist", value: pendingOrders, icon: <Clock size={20}/>, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:gap-6">
      {stats.map((s, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 group hover:border-[#009688]/30 transition-all">
          <div className={`w-10 h-10 md:w-12 md:h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
            {s.icon}
          </div>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-tight">{s.label}</p>
          <p className="text-lg md:text-2xl font-black text-[#1E293B] mt-1">{s.value}</p>
        </div>
      ))}
    </div>
  );
}

/* =========================
   TOP CUSTOMERS
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
        <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded font-bold uppercase">Performers</span>
      </div>
      <div className="p-2 grow">
        {customers.length > 0 ? customers.map(([name, c]) => (
          <div key={name} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs group-hover:bg-[#009688] group-hover:text-white transition-all">
                {name.substring(0, 2).toUpperCase()}
              </div>
              <div className="max-w-[120px]">
                <p className="font-bold text-sm text-[#334155] truncate">{name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{c.orders} Orders</p>
              </div>
            </div>
            <span className="font-bold text-[#009688] text-sm">₹{c.revenue.toLocaleString()}</span>
          </div>
        )) : (
          <div className="p-10 text-center text-gray-400 text-sm">No client data yet.</div>
        )}
      </div>
    </div>
  );
}

/* =========================
   RECENT TRANSACTIONS
========================= */
function RecentOrders({ orders, navigate }) {
  const getStatusStyle = (status) => {
    switch (status) {
      case "PendingSalesApproval": return "bg-amber-50 text-amber-600 border-amber-100";
      case "PendingAdminApproval": return "bg-blue-50 text-blue-600 border-blue-100";
      case "Delivered": return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "RejectedBySales": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-gray-50 text-gray-500 border-gray-100";
    }
  };

  const formatStatus = (status) => {
    return status.replace(/([A-Z])/g, ' $1').replace('By Sales', '').trim();
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#1E293B]">Recent Activity</h3>
        <button 
          onClick={() => navigate("/sales/orders")}
          className="text-[10px] font-black uppercase tracking-widest text-[#009688] hover:text-[#00796B] flex items-center gap-1.5 transition-colors"
        >
          Manage All <ExternalLink size={14}/>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 text-[10px] uppercase tracking-wider font-bold text-gray-400">
            <tr>
              {/* Added hidden sm:table-cell to hide Ref ID on phones */}
              <th className="px-4 md:px-6 py-4 hidden sm:table-cell">Ref ID</th>
              <th className="px-4 md:px-6 py-4">Client Name</th>
              <th className="px-4 md:px-6 py-4">Status</th>
              <th className="px-4 md:px-6 py-4 text-right">Invoice</th>
              <th className="px-4 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.slice(0, 8).map((o) => (
             <tr 
                key={o.orderId} 
                onClick={() => navigate(`/sales/orders/${o.orderId}`)} 
                className="hover:bg-gray-50/80 transition-colors group cursor-pointer"
              >
                {/* ID: Added hidden sm:table-cell */}
                <td className="px-4 md:px-6 py-4 font-bold text-xs text-gray-400 hidden sm:table-cell">#{o.orderId}</td>
                
                <td className="px-4 md:px-6 py-4">
                  {/* Added max-w-[100px] and truncate to prevent name from pushing the table out */}
                  <p className="text-sm font-semibold text-gray-600 truncate max-w-[100px] md:max-w-[180px]">
                    {o.customer?.companyName || "Walk-in Client"}
                  </p>
                </td>
                
                <td className="px-4 md:px-6 py-4">
                  {/* Added whitespace-nowrap and smaller text on mobile */}
                  <span className={`px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-bold border ${getStatusStyle(o.status)} uppercase whitespace-nowrap`}>
                    {formatStatus(o.status)}
                  </span>
                </td>
                
                <td className="px-4 md:px-6 py-4 font-bold text-sm text-[#1E293B] text-right whitespace-nowrap">
                  ₹{o.totalAmount?.toLocaleString()}
                </td>
                
                <td className="px-4 py-4 text-right">
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-[#009688] transition-all group-hover:translate-x-1" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center gap-2">
            <Package size={40} className="text-gray-200" />
            <p className="text-gray-400 text-sm font-medium">No transactions recorded.</p>
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
    if (!current || !next) return alert("Please fill in both fields");
    if (next.length < 6) return alert("New password must be at least 6 characters");
    
    try {
      setLoading(true);
      await api.post("/sales/change-password", {
        currentPassword: current,
        newPassword: next,
      });
      alert("Account security updated!");
      onClose();
    } catch {
      alert("Update failed. Verify your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-white/20">
        <div className="p-8">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-xl font-bold text-[#1E293B] mb-2">Security Update</h3>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">Change your password frequently to keep your sales data protected.</p>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase mb-1.5 block tracking-widest">Current Password</label>
              <input
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 focus:ring-2 focus:ring-[#009688]/20 focus:bg-white focus:border-[#009688] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase mb-1.5 block tracking-widest">New Password</label>
              <input
                type="password"
                value={next}
                onChange={(e) => setNext(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 focus:ring-2 focus:ring-[#009688]/20 focus:bg-white focus:border-[#009688] outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50/80 px-8 py-6 flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={submit}
            disabled={loading}
            className="bg-[#009688] hover:bg-[#00796B] text-white flex-1 py-3 rounded-xl font-bold text-sm shadow-xl shadow-[#009688]/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "Syncing..." : "Update Password"}
          </button>
          <button 
            onClick={onClose} 
            className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}