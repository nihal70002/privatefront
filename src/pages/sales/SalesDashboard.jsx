import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function SalesDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    customers: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [ordersRes, customersRes] = await Promise.all([
        api.get("/sales/orders"),
        api.get("/sales/customers"),
      ]);

      const orders = ordersRes.data;
      const approvedStatuses = ["PendingAdminApproval", "PendingWarehouseApproval", "Confirmed", "Dispatched", "Delivered"];

      setStats({
        total: orders.length,
        pending: orders.filter(o => o.status === "PendingSalesApproval").length,
        approved: orders.filter(o => approvedStatuses.includes(o.status)).length,
        rejected: orders.filter(o => o.status === "Cancelled" || o.status === "RejectedBySales").length,
        customers: customersRes.data.length,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh] bg-[#F4F7F9]">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-x-hidden bg-[#F4F7F9] pt-16 md:pt-0">
      {/* PAGE HEADER */}
      <header className="flex flex-col gap-4 px-4 sm:px-8 py-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#2A334E]">
            Sales Executive Dashboard
          </h2>
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-row w-full sm:w-auto gap-3">
          <button
            onClick={() => navigate("/sales/customers/create")}
            className="flex items-center justify-center gap-2 bg-[#48BB78] text-white px-3 sm:px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm"
          >
            <span>+ Customer</span>
          </button>
          <button
            onClick={() => navigate("/sales/orders", { state: { tab: "ALL" } })}
            className="flex items-center justify-center gap-2 bg-[#2A334E] text-white px-3 sm:px-6 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-sm"
          >
            <span>View Orders</span>
          </button>
        </div>
      </header>

      {/* STATS ROW: Updated to grid-cols-2 for mobile */}
      <div className="px-4 sm:px-8 pb-8 grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-5">
        <StatCard 
          label="Pending" 
          value={stats.pending} 
          color="amber" 
          percent="+2%" 
          onClick={() => navigate("/sales/orders", { state: { tab: "" } })} 
        />
        <StatCard 
          label="Approved" 
          value={stats.approved} 
          color="green" 
          percent="+15%" 
          onClick={() => navigate("/sales/orders", { state: { tab: "APPROVED" } })} 
        />
        <StatCard 
          label="Rejected" 
          value={stats.rejected} 
          color="red" 
          percent="-1%" 
          onClick={() => navigate("/sales/orders", { state: { tab: "Cancelled" } })} 
        />
        <StatCard 
          label="Total Orders" 
          value={stats.total} 
          color="blue" 
          percent="+8%" 
          onClick={() => navigate("/sales/orders", { state: { tab: "ALL" } })} 
        />
        {/* The 5th card spans full width on mobile to keep the 2x2 + 1 layout, or stays in grid */}
        <StatCard 
          label="Customers" 
          value={stats.customers} 
          color="emerald" 
          percent="+5%" 
          onClick={() => navigate("/sales/customers")} 
        />
      </div>

      {/* RECENT ORDERS SECTION */}
      <div className="px-4 sm:px-8 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h3 className="text-lg font-bold text-[#2A334E]">Recent Orders</h3>
            <button
              onClick={() => navigate("/sales/orders", { state: { tab: "ALL" } })}
              className="text-[#4A86F7] text-sm font-semibold"
            >
              View All
            </button>
          </div>

          {/* Table Container: overflow-x-auto handles the horizontal scroll inside the card */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-[#F4F7F9]">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#718096]">Order #</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#718096]">Company</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#718096]">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-[#718096] text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map(o => (
                  <tr key={o.orderId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold text-sm text-[#2A334E]">#ORD-{o.orderId}</td>
                    <td className="px-6 py-4 text-sm text-[#2A334E] truncate max-w-[120px]">
                      {o.customer.companyName}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400">•••</button>
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

/* ================= HELPER COMPONENTS ================= */

function StatCard({ label, value, color, percent, onClick }) {
  const colors = {
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-red-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 sm:p-6 rounded-2xl flex flex-col gap-3 shadow-sm border border-gray-100 cursor-pointer active:scale-95 transition-all"
    >
      <div className="flex items-center justify-between">
        <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center`}>
          <div className="w-5 h-5 border-2 border-current rounded-sm opacity-80" />
        </div>
        <span className={`text-[10px] font-bold ${colors[color]} px-2 py-1 rounded-full`}>
          {percent}
        </span>
      </div>
      <div>
        <p className="text-[#718096] text-[11px] sm:text-sm font-medium">{label}</p>
        <p className="text-xl sm:text-3xl font-bold text-[#2A334E]">{value}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const statusConfig = {
    PendingSalesApproval: { bg: "bg-amber-50", text: "text-amber-700" },
    PendingAdminApproval: { bg: "bg-blue-50", text: "text-[#4A86F7]" },
    RejectedBySales: { bg: "bg-red-50", text: "text-red-600" },
    Confirmed: { bg: "bg-green-50", text: "text-[#48BB78]" },
    Delivered: { bg: "bg-gray-100", text: "text-[#718096]" }
  };
  const config = statusConfig[status] || statusConfig.Delivered;
  const label = status?.replace(/([A-Z])/g, " $1").trim() || "Unknown";
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-bold ${config.bg} ${config.text}`}>
      {label}
    </span>
  );
}