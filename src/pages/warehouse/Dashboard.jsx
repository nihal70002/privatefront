import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import usePendingCount from "../../hooks/usePendingCount";
import {
  Package,
  Clock,
  CheckCircle,
  AlertTriangle,
  ChevronRight,
  XCircle,
  Bell,
  RefreshCw
} from "lucide-react";

const REFRESH_INTERVAL = 30000;

export default function Dashboard() {
  const navigate = useNavigate();
  const pendingCount = usePendingCount();

  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboard = async (showLoader = false) => {
    try {
      if (showLoader) setLoading(true);
      const summaryRes = await api.get("/warehouse/dashboard/summary");
      const data = Array.isArray(summaryRes.data) && summaryRes.data.length > 0
          ? summaryRes.data[0]
          : summaryRes.data;
      setSummary(data);

      try {
        const ordersRes = await api.get("/warehouse/today-orders");
        setRecentOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
      } catch {
        setRecentOrders([]);
      }

      setLastUpdated(new Date());
      setError("");
    } catch (err) {
      setError("Unable to connect to the server.");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(true);
    const interval = setInterval(() => fetchDashboard(false), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error} onRetry={() => fetchDashboard(true)} />;

  const cards = [
    {
      title: "Total Orders",
      value: summary?.totalOrders || 0,
      icon: <Package size={20} />,
      color: "text-blue-600 bg-blue-50",
      route: "/warehouse/orders/today",
    },
    {
      title: "Pending",
      value: summary?.pending || 0,
      icon: <Clock size={20} />,
      color: "text-amber-600 bg-amber-50",
      route: "/warehouse/orders/process?status=PendingWarehouseApproval",
    },
    {
      title: "Approved",
      value: summary?.approved || 0,
      icon: <CheckCircle size={20} />,
      color: "text-emerald-600 bg-emerald-50",
      route: "/warehouse/orders/today",
    },
    {
      title: "Rejected",
      value: summary?.rejected || 0,
      icon: <XCircle size={20} />,
      color: "text-rose-600 bg-rose-50",
      route: "/warehouse/orders/today",
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen font-sans">
      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            {summary?.companyName || "Warehouse Control"}
          </h1>
          <p className="text-gray-500 text-xs md:text-sm font-medium">
            Live inventory & order overview
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          {lastUpdated && (
            <div className="text-left sm:text-right mr-2">
              <p className="text-[9px] uppercase font-black text-gray-400 leading-none">Synced</p>
              <p className="text-xs font-bold text-gray-600">{lastUpdated.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
            </div>
          )}
          
          <button
            onClick={() => navigate("/warehouse/orders/pending")}
            className="group relative p-2.5 bg-white border border-gray-200 rounded-xl hover:border-blue-500 transition-all shadow-sm"
          >
            <Bell size={20} className="text-gray-600 group-hover:text-blue-600" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-4.5 px-1 text-[10px] font-black text-white bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ================= SUMMARY CARDS (2x2 Grid) ================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.route)}
            className="group bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer active:scale-95"
          >
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${card.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-widest font-black leading-none">
              {card.title}
            </p>
            <h3 className="text-xl md:text-3xl font-black text-gray-900 mt-2">
              {card.value}
            </h3>
          </div>
        ))}
      </div>

      {/* ================= RECENT ORDERS TABLE ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
          <button
            onClick={() => navigate("/warehouse/orders/today")}
            className="text-xs text-blue-600 font-black uppercase tracking-wider flex items-center gap-1 hover:text-blue-800"
          >
            View All <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-4 md:px-6 py-4">Order ID</th>
                <th className="px-6 py-4 hidden sm:table-cell">Executive</th>
                <th className="px-4 md:px-6 py-4">Amount</th>
                <th className="px-4 md:px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group cursor-pointer" onClick={() => navigate(`/warehouse/orders/${order.id}`)}>
                    <td className="px-4 md:px-6 py-4">
                      <span className="font-bold text-gray-900">#{order.id.toString().slice(-5)}</span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <p className="font-medium text-gray-600 truncate max-w-[120px]">{order.salesExecutive}</p>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <p className="font-bold text-gray-900 whitespace-nowrap">₹{order.totalAmount?.toLocaleString()}</p>
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      <div className="flex justify-center">
                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tight whitespace-nowrap ${
                          order.status === "Pending" ? "bg-amber-50 text-amber-600 border border-amber-100" : 
                          order.status === "Approved" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : 
                          "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}>
                          {order.status?.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-16 text-center text-gray-400 text-sm font-medium italic">
                    No orders recorded for today yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto animate-pulse">
      <div className="h-10 bg-gray-200 rounded-xl w-1/3 mb-10"></div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
        ))}
      </div>
      <div className="h-64 bg-gray-100 rounded-2xl"></div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">Sync Error</h3>
        <p className="text-sm text-gray-500 mb-8">{message}</p>
        <button
          onClick={onRetry}
          className="flex items-center gap-2 mx-auto px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg"
        >
          <RefreshCw size={16} /> Retry Sync
        </button>
      </div>
    </div>
  );
}