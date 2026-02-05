import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Eye, Search, Calendar, Filter, Package, TrendingUp, AlertCircle } from "lucide-react";

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
      Pending: "bg-amber-100 text-amber-800 border-amber-200",
      Delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
      Rejected: "bg-rose-100 text-rose-800 border-rose-200",
      Processing: "bg-blue-100 text-blue-800 border-blue-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "Pending").length,
    delivered: orders.filter(o => o.status === "Delivered").length,
    rejected: orders.filter(o => o.status === "Rejected").length,
    totalAmount: orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Package className="w-7 h-7 text-white" />
              </div>
              Today's Orders
            </h1>
            <p className="text-gray-600 mt-1 text-sm">
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
          <Link 
            to="/warehouse/orders"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <Eye className="w-4 h-4" />
            View All Orders
          </Link>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Package className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Delivered</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.delivered}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Rejected</p>
                <p className="text-2xl font-bold text-rose-600 mt-1">{stats.rejected}</p>
              </div>
              <div className="p-3 bg-rose-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-5 shadow-md text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-indigo-100 font-medium">Total Amount</p>
                <p className="text-2xl font-bold mt-1">₹{stats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= FILTER BAR ================= */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* DATE */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Calendar className="w-4 h-4 inline mr-1" />
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* STATUS */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Delivered">Delivered</option>
                <option value="Rejected">Rejected</option>
                <option value="Processing">Processing</option>
              </select>
            </div>

            {/* SEARCH */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                <Search className="w-4 h-4 inline mr-1" />
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Order ID, Customer, Executive..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ================= ERROR STATE ================= */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            <p className="text-rose-800 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Sales Executive
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
                        <p className="text-gray-600 font-medium">Loading orders...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order, idx) => (
                    <tr 
                      key={order.id} 
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-indigo-600">
                          #{order.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {order.customerName || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {order.salesExecutive || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{order.totalAmount?.toLocaleString() || "0"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status?.replace(/([A-Z])/g, " $1").trim() || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Link
                          to={`/warehouse/orders/${order.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm hover:shadow-md"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="p-4 bg-gray-100 rounded-full">
                          <Package className="w-12 h-12 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-900 font-semibold text-lg">No orders found</p>
                          <p className="text-gray-500 text-sm mt-1">
                            Try adjusting your filters or date selection
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================= FOOTER INFO ================= */}
        {filteredOrders.length > 0 && !loading && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-sm text-gray-600 text-center">
              Showing <span className="font-semibold text-gray-900">{filteredOrders.length}</span> of{" "}
              <span className="font-semibold text-gray-900">{orders.length}</span> orders
            </p>
          </div>
        )}
      </div>
    </div>
  );
}