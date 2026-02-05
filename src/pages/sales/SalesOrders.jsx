import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../../api/axios";

const TABS = [
  { key: "ALL", label: "All" },
  { key: "PendingSalesApproval", label: "Pending" },
  { key: "APPROVED", label: "Approved" }, // Custom key to catch multiple states
  
  { key: "Delivered", label: "Delivered" },
  { key: "Cancelled", label: "Rejected" },
];

export default function SalesOrders() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState(location.state?.tab || "ALL");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // NEW: Status Filter state
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectOrderId, setRejectOrderId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

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
    try {
      await api.put(`/sales/orders/${orderId}/approve`);
      loadOrders();
    } catch (err) {
      alert("Approval failed");
    }
  };

  const openRejectModal = (orderId) => {
    setRejectOrderId(orderId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const submitReject = async () => {
    try {
      await api.post(`/sales/cancel/${rejectOrderId}`, { reason: rejectReason });
      setShowRejectModal(false);
      loadOrders();
    } catch (err) {
      console.error("Reject failed", err);
    }
  };

const filteredOrders = useMemo(() => {
  return orders.filter(o => {

    /* 1️⃣ TAB FILTERING */
    if (activeTab === "PendingSalesApproval" && o.status !== "PendingSalesApproval") {
      return false;
    }

    if (activeTab === "Cancelled" && o.status !== "Cancelled") {
      return false;
    }

    if (activeTab === "Delivered" && o.status !== "Delivered") {
      return false;
    }

    if (activeTab === "APPROVED") {
      const approvedStatuses = [
        "PendingWarehouseApproval",
        "Confirmed",
        "Dispatched",
        "Delivered",
      ];
      if (!approvedStatuses.includes(o.status)) {
        return false;
      }
    }

    /* 2️⃣ STATUS DROPDOWN FILTER (TOP RIGHT) */
    if (statusFilter !== "ALL" && o.status !== statusFilter) {
      return false;
    }

    /* 3️⃣ SEARCH FILTER (TOP RIGHT) */
    const term = search.toLowerCase().trim();
    if (term) {
      const company = o.customer?.companyName?.toLowerCase() || "";
const orderId = o.orderId?.toString() || "";

const hasProductCode = o.items?.some(i =>
  i.productCode?.toLowerCase().includes(term)
);

if (!company.includes(term) && !orderId.includes(term) && !hasProductCode) {
  return false;
}

    }

    return true;
  });
}, [orders, activeTab, statusFilter, search]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-[#F4F7F9]">
        <div className="w-8 h-8 border-4 border-[#009688] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-[#F4F7F9] min-h-screen">
      {/* HEADER & SEARCH/FILTER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#2A334E]">Orders Management</h2>
        
        <div className="flex items-center gap-3">
          {/* Status Filter Dropdown */}
          <div className="bg-white border border-gray-200 rounded-xl px-2">
            <select
  disabled={activeTab === "PendingSalesApproval"}
  value={statusFilter}
  onChange={(e) => setStatusFilter(e.target.value)}
  className={`py-2 text-xs font-bold bg-transparent outline-none
    ${activeTab === "PendingSalesApproval"
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer text-[#718096]"
    }`}
>

              <option value="ALL">All Status</option>
              <option value="PendingSalesApproval">Pending</option>

              <option value="Dispatched">Dispatched</option>
              
              <option value="PendingWarehouseApproval">Waiting Warehouse</option>

              
            </select>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718096] w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-[#009688]/20 transition-all"
              placeholder="Search Company or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => { setActiveTab(t.key); setStatusFilter("ALL"); }}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap ${
              activeTab === t.key
                ? "bg-[#009688] text-white shadow-sm"
                : "text-[#718096] hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-[#718096] text-sm">No orders found matching your selection</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <OrderCard key={order.orderId} order={order} onApprove={approve} onReject={openRejectModal} />
          ))
        )}
      </div>

      {/* REJECT MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="text-md font-bold text-[#2A334E] mb-4">Reason for Rejection</h3>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
              className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:border-[#009688] outline-none"
              placeholder="Why is this order being cancelled?"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-xs font-bold text-gray-500">Cancel</button>
              <button disabled={!rejectReason.trim()} onClick={submitReject} className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-bold">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderCard({ order, onApprove, onReject }) {
  const showActions = order.status === "PendingSalesApproval";
  const items = Array.isArray(order.items) ? order.items : [];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-3 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-[#2A334E]">#{order.orderId}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              {new Date(order.orderDate).toLocaleDateString()}
            </span>
            <StatusBadge status={order.status} />
          </div>
          {/* REJECTION REASON (ONLY FOR REJECTED ORDERS) */}
{order.status === "Cancelled" && order.rejectedReason && (
  <div className="mb-4 bg-red-50 border border-red-100 rounded-lg p-3">
    <p className="text-[10px] font-bold text-red-600 uppercase tracking-wide">
      Rejection Reason
    </p>
    <p className="text-xs text-red-700 mt-1 leading-snug">
      {order.rejectedReason}
    </p>
  </div>
)}

          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-[9px] text-gray-400 font-bold uppercase">Amount</span>
              <span className="text-sm font-bold text-[#2A334E]">₹{order.totalAmount}</span>
            </div>
            {showActions && (
              <div className="flex gap-2">
                <button onClick={() => onReject(order.orderId)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <button onClick={() => onApprove(order.orderId)} className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-4">
            <p className="text-xs font-bold text-[#2A334E] uppercase tracking-tight">
              {order.customer?.companyName || "MEDICO AID"}
            </p>
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              {order.customer?.phoneNumber}
            </p>
          </div>

          <div className="md:col-span-8">
            <div className="bg-gray-50 rounded-lg px-3 py-1.5 space-y-0.5">
              {items.map((item, idx) => (
  <div
    key={idx}
    className="flex justify-between items-center py-1"
  >
    {/* Product Name */}
    <div className="flex flex-col">
  <span className="text-sm font-semibold text-[#2A334E] truncate max-w-[240px]">
    {item.productName}
  </span>
  <span className="text-[10px] font-mono text-gray-400">
    {item.productCode}
  </span>
</div>


    {/* Size & Quantity */}
    <div className="flex items-center gap-4">
      <span className="text-xs font-semibold text-gray-500">
        {item.size || "M"}
      </span>
      <span className="text-sm font-bold text-[#009688]">
        ×{item.quantity}
      </span>
    </div>
  </div>
))}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    PendingSalesApproval: { bg: "bg-amber-100", text: "text-amber-700", label: "PENDING" },
    Cancelled: { bg: "bg-red-100", text: "text-red-700", label: "REJECTED" },
    PendingAdminApproval: { bg: "bg-blue-100", text: "text-blue-700", label: "APPROVED" },
    Confirmed: { bg: "bg-blue-50", text: "text-blue-600", label: "CONFIRMED" },
    Processing: { bg: "bg-indigo-50", text: "text-indigo-600", label: "PROCESSING" },
    Shipped: { bg: "bg-purple-100", text: "text-purple-700", label: "SHIPPED" },
    Dispatched: { bg: "bg-purple-100", text: "text-purple-700", label: "DISPATCHED" },
    Delivered: { bg: "bg-gray-200", text: "text-gray-600", label: "DELIVERED" },
  }[status] || { bg: "bg-gray-100", text: "text-gray-600", label: status?.toUpperCase() };

  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}