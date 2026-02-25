import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { Search, Eye, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

const PAGE_SIZE = 8;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [confirmModal, setConfirmModal] = useState(null);

  const currentStatus = searchParams.get("status") || "All";

  const statusMap = {
    WaitingSalesApproval: "PendingSalesApproval",
    WaitingWarehouseApproval: "PendingWarehouseApproval",
  };

  const formatSAR = (amount) =>
    new Intl.NumberFormat("en-SA", {
      style: "currency",
      currency: "SAR",
    }).format(amount);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = { page, pageSize: PAGE_SIZE };
      if (currentStatus !== "All") {
        params.status = statusMap[currentStatus] || currentStatus;
      }
      const res = await api.get("/admin/orders", { params });
      setOrders(res.data.items || []);
      setTotalCount(res.data.totalCount || 0);
    } catch (err) {
      console.error("Failed to load orders", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [currentStatus]);

  useEffect(() => {
    fetchOrders();
  }, [page, currentStatus]);

  const doAction = async (orderId, action, isConfirmed = false) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/admin/orders/${orderId}/${action}`, { isConfirmed });
      fetchOrders();
    } catch (err) {
      if (err.response?.data?.message === "CONFIRMATION_REQUIRED") {
        setConfirmModal({ orderId, action });
      } else {
        alert("Action failed");
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const doSalesAction = async (orderId, action) => {
    try {
      setUpdatingId(orderId);
      if (action === "approve") {
        await api.put(`/sales/orders/${orderId}/approve`);
      } else {
        await api.post(`/sales/cancel/${orderId}`);
      }
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Sales action failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const doWarehouseAction = async (orderId, action) => {
    try {
      setUpdatingId(orderId);
      const actionMap = {
        confirm: "approve",
        reject: "reject",
        dispatch: "dispatch",
        deliver: "deliver",
      };
      await api.post(`/warehouse/orders/${orderId}/${actionMap[action]}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Warehouse action failed");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter(o =>
    o.orderId.toString().includes(searchTerm) ||
    o.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const statusOptions = ["All", "WaitingSalesApproval", "WaitingWarehouseApproval", "Confirmed", "Dispatched", "Delivered", "Cancelled"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 md:p-6 lg:p-8">

      {/* TOP BAR - FIXED FOR NO SCROLLING */}
      <div className="mb-6 flex flex-col gap-4 bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/40">
        
        {/* WRAPPING STATUS BUTTONS (Fixed the scroll issue) */}
        <div className="flex flex-wrap gap-2 items-center">
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => setSearchParams(s === "All" ? {} : { status: s }, { replace: true })}
              className={`px-3 py-1.5 rounded-lg text-[10px] md:text-[11px] font-bold transition-all duration-300 ${
                currentStatus === s
                  ? "bg-blue-600 text-white shadow-md scale-105"
                  : "bg-white/50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 border border-slate-100"
              }`}
            >
              {s === "WaitingSalesApproval" ? "Sales Appr." : 
               s === "WaitingWarehouseApproval" ? "Wh. Appr." : 
               s.replace(/([A-Z])/g, ' $1').trim()}
            </button>
          ))}
        </div>

        {/* SEARCH BAR */}
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID or Name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 bg-white/80 backdrop-blur-sm text-xs rounded-xl border border-white/50 outline-none focus:ring-2 focus:ring-blue-400/20"
          />
        </div>
      </div>

      {/* MOBILE CARD VIEW */}
      <div className="grid grid-cols-1 gap-3 lg:hidden">
        {filteredOrders.map(o => (
          <div key={o.orderId} className="bg-white rounded-2xl p-4 shadow-md border border-slate-100">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">#{o.orderId}</span>
                <h3 className="text-sm font-bold text-slate-800 mt-1">{o.customerName}</h3>
                <p className="text-[10px] text-slate-400 uppercase font-medium">{o.companyName}</p>
              </div>
              <StatusBadge status={o.status} />
            </div>
            
            <div className="flex justify-between items-center border-t border-slate-50 pt-3 mt-1">
              <p className="text-sm font-black text-emerald-600">{formatSAR(o.totalAmount)}</p>
              <div className="flex gap-2">
                <OrderActions order={o} updatingId={updatingId} doSalesAction={doSalesAction} doWarehouseAction={doWarehouseAction} doAction={doAction} />
                <Link to={`/admin/orders/${o.orderId}`} className="p-2 bg-slate-50 rounded-lg text-indigo-600">
                  <Eye size={16} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE VIEW */}
      <div className="hidden lg:block bg-white/70 backdrop-blur-md rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">ID</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Client</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Amount</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredOrders.map(o => (
              <tr key={o.orderId} className="hover:bg-blue-50/40 transition-all">
                <td className="px-6 py-4 font-bold text-indigo-600 text-sm">#{o.orderId}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-bold text-slate-800">{o.customerName}</div>
                  <div className="text-[10px] text-slate-400 uppercase">{o.companyName}</div>
                </td>
                <td className="px-6 py-4 text-xs text-slate-500">{new Date(o.orderDate).toLocaleDateString()}</td>
                <td className="px-6 py-4 font-black text-emerald-600 text-sm">{formatSAR(o.totalAmount)}</td>
                <td className="px-6 py-4"><StatusBadge status={o.status} /></td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 items-center">
                    <OrderActions order={o} updatingId={updatingId} doSalesAction={doSalesAction} doWarehouseAction={doWarehouseAction} doAction={doAction} />
                    <Link to={`/admin/orders/${o.orderId}`} className="p-2 hover:bg-indigo-100 rounded-lg text-indigo-600 transition-all">
                      <Eye size={16} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="mt-6 flex flex-col md:flex-row items-center justify-between bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-white/40 gap-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 tracking-widest uppercase">
          <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Live Sync'}
        </div>
        <div className="flex items-center gap-4">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 bg-white rounded-xl shadow-sm disabled:opacity-20 border border-slate-100"><ChevronLeft size={18}/></button>
          <span className="text-sm font-black text-slate-700">{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 bg-white rounded-xl shadow-sm disabled:opacity-20 border border-slate-100"><ChevronRight size={18}/></button>
        </div>
      </div>

      {/* CONFIRM MODAL */}
      {confirmModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-2xl text-center">
            <h3 className="text-lg font-black text-slate-800 mb-2">Are you sure?</h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">This order is already being processed.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal(null)} className="flex-1 py-2.5 text-xs font-bold bg-slate-100 rounded-xl">Cancel</button>
              <button onClick={() => { doAction(confirmModal.orderId, confirmModal.action, true); setConfirmModal(null); }} className="flex-1 py-2.5 text-xs font-bold bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-200">Revert</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* SUB-COMPONENTS */
function OrderActions({ order, updatingId, doSalesAction, doWarehouseAction, doAction }) {
  const isUpdating = updatingId === order.orderId;
  return (
    <div className="flex gap-1.5">
      {order.status === "PendingSalesApproval" && <ActionBtn label="Approve" variant="success" onClick={() => doSalesAction(order.orderId, "approve")} disabled={isUpdating} />}
      {order.status === "PendingWarehouseApproval" && <ActionBtn label="Confirm" variant="success" onClick={() => doWarehouseAction(order.orderId, "confirm")} disabled={isUpdating} />}
      {order.status === "Confirmed" && <ActionBtn label="Dispatch" variant="info" onClick={() => doWarehouseAction(order.orderId, "dispatch")} disabled={isUpdating} />}
      {order.status === "Dispatched" && <ActionBtn label="Deliver" variant="primary" onClick={() => doAction(order.orderId, "deliver")} disabled={isUpdating} />}
      {order.status === "Cancelled" && <ActionBtn label="Revert" variant="danger" onClick={() => doAction(order.orderId, "revert")} disabled={isUpdating} />}
    </div>
  );
}

const ActionBtn = ({ label, variant, onClick, disabled }) => {
  const variants = {
    success: "bg-emerald-500 text-white shadow-emerald-100",
    danger: "bg-rose-500 text-white shadow-rose-100",
    info: "bg-sky-500 text-white shadow-sky-100",
    primary: "bg-indigo-500 text-white shadow-indigo-100",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`px-2.5 py-1.5 rounded-lg text-[9px] font-black transition-all shadow-md disabled:opacity-40 uppercase tracking-tighter ${variants[variant]}`}>
      {label}
    </button>
  );
};

function StatusBadge({ status }) {
  const config = {
    PendingSalesApproval: { label: "PENDING", class: "bg-amber-50 text-amber-600 border-amber-100" },
    PendingWarehouseApproval: { label: "WAREHOUSE", class: "bg-purple-50 text-purple-600 border-purple-100" },
    Confirmed: { label: "CONFIRMED", class: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    Dispatched: { label: "TRANSIT", class: "bg-blue-50 text-blue-600 border-blue-100" },
    Delivered: { label: "DELIVERED", class: "bg-slate-50 text-slate-500 border-slate-100" },
    Cancelled: { label: "CANCELLED", class: "bg-rose-50 text-rose-600 border-rose-100" },
  };
  const s = config[status];
  return <span className={`px-2 py-1 rounded-md text-[8px] font-black border tracking-wider ${s?.class || "bg-gray-100"}`}>{s?.label || status}</span>;
}