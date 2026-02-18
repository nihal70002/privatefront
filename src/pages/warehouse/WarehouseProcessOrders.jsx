import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { 
  ChevronDown, 
  ChevronUp, 
  Package, 
  Search, 
  Check, 
  X as CloseIcon, 
  Truck, 
  CheckCircle 
} from "lucide-react";

const TABS = [
  { key: "ALL", label: "All" },
  { key: "PendingSalesApproval", label: "Sales Pending" },
  { key: "PendingWarehouseApproval", label: "Wh Pending" },
  { key: "Confirmed", label: "Confirmed" },
  { key: "Dispatched", label: "Dispatched" },
  { key: "Delivered", label: "Delivered" },
];

export default function WarehouseProcessOrders() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState(searchParams.get("status") || "ALL");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const status = searchParams.get("status");
    setActiveTab(status || "ALL");
  }, [searchParams]);

  const loadOrders = async () => {
    try {
      const res = await api.get("/warehouse/orders");
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const doAction = async (orderId, action) => {
    try {
      setUpdatingId(orderId);
      await api.post(`/warehouse/orders/${orderId}/${action}`);
      toast.success(`Order ${action} successful`);
      loadOrders();
    } catch (err) {
      toast.error("Action failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = useMemo(() => {
    const PROCESS_STATUSES = ["PendingSalesApproval", "PendingWarehouseApproval", "Confirmed", "Dispatched", "Delivered"];
    return orders.filter(o => {
      if (activeTab === "ALL") {
        if (!PROCESS_STATUSES.includes(o.status)) return false;
      } else if (o.status !== activeTab) {
        return false;
      }
      if (statusFilter !== "ALL" && activeTab !== "PendingWarehouseApproval" && activeTab !== "PendingSalesApproval" && o.status !== statusFilter) {
        return false;
      }
      const term = search.toLowerCase();
      return (
  (o.customer?.companyName || "").toLowerCase().includes(term) ||
  (o.customer?.phoneNumber || "").toLowerCase().includes(term) ||
  o.orderId?.toString().includes(term)
);

    });
  }, [orders, activeTab, search, statusFilter]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    setStatusFilter("ALL");
    key === "ALL" ? setSearchParams({}) : setSearchParams({ status: key });
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-[#F4F7F9]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto bg-[#F4F7F9] min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-[#2A334E]">Process Orders</h2>
        
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="bg-white border border-gray-200 rounded-xl px-2 w-full sm:w-auto">
            <select
              disabled={activeTab === "PendingWarehouseApproval" || activeTab === "PendingSalesApproval"}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2 text-xs font-bold bg-transparent outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-[#718096]"
            >
              <option value="ALL">All Status</option>
              <option value="PendingSalesApproval">Sales Pending</option>
              <option value="PendingWarehouseApproval">Wh Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#718096] w-4 h-4" />
            <input
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-600/20 transition-all"
              placeholder="Search Company or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-1 mb-6 bg-white rounded-xl p-1 shadow-sm overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => handleTabChange(t.key)}
            className={`px-4 py-2 text-[11px] md:text-xs font-bold rounded-lg transition-all whitespace-nowrap flex-1 lg:flex-none ${
              activeTab === t.key
                ? "bg-blue-600 text-white shadow-sm"
                : "text-[#718096] hover:bg-gray-50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ORDERS LIST */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-200">
            <p className="text-[#718096] text-sm font-medium">No orders found matching your selection</p>
          </div>
        ) : (
          filteredOrders.map(order => (
            <OrderCard 
              key={order.orderId} 
              order={order} 
              onAction={doAction}
              updatingId={updatingId}
              navigate={navigate}
            />
          ))
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, onAction, updatingId, navigate }) {
  // NEW STATE FOR DROPDOWN
  const [isExpanded, setIsExpanded] = useState(false);
  
  const items = Array.isArray(order.items) ? order.items : [];
  const showActions = ["PendingWarehouseApproval", "Confirmed", "Dispatched"].includes(order.status);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className="p-4 md:p-5">
        
        {/* Card Top */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-50">
          <div className="flex items-center flex-wrap gap-2 md:gap-3">
            <span className="text-sm font-black text-[#2A334E]">#{order.orderId}</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase">
              {new Date(order.orderDate).toLocaleDateString()}
            </span>
            <StatusBadge status={order.status} />
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-left sm:text-right">
              <span className="block text-[9px] text-gray-400 font-bold uppercase tracking-tighter">Amount</span>
              <span className="text-sm font-bold text-[#2A334E]">₹{order.totalAmount?.toLocaleString()}</span>
            </div>
            
            {showActions && (
              <div className="flex gap-2">
                {order.status === "PendingWarehouseApproval" && (
                  <>
                    <button 
                      onClick={() => onAction(order.orderId, "reject")} 
                      disabled={updatingId === order.orderId}
                      className="p-2.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 disabled:opacity-50"
                    >
                      <CloseIcon size={16} />
                    </button>
                    <button 
                      onClick={() => onAction(order.orderId, "approve")} 
                      disabled={updatingId === order.orderId}
                      className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 disabled:opacity-50"
                    >
                      <Check size={16} />
                    </button>
                  </>
                )}
                {order.status === "Confirmed" && (
                  <button 
                    onClick={() => onAction(order.orderId, "dispatch")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-[11px] font-bold rounded-lg hover:bg-blue-700"
                  >
                    <Truck size={14} /> Dispatch
                  </button>
                )}
                {order.status === "Dispatched" && (
                  <button 
                    onClick={() => onAction(order.orderId, "deliver")}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-[11px] font-bold rounded-lg hover:bg-indigo-700"
                  >
                    <CheckCircle size={14} /> Mark Delivered
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card Body & Dropdown Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="lg:col-span-4">
           <p className="text-[15px] font-black text-[#2A334E] uppercase tracking-wide truncate">
  {order.customer?.companyName || "N/A"}
</p>
<p className="text-[13px] font-semibold text-gray-600 truncate">
  📞 {order.customer?.phoneNumber || "N/A"}
</p>

          </div>

          {/* THE DROPDOWN BUTTON */}
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border transition-all text-[11px] font-bold w-full lg:w-auto ${
              isExpanded 
              ? "bg-gray-100 border-gray-200 text-gray-700" 
              : "bg-white border-blue-100 text-blue-600 hover:bg-blue-50"
            }`}
          >
            <Package size={14} />
            {isExpanded ? "Hide Products" : `Show Products (${items.length})`}
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>

        {/* CONDITIONAL PRODUCTS LIST */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="bg-gray-50/80 rounded-lg p-3 space-y-2">
              {items.map((item, idx) => (
  <div
    key={idx}
    className="bg-white rounded-lg px-4 py-3 border border-gray-200 space-y-2"
  >
    {/* TOP ROW */}
    <div className="flex justify-between items-start gap-3">
      
      {/* PRODUCT NAME */}
      <div className="flex-1">
        <p className="text-[14px] font-black text-[#2A334E]">
          {item.productName || "-"}
        </p>

        {item.productCode && (
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">
            Code: {item.productCode}
          </p>
        )}
      </div>

      {/* QTY */}
      <span className="text-[14px] font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
        ×{item.quantity}
      </span>
    </div>

    {/* VARIANT DETAILS (ONLY IF EXISTS) */}
    {(item.variantSize ||
      item.class ||
      item.style ||
      item.material ||
      item.color) && (
      <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">

        {item.variantSize && (
          <span className="px-2 py-0.5 text-[11px] font-semibold bg-indigo-50 text-indigo-700 rounded-md">
            Size: {item.variantSize}
          </span>
        )}

        {item.class && (
          <span className="px-2 py-0.5 text-[11px] bg-blue-50 text-blue-700 rounded-md">
            {item.class}
          </span>
        )}

        {item.style && (
          <span className="px-2 py-0.5 text-[11px] bg-purple-50 text-purple-700 rounded-md">
            {item.style}
          </span>
        )}

        {item.material && (
          <span className="px-2 py-0.5 text-[11px] bg-amber-50 text-amber-700 rounded-md">
            {item.material}
          </span>
        )}

        {item.color && (
          <span className="px-2 py-0.5 text-[11px] bg-gray-100 text-gray-700 rounded-md">
            {item.color}
          </span>
        )}

      </div>
    )}
  </div>
))}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    PendingSalesApproval: { bg: "bg-yellow-100", text: "text-yellow-700", label: "SALES PENDING" },
    PendingWarehouseApproval: { bg: "bg-amber-100", text: "text-amber-700", label: "WH PENDING" },
    RejectedByWarehouse: { bg: "bg-red-100", text: "text-red-700", label: "REJECTED" },
    Confirmed: { bg: "bg-blue-50", text: "text-blue-600", label: "CONFIRMED" },
    Processing: { bg: "bg-indigo-50", text: "text-indigo-600", label: "PROCESSING" },
    Dispatched: { bg: "bg-purple-100", text: "text-purple-700", label: "DISPATCHED" },
    Delivered: { bg: "bg-gray-200", text: "text-gray-600", label: "DELIVERED" },
  }[status] || { bg: "bg-gray-100", text: "text-gray-600", label: status?.toUpperCase() };

  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-black tracking-widest whitespace-nowrap ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}