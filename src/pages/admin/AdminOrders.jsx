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
  const currentStatus = searchParams.get("status") || "All";

  const statusMap = {
    WaitingSalesApproval: "PendingSalesApproval",
    WaitingAdminApproval: "PendingAdminApproval",
  };

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

  useEffect(() => { setPage(1); }, [currentStatus]);
  useEffect(() => { fetchOrders(); }, [page, currentStatus]);

  const doAction = async (orderId, action) => {
    try {
      setUpdatingId(orderId);
      await api.put(`/admin/orders/${orderId}/${action}`);
      fetchOrders();
    } catch (err) {
      alert("Action failed");
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
  const statusOptions = ["All", "WaitingSalesApproval", "WaitingAdminApproval", "Confirmed", "Dispatched", "Delivered", "Cancelled"];

  return (
    <div className="min-h-screen bg-[#F0F4F8] p-4 font-sans antialiased text-slate-900">
      <div className="max-w-[1400px] mx-auto space-y-6">
        
        {/* WATER EFFECT TOP BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Glowing Status Tabs */}
          <div className="backdrop-blur-md bg-white/70 p-1.5 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] border border-white/40 flex flex-wrap gap-1">
            {statusOptions.map(s => (
              <button
                key={s}
                onClick={() => setSearchParams(s === "All" ? {} : { status: s }, { replace: true })}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 ${
                  currentStatus === s 
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)] scale-105" 
                    : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Small Glowing Search Bar on Right */}
          <div className="relative group self-end">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center">
              <Search className="absolute left-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={14} />
              <input
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-40 md:w-52 pl-9 pr-3 py-2 bg-white/80 backdrop-blur-sm text-xs text-slate-700 rounded-lg border border-white/50 shadow-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* MODERN TABLE CONTAINER */}
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-100 overflow-hidden mt-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Client Details</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Process</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredOrders.map(o => (
                  <tr key={o.orderId} className="hover:bg-blue-50/30 transition-all duration-300 group">
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">#{o.orderId}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{o.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{o.companyName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 font-medium">
                      {new Date(o.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-900 text-right">₹{o.totalAmount}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        {o.status === "PendingSalesApproval" && (
                          <span className="text-[10px] font-bold text-blue-400/70 uppercase tracking-widest animate-pulse">Processing...</span>
                        )}
                        {o.status === "PendingAdminApproval" && (
                          <>
                            <ActionBtn label="Confirm" variant="success" onClick={() => doAction(o.orderId, "confirm")} disabled={updatingId === o.orderId} />
                            <ActionBtn label="Cancel" variant="danger" onClick={() => doAction(o.orderId, "cancel")} disabled={updatingId === o.orderId} />
                          </>
                        )}
                        {o.status === "Confirmed" && (
                          <>
                            <ActionBtn label="Dispatch" variant="info" onClick={() => doAction(o.orderId, "dispatch")} disabled={updatingId === o.orderId} />
                          </>
                        )}
                        {o.status === "Dispatched" && (
                          <ActionBtn label="Deliver" variant="primary" onClick={() => doAction(o.orderId, "deliver")} disabled={updatingId === o.orderId} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/admin/orders/${o.orderId}`} className="p-2 inline-flex text-slate-300 hover:text-blue-600 hover:scale-110 transition-all">
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between px-4 pb-10">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Live Order Stream</p>
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-1 rounded-2xl border border-white/50 shadow-sm">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-2 hover:bg-white rounded-xl transition-all disabled:opacity-20">
              <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-black text-slate-700"> {page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="p-2 hover:bg-white rounded-xl transition-all disabled:opacity-20">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ActionBtn = ({ label, variant, onClick, disabled }) => {
  const variants = {
    success: "bg-emerald-500 text-white shadow-[0_4px_10px_rgba(16,185,129,0.2)] hover:bg-emerald-600",
    danger: "bg-rose-500 text-white shadow-[0_4px_10px_rgba(244,63,94,0.2)] hover:bg-rose-600",
    info: "bg-sky-500 text-white shadow-[0_4px_10px_rgba(14,165,233,0.2)] hover:bg-sky-600",
    primary: "bg-indigo-500 text-white shadow-[0_4px_10px_rgba(99,102,241,0.2)] hover:bg-indigo-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all active:scale-95 disabled:opacity-50 ${variants[variant]}`}
    >
      {label}
    </button>
  );
};

function StatusBadge({ status }) {
  const config = {
    PendingSalesApproval: { label: "Pending", class: "bg-amber-100 text-amber-600 border-amber-200" },
    PendingAdminApproval: { label: "Admin Review", class: "bg-orange-100 text-orange-600 border-orange-200" },
    Confirmed: { label: "Confirmed", class: "bg-emerald-100 text-emerald-600 border-emerald-200" },
    Dispatched: { label: "In Transit", class: "bg-blue-100 text-blue-600 border-blue-200" },
    Delivered: { label: "Delivered", class: "bg-slate-100 text-slate-500 border-slate-200" },
    Cancelled: { label: "Cancelled", class: "bg-rose-100 text-rose-600 border-rose-200" },
  };
  const s = config[status];
  return (
    <span className={`inline-flex px-2.5 py-1 rounded-full border text-[9px] font-bold uppercase tracking-tighter ${s?.class}`}>
      {s?.label || status}
    </span>
  );
}