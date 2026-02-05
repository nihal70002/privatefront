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

     const approvedStatuses = [
  "PendingAdminApproval",
  "PendingWarehouseApproval",
  "Confirmed",
  "Dispatched",
  "Delivered",
];

setStats({
  total: orders.length,

  // Waiting for sales action
  pending: orders.filter(
    o => o.status === "PendingSalesApproval"
  ).length,

  // Approved by sales (at any later stage)
  approved: orders.filter(
    o => approvedStatuses.includes(o.status)
  ).length,

  // Rejected by sales
  rejected: orders.filter(
    o => o.status === "Cancelled" || o.status === "RejectedBySales"
  ).length,

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
      <div className="p-8 flex items-center justify-center min-h-screen bg-[#F4F7F9]">
        <div className="text-[#718096] text-lg">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-[#F4F7F9]">
      {/* PAGE HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-4 p-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#2A334E]">
            Sales Executive Dashboard
          </h2>
          
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/sales/customers/create")}
            className="flex items-center gap-2 bg-[#48BB78] hover:bg-[#38A169] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-sm shadow-[#48BB78]/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <span>Create Customer</span>
          </button>
          <button
            onClick={() => navigate("/sales/orders", { state: { tab: "ALL" } })}
            className="flex items-center gap-2 bg-[#2A334E] hover:bg-[#1F2937] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>View Orders</span>
          </button>
        </div>
      </header>

      {/* STATS ROW */}
      <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {/* Pending Approval */}
        <div
          onClick={() => navigate("/sales/orders", { state: { tab: "" } })}
          className="bg-white p-6 rounded-2xl flex flex-col gap-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
              +2%
            </span>
          </div>
          <div>
            <p className="text-[#718096] text-sm font-medium mb-1">
              Pending Approval
            </p>
            <p className="text-3xl font-bold text-[#2A334E]">
              {stats.pending}
            </p>
          </div>
        </div>

        {/* Approved by Sales */}
        <div
          onClick={() => navigate("/sales/orders", { state: { tab: "APPROVED" } })}
          className="bg-white p-6 rounded-2xl flex flex-col gap-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-[#48BB78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-[#48BB78] bg-green-50 px-2.5 py-1 rounded-full">
              +15%
            </span>
          </div>
          <div>
            <p className="text-[#718096] text-sm font-medium mb-1">
              Approved by Sales
            </p>
            <p className="text-3xl font-bold text-[#2A334E]">
              {stats.approved}
            </p>
          </div>
        </div>

        {/* Rejected by Sales */}
        <div
          onClick={() => navigate("/sales/orders", { state: { tab: "Cancelled" } })}
          className="bg-white p-6 rounded-2xl flex flex-col gap-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
              -1%
            </span>
          </div>
          <div>
            <p className="text-[#718096] text-sm font-medium mb-1">
              Rejected by Sales
            </p>
            <p className="text-3xl font-bold text-[#2A334E]">
              {stats.rejected}
            </p>
          </div>
        </div>

        {/* Total Orders */}
        <div
          onClick={() => navigate("/sales/orders", { state: { tab: "ALL" } })}
          className="bg-white p-6 rounded-2xl flex flex-col gap-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-[#4A86F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-[#4A86F7] bg-blue-50 px-2.5 py-1 rounded-full">
              +8%
            </span>
          </div>
          <div>
            <p className="text-[#718096] text-sm font-medium mb-1">
              Total Orders
            </p>
            <p className="text-3xl font-bold text-[#2A334E]">
              {stats.total}
            </p>
          </div>
        </div>

        {/* Customers */}
        <div
          onClick={() => navigate("/sales/customers")}
          className="bg-white p-6 rounded-2xl flex flex-col gap-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
              +5%
            </span>
          </div>
          <div>
            <p className="text-[#718096] text-sm font-medium mb-1">
              Customers
            </p>
            <p className="text-3xl font-bold text-[#2A334E]">
              {stats.customers}
            </p>
          </div>
        </div>
      </div>

      {/* RECENT ORDERS SECTION */}
      <div className="px-8 pb-12">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h3 className="text-xl font-bold text-[#2A334E]">Recent Orders</h3>
            <button
              onClick={() => navigate("/sales/orders", { state: { tab: "ALL" } })}
              className="text-[#4A86F7] text-sm font-semibold hover:underline"
            >
              View All
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="px-6 py-12 text-center text-[#718096]">
              No orders found
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#F4F7F9]">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096]">
                      Order #
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096]">
                      Company
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096]">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096]">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map(o => (
                    <tr key={o.orderId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[#2A334E]">
                        #ORD-{o.orderId}
                      </td>
                      <td className="px-6 py-4 text-[#2A334E]">
                        {o.customer.companyName}
                      </td>
                      <td className="px-6 py-4 text-[#718096]">
                        {o.customer.phoneNumber}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={o.status} />
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-[#718096] hover:text-[#4A86F7] transition-colors">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= STATUS BADGE ================= */

function StatusBadge({ status }) {
  const statusConfig = {
    PendingSalesApproval: {
      bg: "bg-amber-50",
      text: "text-amber-700"
    },
    PendingAdminApproval: {
      bg: "bg-blue-50",
      text: "text-[#4A86F7]"
    },
    RejectedBySales: {
      bg: "bg-red-50",
      text: "text-red-600"
    },
    Confirmed: {
      bg: "bg-green-50",
      text: "text-[#48BB78]"
    },
    Delivered: {
      bg: "bg-gray-100",
      text: "text-[#718096]"
    }
  };

  const config = statusConfig[status] || statusConfig.Delivered;
  const label = status?.replace(/([A-Z])/g, " $1").trim() || "Unknown";

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold ${config.bg} ${config.text}`}>
      {label}
    </span>
  );
}