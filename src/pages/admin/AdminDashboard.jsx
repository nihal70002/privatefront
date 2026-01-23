import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, Package, ShoppingCart, Users, 
  BarChart3, Settings, AlertTriangle, CheckCircle2, 
  Clock, Truck, ChevronRight, Wallet, MoreHorizontal
} from "lucide-react";
import api from "../../api/axios";


export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total: 0,
    salesPending: 0,
    adminPending: 0,
    confirmed: 0,
    dispatched: 0,
    delivered: 0,
    lowStock: 0,
    totalRevenue: 0
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topProducts, setTopProducts] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]); // Added missing state

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        
        // Corrected: Destructure 6 variables for 6 API calls
        const [ordersRes, recentRes, lowStockRes, summaryRes, topProdRes, topCustRes] = await Promise.all([
          api.get("/admin/orders", { params: { page: 1, pageSize: 1000 } }),
          api.get("/admin/orders/recent"),
          api.get("/admin/products/low-stock", { params: { threshold: 10 } }),
          api.get("/admin/reports/summary"),
          api.get("/admin/reports/top-products"),
          api.get("/admin/reports/top-customers"),
          api.get("/admin/reports/monthly") // This matches your Swagger
        ]);

        const orders = ordersRes.data.items || [];
        const counts = orders.reduce(
          (acc, order) => {
            const status = order.status?.trim();
            if (status === "PendingSalesApproval") acc.salesPending++;
            else if (status === "PendingAdminApproval") acc.adminPending++;
            else if (status === "Confirmed") acc.confirmed++;
            else if (status === "Dispatched") acc.dispatched++;
            else if (status === "Delivered") acc.delivered++;
            return acc;
          },
          { salesPending: 0, adminPending: 0, confirmed: 0, dispatched: 0, delivered: 0 }
        );

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

      } catch (err) {
        console.error("Dashboard Sync Error", err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  return (
    <div className="flex h-screen bg-[#FAFBFC] text-slate-900 font-sans antialiased overflow-hidden">
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10 shrink-0">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Dashboard Overview</h2>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 border-2 border-white shadow-sm cursor-pointer" />
          </div>
        </header>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FAFBFC]">
          <div className="max-w-[1400px] mx-auto space-y-6">

            {/* TOP SECTION: MAIN STAT CARDS */}
            <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<Wallet size={20} />} gradient="bg-[#FFF4ED]" textColor="text-slate-800" onClick={() => navigate("/admin/reports")} />
              <MiniStat label="Admin Pending" value={stats.adminPending} icon={<Clock size={14}/>} theme="amber" onClick={() => navigate("/admin/orders?status=PendingAdminApproval")} />
              <MiniStat label="Sales Pending" value={stats.salesPending} icon={<Clock size={14}/>} theme="amber" onClick={() => navigate("/admin/orders?status=PendingSalesApproval")} />
              
              <StatCard title="Stock Alerts" value={stats.lowStock} icon={<AlertTriangle size={20} />} gradient="bg-[#FFF9E6]" textColor="text-slate-800" onClick={() => navigate("/admin/low-stock")} />
            </section>

            {/* MIDDLE SECTION: SUMMARY & TOP SELLERS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              <div className="lg:col-span-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-slate-800 text-base">Summary</h3>
                  <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-[13px] text-slate-500 font-bold"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Order</div>
                      <div className="flex items-center gap-2 text-[13px] text-slate-500 font-bold"><span className="h-2 w-2 rounded-full bg-lime-400"></span> Income Growth</div>
                      <select className="bg-slate-50 border-none text-[13px] font-bold rounded p-1">
                        <option>Last 7 days</option>
                      </select>
                  </div>
                </div>
                <div className="w-full bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-200 h-[160px]">
                  <p className="text-slate-400 text-[13px] font-medium italic">Chart Integration Point</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 text-base">Most Selling Products</h3>
                  <MoreHorizontal size={16} className="text-slate-400" />
                </div>
                <div className="space-y-4">
                  {topProducts.length === 0 ? (
                    <div className="h-[160px] flex items-center justify-center">
                      <p className="text-base text-slate-400">No sales data available</p>
                    </div>
                  ) : (
                    topProducts.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center justify-between group cursor-pointer">
                        <div className="flex items-center gap-3">
                          <img src={item.imageUrl} alt={item.productName} className="h-9 w-9 rounded-lg object-cover bg-slate-100" />
                          <div>
                            <p className="text-base font-bold text-slate-800 truncate w-32">{item.productName}</p>
                            <p className="text-[13px] text-slate-400 font-medium">Revenue: ₹{item.revenue}</p>
                          </div>
                        </div>
                        <div className="bg-slate-50 px-2 py-1 rounded text-[9px] font-bold text-slate-600">{item.quantitySold} Sales</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION: RECENT TRANSACTIONS & TOP CUSTOMERS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <section className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-800">Recent Transactions</h3>
                  <button onClick={() => navigate("/admin/orders")} className="text-[13px] font-bold text-blue-600 uppercase tracking-wider">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-[13px] uppercase font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-3">Order Reference</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {recentOrders.length === 0 ? (
                        <tr><td colSpan="4" className="p-10 text-center text-slate-400 text-base">No transactions</td></tr>
                      ) : (
                        recentOrders.slice(0, 3).map(o => (
                          <tr key={o.orderId} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-3.5 text-base font-semibold text-slate-700">#ORD-{o.orderId}</td>
                            <td className="px-6 py-3.5"><StatusBadge status={o.status} /></td>
                            <td className="px-6 py-3.5 text-base font-bold text-slate-900">₹{o.totalAmount.toLocaleString()}</td>
                            <td className="px-6 py-3.5 text-center">
                              <button onClick={() => navigate(`/admin/orders/${o.orderId}`)} className="p-1 text-slate-400 hover:text-blue-600"><ChevronRight size={16} /></button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-base font-bold text-slate-800">Top Customers</h3>
                  <Users size={16} className="text-slate-400" />
                </div>
                <div className="space-y-5">
                  {topCustomers.length === 0 ? (
                    <p className="text-center py-10 text-[13px] text-slate-400">No customer data</p>
                  ) : (
                    topCustomers.slice(0, 3).map((cust, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center text-[13px] font-bold text-blue-600 border border-blue-100">
                            {cust.customerName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="text-base font-bold text-slate-800">{cust.customerName}</p>
                            <p className="text-[9px] text-slate-400 font-medium">{cust.ordersCount} Orders</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-black text-slate-800">₹{cust.totalSpent.toLocaleString()}</p>
                          <p className="text-[8px] text-emerald-500 font-bold uppercase">Total Spent</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Sub-components (StatCard, MiniStat, StatusBadge) remain the same...
function StatCard({ title, value, icon, gradient, textColor, onClick }) {
  return (
    <div onClick={onClick} className={`${gradient} rounded-2xl p-5 border border-slate-100 flex justify-between items-start cursor-pointer hover:shadow-md transition-all ${textColor}`}>
      <div>
        <p className="text-slate-500 text-[13px] font-bold uppercase tracking-wider mb-1">{title}</p>
        <h4 className="text-3xl font-black">{value}</h4>
      </div>
      <div className="bg-white/80 p-2 rounded-xl shadow-sm">{icon}</div>
    </div>
  );
}

function MiniStat({ label, value, icon, theme, onClick }) {
  const themes = {
    amber: "border-amber-100 bg-[#FFF9E6] text-amber-700",
    emerald: "border-emerald-100 bg-[#E8F5E9] text-emerald-700",
  }
  return (
    <div onClick={onClick} className={`p-4 rounded-2xl border ${themes[theme]} flex flex-col gap-1 cursor-pointer transition-all hover:shadow-sm`}>
      <div className="flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wider opacity-80">{icon} {label}</div>
      <div className="text-3xl font-black">{value}</div>
    </div>
  )
}

function StatusBadge({ status }) {
  const styles = {
    Pending: "bg-[#FFF9E6] text-amber-700 border-amber-200",
    Delivered: "bg-[#E8F5E9] text-emerald-700 border-emerald-200",
    Dispatched: "bg-[#E3F2FD] text-blue-700 border-blue-200",
    Confirmed: "bg-[#EDE7F6] text-indigo-700 border-indigo-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[13px] font-bold uppercase border ${styles[status] || "bg-slate-100"}`}>
      {status}
    </span>
  );
}