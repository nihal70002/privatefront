import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingCart, Users, TrendingUp, Calendar, BadgeCheck } from "lucide-react";
import api from "../../api/axios";

export default function SalesExecutiveDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/admin/sales-executives/${id}/performance`);
        setPerformance(res.data);
      } catch (err) {
        console.error("Failed to load sales executive performance", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!performance) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-red-500 text-sm font-medium">Failed to load executive data</div>
      </div>
    );
  }

  const goToOrders = (type) => {
    navigate(`/admin/sales-executives/${id}/orders?type=${type}`);
  };

  const goToCustomers = () => {
    navigate(`/admin/sales-executives/${id}/customers`);
  };

  return (
    // Reduced top padding (pt-4) to move content to the very top
    <div className="min-h-screen bg-[#F8FAFC] px-6 pt-4 pb-10 font-sans antialiased text-slate-900">
      <div className="max-w-7xl mx-auto space-y-4">

        {/* COMPACT NAV & HEADER */}
        <div className="space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft size={16} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Back to Directory</span>
          </button>

          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100 text-white">
                <Users size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight">{performance.name}</h1>
                  <BadgeCheck size={16} className="text-blue-500" />
                </div>
                <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">
                  Executive ID: #{performance.salesExecutiveId}
                </p>
              </div>
            </div>
            
            {/* Quick Summary Value */}
            <div className="hidden md:block text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Value</p>
              <p className="text-xl font-black text-indigo-600">₹{(performance.totalOrderValue ?? 0).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* PRIMARY STATS GRID - Tighter Gaps */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Pending" value={performance.pendingOrders} icon={<ShoppingCart size={14} />} theme="amber" onClick={() => goToOrders("pending")} />
          <StatCard label="Accepted" value={performance.acceptedOrders} icon={<ShoppingCart size={14} />} theme="emerald" onClick={() => goToOrders("accepted")} />
          <StatCard label="Rejected" value={performance.rejectedOrders} icon={<ShoppingCart size={14} />} theme="rose" onClick={() => goToOrders("rejected")} />
          <StatCard label="Total Orders" value={performance.totalOrders} icon={<ShoppingCart size={14} />} theme="indigo" onClick={() => goToOrders("all")} />
        </div>

        {/* SECONDARY DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div onClick={goToCustomers} className="md:col-span-1 bg-white border border-slate-200 rounded-xl p-5 cursor-pointer hover:border-indigo-300 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Customers</span>
              <Users size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </div>
            <p className="text-3xl font-black text-slate-800">{performance.totalCustomers ?? 0}</p>
            <div className="mt-2 text-[10px] text-indigo-600 font-bold uppercase">View Directory →</div>
          </div>

          <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden">
             {/* Background Decoration */}
             <TrendingUp className="absolute -right-4 -bottom-4 text-slate-50 h-24 w-24 -rotate-12" />
             
             <div className="relative z-10">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Order Revenue Distribution</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-3xl font-black text-slate-800">₹{(performance.totalOrderValue ?? 0).toLocaleString()}</p>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded">Gross Value</span>
                </div>
             </div>

             {performance.lastOrderDate && (
              <div className="mt-4 flex items-center gap-2 text-[11px] font-medium text-slate-500">
                <Calendar size={12} className="text-slate-400" />
                <span>Last Activity: {new Date(performance.lastOrderDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tighter Hint Box */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg py-2 px-4 flex items-center gap-2">
          <span className="text-indigo-600 text-[11px] font-bold">PRO TIP:</span>
          <p className="text-[11px] text-indigo-500 font-medium">Click on any numeric card to drill down into specific data sets.</p>
        </div>
      </div>
    </div>
  );
}

/* COMPACT STAT CARD */
function StatCard({ label, value, icon, theme, onClick }) {
  const themes = {
    amber: { bg: "bg-white", border: "border-slate-200", stripe: "bg-amber-500", text: "text-amber-600" },
    emerald: { bg: "bg-white", border: "border-slate-200", stripe: "bg-emerald-500", text: "text-emerald-600" },
    rose: { bg: "bg-white", border: "border-slate-200", stripe: "bg-rose-500", text: "text-rose-600" },
    indigo: { bg: "bg-white", border: "border-slate-200", stripe: "bg-indigo-500", text: "text-indigo-600" },
  };

  const t = themes[theme];

  return (
    <div
      onClick={onClick}
      className={`${t.bg} border ${t.border} rounded-xl p-4 cursor-pointer transition-all hover:shadow-sm hover:border-slate-300 relative overflow-hidden group`}
    >
      <div className={`absolute top-0 left-0 w-1 h-full ${t.stripe} opacity-70`} />
      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 group-hover:text-slate-600 transition-colors">
        {icon}
        {label}
      </div>
      <p className="text-2xl font-black text-slate-800">
        {value ?? 0}
      </p>
    </div>
  );
}