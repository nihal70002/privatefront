import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from "recharts";
import api from "../../api/axios";
import { 
  TrendingUp, Wallet, ShoppingBag,
  Loader2, AlertCircle 
} from "lucide-react";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AdminReports() {
  const [summary, setSummary] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const year = new Date().getFullYear();

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError("");
      const [summaryRes, monthlyRes, topRes] = await Promise.all([
        api.get("/admin/reports/summary"),
        api.get(`/admin/reports/monthly?year=${year}`),
        api.get("/admin/reports/top-products")
      ]);

      setSummary(summaryRes.data);
      setMonthlySales(monthlyRes.data || []);
      setTopProducts(topRes.data || []);
    } catch {
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-3">
      <Loader2 className="animate-spin text-indigo-600" size={36} />
      <p className="text-slate-500 text-sm font-medium">Generating reports…</p>
    </div>
  );

  if (error) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white text-center">
      <AlertCircle size={36} className="text-red-500 mb-3" />
      <p className="font-bold text-slate-700">{error}</p>
      <button
        onClick={loadReports}
        className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto bg-[#F8FAFC] px-6 py-6 space-y-6 text-[13px] font-sans antialiased">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Sales Analytics</h1>
          <p className="text-slate-500 text-sm">Business performance for {year}</p>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[11px] font-bold text-slate-600 uppercase">Live</span>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Revenue"
          value={`₹${summary?.totalRevenue?.toLocaleString() ?? 0}`}
          subtitle="Delivered Orders"
          icon={<Wallet size={20} />}
          gradient="from-indigo-600 to-indigo-500"
        />
        <SummaryCard
          title="Pending Revenue"
          value={`₹${summary?.pendingRevenue?.toLocaleString() ?? 0}`}
          subtitle="Awaiting Delivery"
          icon={<ShoppingBag size={20} />}
          gradient="from-amber-500 to-orange-400"
        />
        <SummaryCard
          title="Avg Order Value"
          value={`₹${summary?.averageOrderValue?.toLocaleString() ?? 0}`}
          subtitle="Per Transaction"
          icon={<TrendingUp size={20} />}
          gradient="from-emerald-600 to-teal-500"
        />
      </div>

      {/* BAR CHART */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6">
        <h2 className="font-black text-lg mb-4 flex items-center gap-2">
          <TrendingUp size={18} className="text-indigo-600" />
          Monthly Revenue
        </h2>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlySales}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="period" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={28} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PIE + TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* PIE */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6">
          <h2 className="font-black text-lg mb-4">Market Share</h2>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topProducts}
                  dataKey="revenue"
                  nameKey="productName"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={6}
                >
                  {topProducts.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* TABLE */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-4">
            <h2 className="font-black text-lg">Best Sellers</h2>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[11px] uppercase text-slate-400 font-black">
              <tr>
                <th className="px-6 py-3">Product</th>
                <th className="px-6 py-3 text-center">Volume</th>
                <th className="px-6 py-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topProducts.map((p, i) => (
                <tr key={i} className="hover:bg-indigo-50/30">
                  <td className="px-6 py-3 font-bold text-slate-700">{p.productName}</td>
                  <td className="px-6 py-3 text-center text-xs">{p.quantitySold} sold</td>
                  <td className="px-6 py-3 text-right font-black text-indigo-600">
                    ₹{p.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

/* ===== SUMMARY CARD ===== */
function SummaryCard({ title, value, subtitle, icon, gradient }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-3xl p-6 text-white shadow-lg`}>
      <div className="flex justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase opacity-80">{title}</p>
          <p className="text-2xl font-black mt-1">{value}</p>
          <p className="text-[10px] mt-2 bg-white/20 inline-block px-2 py-1 rounded-md">
            {subtitle}
          </p>
        </div>
        <div className="p-2 bg-white/20 rounded-xl">{icon}</div>
      </div>
    </div>
  );
}
