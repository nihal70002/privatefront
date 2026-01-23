import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/axios";

const TABS = [
  { key: "ALL", label: "All Orders" },
  { key: "PendingSalesApproval", label: "Pending" },
  { key: "PendingAdminApproval", label: "Approved" },
  { key: "Cancelled", label: "Rejected" },
  { key: "Confirmed", label: "Completed" },
];

export default function SalesOrders() {
  const location = useLocation();

  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState(location.state?.tab || "ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
const [rejectReason, setRejectReason] = useState("");
const [rejectOrderId, setRejectOrderId] = useState(null);


  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const loadOrders = async () => {
    try {
      const res = await api.get("/sales/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const approve = async (orderId) => {
    await api.put(`/sales/orders/${orderId}/approve`);
    loadOrders();
  };

 const openRejectModal = (orderId) => {
  setRejectOrderId(orderId);
  setRejectReason("");
  setShowRejectModal(true);
};

const submitReject = async () => {
  try {
    await api.post(`/sales/cancel/${rejectOrderId}`, {
      reason: rejectReason
    });
    setShowRejectModal(false);
    loadOrders();
  } catch (err) {
    console.error("Reject failed", err);
  }
};



  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => activeTab === "ALL" || o.status === activeTab)
      .filter(o =>
        (o.customer?.companyName || "")
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [orders, activeTab, search]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-[#F4F7F9]">
        <div className="text-[#718096] text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-[#F4F7F9] min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-[#2A334E]">Sales Orders</h2>
        <div className="relative w-80">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718096] w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#4A86F7]/30 focus:border-[#4A86F7] text-sm transition-all outline-none text-[#2A334E] placeholder-[#718096]"
            placeholder="Search by company name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            type="text"
          />
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 mb-8 bg-white rounded-2xl p-2 shadow-sm">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
              activeTab === t.key
                ? "bg-[#4A86F7] text-white shadow-lg shadow-[#4A86F7]/30"
                : "text-[#718096] hover:text-[#2A334E] hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ORDERS */}
      <div className="space-y-5">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <svg className="w-16 h-16 mx-auto text-[#718096] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-[#718096] text-lg">No orders found</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <OrderCard
  key={order.orderId}
  order={order}
  onApprove={approve}
  onReject={openRejectModal}
/>

          ))
        )}
      </div>

      {/* PAGINATION */}
      {filteredOrders.length > 0 && (
        <div className="mt-8 flex items-center justify-between pt-6">
          <p className="text-sm text-[#718096] font-medium">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex gap-2">
            <button className="px-5 py-2.5 text-sm font-semibold text-[#718096] bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button className="px-5 py-2.5 text-sm font-semibold text-white bg-[#4A86F7] rounded-xl shadow-md shadow-[#4A86F7]/30 hover:bg-[#3a76e7] transition-all">
              Next
            </button>
            
          </div>
        </div>
      )}
      {showRejectModal && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-[420px] shadow-xl">
      <h3 className="text-lg font-bold text-[#2A334E] mb-4">
        Reason for Rejection
      </h3>

      <textarea
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
        rows={4}
        className="w-full border border-gray-300 rounded-xl p-3 text-sm"
        placeholder="Enter reason for cancelling this order..."
      />

      <div className="flex justify-end gap-3 mt-5">
        <button
          onClick={() => setShowRejectModal(false)}
          className="px-4 py-2 text-gray-600 font-semibold"
        >
          Cancel
        </button>

        <button
          disabled={!rejectReason.trim()}
          onClick={submitReject}
          className="px-5 py-2 bg-red-600 text-white rounded-xl font-semibold disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}


/* ================= ORDER CARD ================= */

function OrderCard({ order, onApprove, onReject }) {
  const showActions = order.status === "PendingSalesApproval";
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm hover:shadow-md transition-all border border-gray-100">
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-[#2A334E]">
              Order #{order.orderId}
            </h3>
            <span className="text-gray-300">|</span>
            <span className="text-sm font-medium text-[#718096]">
              {new Date(order.orderDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <p className="text-[#2A334E] font-semibold text-lg mb-2">
            {order.customer?.companyName || "—"}
          </p>

          <div className="flex items-center gap-2 text-[#718096] text-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{order.customer?.phoneNumber || "—"}</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="text-right">
          <StatusBadge status={order.status} />

          {/* ✅ REJECTION REASON */}
          {order.status === "Cancelled" && order.rejectedReason && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-left">
              <p className="text-red-600 font-semibold mb-1">
                Rejection Reason
              </p>
              <p className="text-red-700">
                {order.rejectedReason}
              </p>
            </div>
          )}

          <div className="mt-4 bg-[#F4F7F9] rounded-xl px-5 py-3">
            <p className="text-xs text-[#718096] uppercase font-semibold mb-1">
              Total Amount
            </p>
            <p className="text-2xl font-bold text-[#2A334E]">
              ₹{order.totalAmount}
            </p>
          </div>
        </div>
      </div>

      {/* ITEMS TABLE */}
      {items.length > 0 && (
        <div className="overflow-hidden border border-gray-100 rounded-xl mb-5">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F4F7F9]">
              <tr>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#718096]">
                  Product Name
                </th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#718096]">
                  Specification/Size
                </th>
                <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-[#718096] text-center">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((i, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-5 py-4 font-medium text-[#2A334E]">
                    {i.productName}
                  </td>
                  <td className="px-5 py-4">
                    <span className="bg-[#4A86F7]/10 text-[#4A86F7] px-3 py-1.5 rounded-lg text-xs font-semibold">
                      {i.size || "Standard"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-center font-semibold text-[#2A334E]">
                    {i.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ACTION BUTTONS */}
      {showActions && (
        <div className="flex justify-end gap-3 mt-5 pt-5 border-t border-gray-100">
          <button
            onClick={() => onReject(order.orderId)}
            className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-all"
          >
            Reject
          </button>
          <button
            onClick={() => onApprove(order.orderId)}
            className="px-6 py-2.5 bg-[#48BB78] hover:bg-[#38a169] text-white rounded-xl font-semibold shadow-md shadow-[#48BB78]/30 transition-all"
          >
            Approve
          </button>
        </div>
      )}
    </div>
  );
}


function StatusBadge({ status }) {
  const statusConfig = {
    PendingSalesApproval: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500",
      animated: true
    },
    Cancelled: {
  bg: "bg-red-50",
  text: "text-red-600",
  dot: "bg-red-500",
  animated: false
},

    PendingAdminApproval: {
      bg: "bg-blue-50",
      text: "text-[#4A86F7]",
      dot: "bg-[#4A86F7]",
      animated: true
    },
    
    Confirmed: {
      bg: "bg-green-50",
      text: "text-[#48BB78]",
      dot: "bg-[#48BB78]",
      animated: false
    },
  };

  const config = statusConfig[status] || {
    bg: "bg-gray-50",
    text: "text-[#718096]",
    dot: "bg-gray-400",
    animated: false
  };

  const label = status?.replace(/([A-Z])/g, " $1").trim().toUpperCase() || "UNKNOWN";

  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot} mr-2 ${config.animated ? 'animate-pulse' : ''}`}></span>
      {label}
    </span>
  );
}