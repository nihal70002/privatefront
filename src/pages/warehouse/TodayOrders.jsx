import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Eye, Search, Calendar, Filter, Package, TrendingUp, AlertCircle, ChevronRight } from "lucide-react";

export default function TodayOrders() {
  const today = new Date().toISOString().split("T")[0];
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState(today);

  useEffect(() => {
    fetchOrders();
  }, [date]);

  useEffect(() => {
    applyFilters();
  }, [orders, statusFilter, search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/warehouse/today-orders", {
        params: { date }
      });
      setOrders(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load today's orders");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let data = [...orders];
    if (statusFilter !== "All") {
      data = data.filter(o => o.status === statusFilter);
    }
    if (search) {
      data = data.filter(o =>
        o.id.toString().includes(search) ||
        o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        o.salesExecutive?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredOrders(data);
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: "bg-amber-50 text-amber-600 border-amber-100",
      Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
      Rejected: "bg-rose-50 text-rose-600 border-rose-100",
      Processing: "bg-blue-50 text-blue-600 border-blue-100"
    };
    return colors[status] || "bg-gray-50 text-gray-600 border-gray-100";
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "Pending").length,
    delivered: orders.filter(o => o.status === "Delivered").length,
    rejected: orders.filter(o => o.status === "Rejected").length,
    totalAmount: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Today's Orders
            </h1>
            <p className="text-slate-500 text-xs md:text-sm font-medium">
              {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <Link 
            to="/warehouse/orders"
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-indigo-600 rounded-xl hover:bg-slate-50 transition-all text-sm font-bold shadow-sm"
          >
            <Eye size={16} />
            History
          </Link>
        </div>

        {/* ================= STATS CARDS (2x2 Grid + Full Width) ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
            <p className="text-xl md:text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Pending</p>
            <p className="text-xl md:text-2xl font-black text-slate-900 mt-1">{stats.pending}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Delivered</p>
            <p className="text-xl md:text-2xl font-black text-slate-900 mt-1">{stats.delivered}</p>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Rejected</p>
            <p className="text-xl md:text-2xl font-black text-slate-900 mt-1">{stats.rejected}</p>
          </div>

          <div className="col-span-2 lg:col-span-1 bg-indigo-600 rounded-2xl p-4 shadow-md text-white">
            <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">Total Revenue</p>
            <p className="text-xl md:text-2xl font-black mt-1">₹{stats.totalAmount.toLocaleString()}</p>
          </div>
        </div>

        {/* ================= FILTERS ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-slate-100 bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full border border-slate-100 bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all appearance-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Delivered">Delivered</option>
              <option value="Rejected">Rejected</option>
              <option value="Processing">Processing</option>
            </select>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-slate-100 bg-slate-50 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500/20 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Order</th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:table-cell">Executive</th>
                  <th className="px-4 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                  <th className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-4 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/80 transition-colors group cursor-pointer" onClick={() => window.location.href=`/warehouse/orders/${order.id}`}>
                      <td className="px-4 py-4">
                        <span className="text-sm font-black text-slate-900">#{order.id.toString().slice(-4)}</span>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-sm font-bold text-slate-700 truncate max-w-[100px] sm:max-w-none">{order.customerName || "Walk-in"}</p>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-xs font-medium text-slate-500">{order.salesExecutive}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="text-sm font-black text-slate-900">₹{order.totalAmount?.toLocaleString()}</span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tight border ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex justify-center">
                          <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center">
                      <p className="text-sm font-bold text-slate-400 italic">No orders found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}