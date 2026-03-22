import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, Users, Clock, AlertTriangle, 
  Wallet, ChevronRight, MoreHorizontal, TrendingUp 
} from "lucide-react";
import api from "../../api/axios";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip,
} from "recharts";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [monthlyData, setMonthlyData] = useState([]);
  const [stats, setStats] = useState({
    total: 0, salesPending: 0, adminPending: 0, confirmed: 0, 
    dispatched: 0, delivered: 0, lowStock: 0, totalRevenue: 0
  });
       const formatSAR = (amount) =>
  new Intl.NumberFormat("en-SA", {
    style: "currency",
    currency: "SAR",
  }).format(amount);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const year = new Date().getFullYear();
        const [ordersRes, recentRes, lowStockRes, summaryRes, topProdRes, topCustRes, monthlyRes] = await Promise.all([
          api.get("/admin/orders", { params: { page: 1, pageSize: 1000 } }),
          api.get("/admin/orders/recent"),
          api.get("/admin/products/low-stock", { params: { threshold: 10 } }),
          api.get("/admin/reports/summary"),
          api.get("/admin/reports/top-products"),
          api.get("/admin/reports/top-customers"),
          api.get(`/admin/reports/monthly?year=${year}`)
        ]);
        console.log("Monthly Raw Data:", monthlyRes.data);




 


       const formatted = (monthlyRes.data || []).map(item => ({
  month: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][Number(item.period) - 1],
  revenue: Number(item.revenue) || 0
}));

console.log("Formatted Data:", formatted);

setMonthlyData(formatted);
        const orders = ordersRes.data.items || [];
        const counts = orders.reduce((acc, order) => {
          const status = order.status?.trim();
          if (status === "PendingSalesApproval") acc.salesPending++;
          else if (status === "PendingAdminApproval") acc.adminPending++;
          else if (status === "Confirmed") acc.confirmed++;
          else if (status === "Dispatched") acc.dispatched++;
          else if (status === "Delivered") acc.delivered++;
          return acc;
        }, { salesPending: 0, adminPending: 0, confirmed: 0, dispatched: 0, delivered: 0 });

        setStats({
          total: ordersRes.data.totalCount || 0,
          salesPending: counts.salesPending,
          adminPending: counts.adminPending,
          confirmed: counts.confirmed,
          dispatched: counts.dispatched,
          delivered: counts.delivered,
          lowStock: lowStockRes.data.length,
          totalRevenue: summaryRes.data?.totalRevenue || 0
        });

        setRecentOrders(recentRes.data || []);
        setTopProducts(topProdRes.data || []);
        setTopCustomers(topCustRes.data || []);
      } catch (error) {
        console.error("Dashboard Sync Error", error);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F8FAFC]">
      <div className="animate-spin h-5 w-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
  <div className="flex flex-col min-h-full">
    {/* FULL WIDTH HEADER - Now touches the sidebar and top */}
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-start">
          <h1 className="text-[20px] font-bold tracking-tight leading-none mb-1">
            <span className="text-[#0097D7]">Safa Al-Tamayyuz</span>{" "}
            <span className="text-black">Trading Co</span>
          </h1>
          
          <div className="flex items-center gap-1 font-bold text-[16px]" dir="rtl">
            <span className="text-black">شـركة صفـا</span>
            <span className="text-[#0097D7]">التـميز</span>
            <span className="text-black">التـجـارية</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer shadow-sm">
          <span className="text-[12px] font-black text-slate-600">SA</span>
        </div>
      </div>
    </header>

    {/* MAIN CONTENT AREA */}
    <div className="flex-1 p-6 lg:p-8 bg-[#F8FAFC]">
      <div className="max-w-[1600px] mx-auto space-y-8">
        
        {/* STATS SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Total Revenue" 
            value={formatSAR(stats.totalRevenue)}
            icon={<Wallet size={18} />} 
            theme="indigo" 
            onClick={() => navigate("/admin/reports")} 
          />
          <MiniStat label="Sales Pending" value={stats.salesPending} theme="amber" onClick={() => navigate("/admin/orders?status=PendingSalesApproval")} />
          <MiniStat label="Admin Pending" value={stats.adminPending} theme="amber" onClick={() => navigate("/admin/orders?status=PendingAdminApproval")} />
        </section>

        {/* ANALYTICS & TOP PRODUCTS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"> 
          {/* GROWTH ANALYTICS */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col transition-all hover:shadow-md">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h3 className="text-slate-900 font-bold text-xl tracking-tight">Growth Analytics</h3>
                <p className="text-slate-400 text-sm font-medium">Monthly revenue performance</p>
              </div>
              <div className="flex gap-4 p-2 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 px-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500"></div>
                  <span className="text-[12px] font-bold text-slate-600">Orders</span>
                </div>
                <div className="flex items-center gap-2 px-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-400"></div>
                  <span className="text-[12px] font-bold text-slate-600">Revenue</span>
                </div>
              </div>
            </div>
            
            <div className="w-full h-[280px]">
              {monthlyData.length < 2 ? (
                <div className="h-full flex items-center justify-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-sm font-bold text-slate-400">Insufficent data for analytics</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px' }}
                      formatter={(value) => [`SAR ${value}`, 'Revenue']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 3, stroke: '#fff' }} fill="url(#colorRev)" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* TOP PRODUCTS */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-slate-900 font-bold text-xl tracking-tight">Top Products</h3>
              <MoreHorizontal size={20} className="text-slate-300" />
            </div>
            <div className="space-y-6">
              {topProducts.slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform">
                      {item.imageUrl ? <img src={item.imageUrl} className="object-cover h-full w-full" /> : <div className="h-full w-full flex items-center justify-center text-slate-300"><Package size={20} /></div>}
                    </div>
                    <div>
                      <p className="text-[14px] font-bold text-slate-800 truncate w-32 leading-tight">{item.productName}</p>
                      <p className="text-[12px] text-emerald-500 font-black mt-1">{formatSAR(item.revenue)}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">{item.quantitySold} Sold</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-10 py-4 text-[13px] font-black text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 hover:text-slate-600 transition-all uppercase tracking-widest">
              View Inventory
            </button>
          </div>
        </div>

        {/* RECENT ACTIVITY & CUSTOMERS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Recent Activity</h3>
              <button onClick={() => navigate("/admin/orders")} className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View All</button>
            </div>
            <table className="w-full">
              <tbody className="divide-y divide-slate-50">
                {recentOrders.slice(0, 4).map(o => (
                  <tr key={o.orderId} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-4 text-sm font-bold text-slate-700">#ORD-{o.orderId}</td>
                    <td className="px-8 py-4"><StatusBadge status={o.status} /></td>
                    <td className="px-8 py-4 text-sm font-black text-slate-900 text-right">{formatSAR(o.totalAmount)}</td>
                    <td className="px-8 py-4 text-right">
                      <button onClick={() => navigate(`/admin/orders/${o.orderId}`)} className="text-slate-300 hover:text-indigo-600 transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Top Customers</h3>
            <div className="space-y-6">
              {topCustomers.slice(0, 3).map((cust, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600 border border-indigo-100">
                      {cust.customerName?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-slate-800 leading-none">{cust.customerName}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-1">{cust.ordersCount} Orders</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-slate-800">{formatSAR(cust.totalSpent)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

// COMPACT COMPONENTS

function StatCard({ title, value, icon, theme, onClick }) {
  const themes = {
    indigo: "bg-indigo-50 border-indigo-100 text-indigo-700",
    rose: "bg-rose-50 border-rose-100 text-rose-700",
  };
  return (
    <div onClick={onClick} className={`${themes[theme]} rounded-xl p-3 border shadow-sm flex justify-between items-center cursor-pointer hover:-translate-y-0.5 transition-all`}>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-0.5">{title}</p>
        <h4 className="text-lg font-black leading-tight">{value}</h4>
      </div>
      <div className="bg-white/50 p-1.5 rounded-lg shrink-0">{icon}</div>
    </div>
  );
}

function MiniStat({ label, value, theme, onClick }) {
  const themes = {
    amber: "bg-amber-50 border-amber-100 text-amber-700",
  }
  return (
    <div onClick={onClick} className={`${themes[theme]} rounded-xl p-3 border shadow-sm cursor-pointer hover:-translate-y-0.5 transition-all`}>
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-0.5">{label}</p>
      <div className="text-lg font-black leading-tight">{value}</div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Dispatched: "bg-blue-50 text-blue-600 border-blue-200",
    Confirmed: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase border ${styles[status] || "bg-slate-50 border-slate-100"}`}>
      {status}
    </span>
  );
}