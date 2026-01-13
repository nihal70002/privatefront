import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  BarChart3, Settings, AlertTriangle, CheckCircle2, 
  Clock, Truck, ChevronRight, Wallet
} from "lucide-react";
import api from "../../api/axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0, pending: 0, confirmed: 0, dispatched: 0, delivered: 0, lowStock: 0, totalRevenue: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [
        ordersRes,
        recentRes,
        lowStockRes,
        summaryRes
      ] = await Promise.all([
        // 👇 fetch minimal data, just for stats
        api.get("/admin/orders", { params: { page: 1, pageSize: 1000 } }),
        api.get("/admin/orders/recent"),
        api.get("/admin/products/low-stock", { params: { threshold: 10 } }),
        api.get("/admin/reports/summary")
      ]);

      const orders = ordersRes.data.items || [];
      const totalOrders = ordersRes.data.totalCount || 0;

      // ✅ STATUS COUNTS
      const counts = orders.reduce(
        (acc, order) => {
          const status = order.status?.toLowerCase();
          if (acc[status] !== undefined) acc[status]++;
          return acc;
        },
        { pending: 0, confirmed: 0, dispatched: 0, delivered: 0 }
      );

      setStats({
        total: totalOrders,
        pending: counts.pending,
        confirmed: counts.confirmed,
        dispatched: counts.dispatched,
        delivered: counts.delivered,
        lowStock: lowStockRes.data.length,
        totalRevenue: summaryRes.data?.totalRevenue || 0
      });

      setRecentOrders(recentRes.data);

    } catch (err) {
      console.error("Dashboard Sync Error", err);
    } finally {
      setLoading(false);
    }
  };

  loadDashboard();
}, []);

<img
  src="/logo/logo.png"
  alt="Admin Logo"
  className="h-10 w-auto object-contain bg-red-200 border border-red-500"
/>

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased">
      
      {/* SIDEBAR */}
      <aside className="w-72 hidden lg:flex flex-col bg-white border-r border-slate-200">
        <div className="p-8">
         <div className="flex items-center gap-3 px-2">
  <img
    src="/logo/logo.png"
    alt="Admin Logo"
    className="h-10 w-auto object-contain"
  />
</div>

        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active onClick={() => navigate("/admin/dashboard")} />
          <SidebarItem icon={<ShoppingCart size={20}/>} label="Orders" onClick={() => navigate("/admin/orders")} />
          <SidebarItem icon={<Package size={20}/>} label="Products" onClick={() => navigate("/admin/products")} />
          <SidebarItem icon={<Users size={20}/>} label="Customers" onClick={() => navigate("/admin/customers")} />
          <SidebarItem icon={<BarChart3 size={20}/>} label="Reports" onClick={() => navigate("/admin/reports")} />
          <div className="pt-4 mt-4 border-t border-slate-100">
            <SidebarItem icon={<Settings size={20}/>} label="Settings" onClick={() => navigate("/admin/settings")} />
          </div>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 z-10">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Dashboard Overview</h2>
          <div className="flex items-center gap-4">
             <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-2 border-white shadow-md cursor-pointer" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 lg:p-12">
          <div className="max-w-7xl mx-auto space-y-10">

            {/* MAIN STAT CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <StatCard 
                title="Total Revenue" 
                value={`₹${stats.totalRevenue.toLocaleString()}`} 
                icon={<Wallet size={28} />} 
                gradient="from-indigo-600 to-indigo-500" 
                onClick={() => navigate("/admin/reports")}
              />
              <StatCard 
                title="Active Orders" 
                value={stats.total} 
                icon={<ShoppingCart size={28} />} 
                gradient="from-blue-600 to-blue-500" 
                onClick={() => navigate("/admin/orders")} 
              />
              <StatCard 
                title="Stock Alerts" 
                value={stats.lowStock} 
                icon={<AlertTriangle size={28} />} 
                gradient="from-rose-600 to-rose-500" 
                onClick={() => navigate("/admin/low-stock")}
              />
            </section>

            {/* MINI STATUS GRID */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
               <MiniStat 
                  label="Pending" 
                  value={stats.pending} 
                  icon={<Clock size={16}/>} 
                  theme="amber" 
                  onClick={() => navigate("/admin/orders?status=Pending")}
               />
               <MiniStat 
                  label="Confirmed" 
                  value={stats.confirmed} 
                  icon={<CheckCircle2 size={16}/>} 
                  theme="emerald" 
                  onClick={() => navigate("/admin/orders?status=Confirmed")}
               />
               <MiniStat 
                  label="Dispatched" 
                  value={stats.dispatched} 
                  icon={<Truck size={16}/>} 
                  theme="sky" 
                  onClick={() => navigate("/admin/orders?status=Dispatched")}
               />
               <MiniStat 
                  label="Delivered" 
                  value={stats.delivered} 
                  icon={<CheckCircle2 size={16}/>} 
                  theme="indigo" 
                  onClick={() => navigate("/admin/orders?status=Delivered")}
               />
            </section>

            {/* RECENT TRANSACTIONS */}
            <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                <h3 className="text-xl font-black text-slate-800">Recent Transactions</h3>
                <button 
                  onClick={() => navigate("/admin/orders")} 
                  className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-full transition-all tracking-wider uppercase"
                >
                  View full history
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase tracking-[0.15em] font-black">
                    <tr>
                      <th className="px-8 py-5">Order Reference</th>
                      <th className="px-8 py-5">Current Status</th>
                      <th className="px-8 py-5">Amount</th>
                      <th className="px-8 py-5 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {recentOrders.length === 0 ? (
                      <tr><td colSpan="4" className="p-20 text-center text-slate-400 font-medium">No recent transactions found.</td></tr>
                    ) : (
                      recentOrders.map(o => (
                        <tr key={o.orderId} className="hover:bg-slate-50/80 transition-colors group">
                          <td className="px-8 py-6 font-bold text-slate-700">#ORD-{o.orderId}</td>
                          <td className="px-8 py-6"><StatusBadge status={o.status} /></td>
                          <td className="px-8 py-6 font-black text-slate-900">₹{o.totalAmount.toLocaleString()}</td>
                          <td className="px-8 py-6 text-center">
                            <button 
                              onClick={() => navigate(`/admin/orders/${o.orderId}`)}
                              className="p-2 text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 rounded-xl transition-all"
                            >
                              <ChevronRight size={20} />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

/* UI COMPONENTS */

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm
      ${active ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "text-slate-400 hover:bg-indigo-50 hover:text-indigo-600"}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function StatCard({ title, value, icon, gradient, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} rounded-[2.5rem] p-10 shadow-xl shadow-slate-200 flex justify-between items-start cursor-pointer hover:-translate-y-1 transition-all active:scale-95 text-white overflow-hidden relative`}
    >
      <div className="relative z-10">
        <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-2">{title}</p>
        <h4 className="text-4xl font-black tracking-tight">{value}</h4>
      </div>
      <div className="bg-white/20 p-4 rounded-[1.5rem] backdrop-blur-md relative z-10">
        {icon}
      </div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
    </div>
  );
}

function MiniStat({ label, value, icon, theme, onClick }) {
    const themes = {
        amber: "border-amber-100 bg-white text-amber-600 hover:bg-amber-50",
        emerald: "border-emerald-100 bg-white text-emerald-600 hover:bg-emerald-50",
        sky: "border-sky-100 bg-white text-sky-600 hover:bg-sky-50",
        indigo: "border-indigo-100 bg-white text-indigo-600 hover:bg-indigo-50",
    }
    return (
        <div 
          onClick={onClick}
          className={`p-6 rounded-[2rem] border-2 ${themes[theme]} flex flex-col gap-2 cursor-pointer transition-all hover:shadow-md active:scale-95`}
        >
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] opacity-70">{icon} {label}</div>
            <div className="text-3xl font-black tracking-tighter">{value}</div>
        </div>
    )
}

function StatusBadge({ status }) {
    const styles = {
        Pending: "bg-amber-100 text-amber-700",
        Delivered: "bg-emerald-100 text-emerald-700",
        Dispatched: "bg-blue-100 text-blue-700",
        Confirmed: "bg-indigo-100 text-indigo-700"
    };
    return (
        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${styles[status] || "bg-slate-100"}`}>
            {status}
        </span>
    );
}