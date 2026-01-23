import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, CartesianGrid
} from "recharts";
import api from "../../api/axios";
import { 
  TrendingUp, Wallet, ShoppingBag, Package, 
  ArrowUpRight, Loader2, AlertCircle 
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
    } catch (err) {
      console.error(err);
      setError("Failed to load reports. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
      <p className="text-slate-500 font-medium animate-pulse">Generating Reports...</p>
    </div>
  );

  if (error) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white p-6 text-center">
      <div className="p-4 bg-red-50 text-red-500 rounded-full mb-4">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{error}</h2>
      <button 
        onClick={loadReports}
        className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100"
      >
        Try Again
      </button>
    </div>
  );

  return (
    <div style={{ zoom: "85%" }}  className="p-8 bg-[#F8FAFC] min-h-screen space-y-8 font-sans antialiased">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sales Analytics</h1>
          <p className="text-slate-500 font-medium">Business performance for the year {year}</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Live Data</span>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Revenue"
          subtitle="Delivered Orders"
          value={`₹${summary?.totalRevenue?.toLocaleString() ?? 0}`}
          icon={<Wallet size={24} />}
          gradient="from-indigo-600 to-indigo-500"
        />
        <SummaryCard
          title="Pending Revenue"
          subtitle="Awaiting Delivery"
          value={`₹${summary?.pendingRevenue?.toLocaleString() ?? 0}`}
          icon={<ShoppingBag size={24} />}
          gradient="from-amber-500 to-orange-400"
        />
        <SummaryCard
          title="Avg. Order Value"
          subtitle="Per Transaction"
          value={`₹${summary?.averageOrderValue?.toLocaleString() ?? 0}`}
          icon={<TrendingUp size={24} />}
          gradient="from-emerald-600 to-teal-500"
        />
      </div>

      {/* MAIN BAR CHART */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <TrendingUp className="text-indigo-600" size={24} /> Monthly Revenue
          </h2>
        </div>

        {monthlySales.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400 font-medium">No sales data recorded for this period</p>
          </div>
        ) : (
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySales} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="period" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="revenue" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* BOTTOM GRID: PIE & TABLE */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* TOP PRODUCTS PIE */}
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
          <h2 className="text-xl font-black text-slate-800 mb-6">Market Share</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topProducts}
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="revenue"
                  nameKey="productName"
                >
                  {topProducts.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {topProducts.slice(0, 4).map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                <span className="text-[11px] font-bold text-slate-500 truncate uppercase">{p.productName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT TABLE */}
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 pb-4">
            <h2 className="text-xl font-black text-slate-800">Best Sellers</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 text-[11px] uppercase tracking-widest text-slate-400 font-black">
                  <th className="px-8 py-4">Product Name</th>
                  <th className="px-8 py-4 text-center">Volume</th>
                  <th className="px-8 py-4 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topProducts.map((p, i) => (
                  <tr key={i} className="group hover:bg-indigo-50/30 transition-colors">
                    <td className="px-8 py-4 font-bold text-slate-700">{p.productName}</td>
                    <td className="px-8 py-4 text-center font-semibold text-slate-500">
                      <span className="px-3 py-1 bg-slate-100 rounded-full text-xs">
                        {p.quantitySold} sold
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right font-black text-indigo-600">
                      ₹{p.revenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ===== MODERN CARD COMPONENT ===== */
function SummaryCard({ title, subtitle, value, icon, gradient }) {
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} rounded-[2.5rem] p-8 text-white shadow-xl`}>
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80">{title}</p>
          <h3 className="text-3xl font-black mt-2 leading-none">{value}</h3>
          <p className="text-[10px] font-medium mt-4 bg-white/20 inline-block px-2 py-1 rounded-lg backdrop-blur-md">
            {subtitle}
          </p>
        </div>
        <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
          {icon}
        </div>
      </div>
      {/* Background Decorative Circle */}
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
    </div>
  );
}