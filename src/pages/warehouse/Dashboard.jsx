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
      icon: <Package size={22} />,
      color: "text-blue-600 bg-blue-50",
      route: "/warehouse/orders/today",
    },
    {
      title: "Pending Orders",
      value: summary?.pending || 0,
      icon: <Clock size={22} />,
      color: "text-amber-600 bg-amber-50",
      route: "/warehouse/orders/process?status=PendingWarehouseApproval",
    },
    {
      title: "Approved Orders",
      value: summary?.approved || 0,
      icon: <CheckCircle size={22} />,
      color: "text-emerald-600 bg-emerald-50",
      route: "/warehouse/orders/today",
    },
    {
      title: "Rejected Orders",
      value: summary?.rejected || 0,
      icon: <XCircle size={22} />,
      color: "text-rose-600 bg-rose-50",
      route: "/warehouse/orders/today",
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="mb-6 md:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
            {summary?.companyName || "Warehouse Control"}
          </h1>
          <p className="text-gray-500 text-xs md:sm font-medium mt-1">
            Live inventory & order overview
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3">
          {lastUpdated && (
            <div className="text-left sm:text-right mr-2">
              <p className="text-[10px] uppercase font-bold text-gray-400 leading-none">Last Synced</p>
              <p className="text-xs md:text-sm font-semibold text-gray-600">{lastUpdated.toLocaleTimeString()}</p>
            </div>
          )}
          
          <button
            onClick={() => navigate("/warehouse/orders/pending")}
            className="group relative p-2 md:p-3 bg-white border border-gray-200 rounded-xl hover:border-blue-500 transition-all shadow-sm"
          >
            <Bell size={20} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] md:min-w-[20px] h-4 md:h-5 px-1 md:px-1.5 text-[9px] md:text-[11px] font-black text-white bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                {pendingCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
        {cards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => navigate(card.route)}
            className="group bg-white rounded-2xl border border-gray-100 p-4 md:p-6 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-[11px] md:text-xs text-gray-500 uppercase tracking-widest font-bold truncate">
                  {card.title}
                </p>
                <h3 className="text-2xl md:text-4xl font-black text-gray-900 mt-1">
                  {card.value}
                </h3>
              </div>
              <div className={`shrink-0 p-3 md:p-4 rounded-xl ${card.color} group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= RECENT ORDERS TABLE ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-50 flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <h2 className="text-lg md:text-xl font-bold text-gray-900">Recent Orders</h2>
          <button
            onClick={() => navigate("/warehouse/orders/today")}
            className="w-full md:w-auto px-4 py-2 text-sm bg-gray-50 text-blue-600 font-bold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-1"
          >
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] md:text-[11px] uppercase font-black tracking-widest">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Executive</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <span className="font-black text-gray-900 group-hover:text-blue-600 transition-colors">#{order.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-700">{order.salesExecutive}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-black text-gray-900">₹{order.totalAmount?.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <span
  className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-tight whitespace-nowrap ${
    order.status === "Pending"
      ? "bg-amber-100 text-amber-700"
      : order.status === "Approved"
      ? "bg-green-100 text-green-700"
      : order.status === "Rejected"
      ? "bg-red-100 text-red-700"
      : order.status === "Dispatched"
      ? "bg-blue-100 text-blue-700"
      : order.status === "Delivered"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-gray-100 text-gray-700"
  }`}
>
  {order.status?.replace(/([A-Z])/g, " $1").trim()}
</span>

                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-8 py-12 md:py-16 text-center text-gray-400 font-medium italic">
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
      <div className="h-10 md:h-12 bg-gray-200 rounded-xl w-1/3 mb-10"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 md:h-40 bg-gray-200 rounded-2xl"></div>
        ))}
      </div>
      <div className="h-64 md:h-96 bg-gray-100 rounded-2xl"></div>
    </div>
  );
}

function ErrorState({ message, onRetry }) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 text-center">
      <div className="max-w-md w-full">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={32} />
        </div>
        <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">Connection Error</h3>
        <p className="text-sm md:text-base text-gray-500 mb-8 px-4">{message}</p>
        <button
          onClick={onRetry || (() => window.location.reload())}
          className="flex items-center gap-2 mx-auto px-6 md:px-8 py-2 md:py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg"
        >
          <RefreshCw size={16} /> Retry Connection
        </button>
      </div>
    </div>
  );
}