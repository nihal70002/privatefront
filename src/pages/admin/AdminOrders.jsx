import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { Search, Package, Eye, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

const PAGE_SIZE = 6;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentStatus = searchParams.get("status") || "All";

  /* ================= FETCH ORDERS ================= */
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const params = { page, pageSize: PAGE_SIZE };
      if (currentStatus !== "All") params.status = currentStatus;

      const res = await api.get("/admin/orders", { params });

      setOrders(res.data.items || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  /* RESET PAGE ON FILTER CHANGE */
  useEffect(() => {
    setPage(1);
  }, [currentStatus]);

  /* LOAD ORDERS */
  useEffect(() => {
    fetchOrders();
  }, [page, currentStatus]);

  /* ================= ACTION HANDLER ================= */
  const doAction = async (orderId, action) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/admin/orders/${orderId}/${action}`);
      fetchOrders();
    } catch (err) {
      console.error("Action failed", err);
      alert("Action failed");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ================= SEARCH ================= */
  const filteredOrders = orders.filter(o =>
    o.orderId.toString().includes(searchTerm) ||
    o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.phoneNumber?.includes(searchTerm)
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const statusOptions = ["All", "Pending", "Confirmed", "Dispatched", "Delivered", "Cancelled"];

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                <Package className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Order Management</h1>
                <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                  <span className="font-semibold text-blue-400">{totalCount}</span> Total Orders
                </p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-96 pl-12 pr-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-2">
          <div className="flex gap-2">
            {statusOptions.map(s => (
              <button
                key={s}
                onClick={() =>
                  setSearchParams(
                    s === "All" ? {} : { status: s },
                    { replace: true }
                  )
                }
                className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                  currentStatus === s
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-750 border-b border-gray-700">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-300 uppercase tracking-wider">Actions</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-700">
                {filteredOrders.map(o => (
                  <tr key={o.orderId} className="hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-bold text-blue-400">#{o.orderId}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-200">{o.customerName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-300">{o.companyName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400">{o.phoneNumber}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-400 text-sm">{new Date(o.orderDate).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-emerald-400">₹{o.totalAmount}</span>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge status={o.status} />
                    </td>

                    {/* ACTION BUTTONS */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {o.status === "Pending" && (
                          <>
                            <ActionBtn 
                              label="Confirm" 
                              variant="success" 
                              onClick={() => doAction(o.orderId, "confirm")}
                              disabled={updatingId === o.orderId}
                            />
                            <ActionBtn 
                              label="Cancel" 
                              variant="danger" 
                              onClick={() => doAction(o.orderId, "cancel")}
                              disabled={updatingId === o.orderId}
                            />
                          </>
                        )}

                        {o.status === "Confirmed" && (
                          <>
                            <ActionBtn 
                              label="Dispatch" 
                              variant="info" 
                              onClick={() => doAction(o.orderId, "dispatch")}
                              disabled={updatingId === o.orderId}
                            />
                            <ActionBtn 
                              label="Revert" 
                              variant="warning" 
                              onClick={() => doAction(o.orderId, "revert")}
                              disabled={updatingId === o.orderId}
                            />
                          </>
                        )}

                        {o.status === "Dispatched" && (
                          <>
                            <ActionBtn 
                              label="Deliver" 
                              variant="primary" 
                              onClick={() => doAction(o.orderId, "deliver")}
                              disabled={updatingId === o.orderId}
                            />
                            <ActionBtn 
                              label="Revert" 
                              variant="warning" 
                              onClick={() => doAction(o.orderId, "revert")}
                              disabled={updatingId === o.orderId}
                            />
                          </>
                        )}

                        {o.status === "Delivered" && (
                          <ActionBtn 
                            label="Revert" 
                            variant="warning" 
                            onClick={() => doAction(o.orderId, "revert")}
                            disabled={updatingId === o.orderId}
                          />
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <Link 
                        to={`/admin/orders/${o.orderId}`} 
                        className="inline-flex items-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors"
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && (
              <div className="p-12 text-center">
                <RefreshCw className="animate-spin mx-auto text-blue-500 mb-3" size={32} />
                <p className="text-gray-400">Loading orders...</p>
              </div>
            )}

            {!loading && filteredOrders.length === 0 && (
              <div className="p-12 text-center">
                <Package className="mx-auto text-gray-600 mb-3" size={48} />
                <p className="text-gray-400 font-medium">No orders found</p>
              </div>
            )}
          </div>
        </div>

        {/* PAGINATION */}
        <div className="bg-gray-800 rounded-xl shadow-xl border border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <button 
              disabled={page === 1} 
              onClick={() => setPage(p => p - 1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              <ChevronLeft size={18} />
              Previous
            </button>
            
            <div className="flex items-center gap-3">
              <span className="text-gray-400">Page</span>
              <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">
                {page}
              </span>
              <span className="text-gray-400">of {totalPages}</span>
            </div>
            
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(p => p + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
            >
              Next
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= ACTION BUTTON ================= */
const ActionBtn = ({ label, variant, onClick, disabled }) => {
  const variants = {
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    info: "bg-blue-600 hover:bg-blue-700 text-white",
    primary: "bg-purple-600 hover:bg-purple-700 text-white",
    warning: "bg-amber-600 hover:bg-amber-700 text-white",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]}`}
    >
      {label}
    </button>
  );
};

/* ================= STATUS BADGE ================= */
function StatusBadge({ status }) {
  const variants = {
    Pending: "bg-amber-900/50 text-amber-400 border border-amber-700",
    Confirmed: "bg-emerald-900/50 text-emerald-400 border border-emerald-700",
    Dispatched: "bg-blue-900/50 text-blue-400 border border-blue-700",
    Delivered: "bg-purple-900/50 text-purple-400 border border-purple-700",
    Cancelled: "bg-red-900/50 text-red-400 border border-red-700",
  };

  return (
    <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-bold ${variants[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}