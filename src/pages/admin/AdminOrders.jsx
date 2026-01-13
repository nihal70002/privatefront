import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api/axios";
import { Search, Package, Eye, ChevronLeft, ChevronRight, RefreshCw, Filter } from "lucide-react";

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
  const statusOptions = ["All", "Pending", "Confirmed", "Dispatched", "Delivered", "Cancelled"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans antialiased text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200">
              <Package className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Orders</h1>
              <p className="text-slate-500 text-sm font-medium">
                Manage <span className="text-blue-600 font-bold">{totalCount}</span> total transactions
              </p>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
            <input
              placeholder="Search by ID or customer..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full md:w-80 pl-11 pr-4 py-2.5 bg-white text-slate-700 rounded-xl border border-slate-200 shadow-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-1">
          {statusOptions.map(s => (
            <button
              key={s}
              onClick={() => setSearchParams(s === "All" ? {} : { status: s }, { replace: true })}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                currentStatus === s
                  ? "bg-slate-900 text-white shadow-md shadow-slate-200"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* MAIN TABLE CARD */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">ID</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Client Details</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-6 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-center">Process</th>
                  <th className="px-6 py-5"></th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map(o => (
                  <tr key={o.orderId} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-5">
                      <span className="font-bold text-slate-900">#{o.orderId}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{o.customerName}</span>
                        <span className="text-xs text-slate-500 font-medium">{o.companyName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-slate-600 text-sm font-medium">{new Date(o.orderDate).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="font-extrabold text-slate-900">₹{o.totalAmount}</span>
                    </td>
                    <td className="px-6 py-5">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-center gap-2">
                        {o.status === "Pending" && (
                          <>
                            <ActionBtn label="Confirm" variant="success" onClick={() => doAction(o.orderId, "confirm")} disabled={updatingId === o.orderId} />
                            <ActionBtn label="Cancel" variant="danger" onClick={() => doAction(o.orderId, "cancel")} disabled={updatingId === o.orderId} />
                          </>
                        )}
                        {o.status === "Confirmed" && (
                          <>
                            <ActionBtn label="Dispatch" variant="info" onClick={() => doAction(o.orderId, "dispatch")} disabled={updatingId === o.orderId} />
                            <ActionBtn label="Revert" variant="warning" onClick={() => doAction(o.orderId, "revert")} disabled={updatingId === o.orderId} />
                          </>
                        )}
                        {/* ... other status logic remains the same ... */}
                        {o.status === "Dispatched" && (
                          <ActionBtn label="Deliver" variant="primary" onClick={() => doAction(o.orderId, "deliver")} disabled={updatingId === o.orderId} />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link 
                        to={`/admin/orders/${o.orderId}`} 
                        className="p-2 inline-flex items-center justify-center text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      >
                        <Eye size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {loading && (
              <div className="py-20 text-center">
                <RefreshCw className="animate-spin mx-auto text-blue-500 mb-3" size={32} />
                <p className="text-slate-500 font-medium">Fetching secure data...</p>
              </div>
            )}
          </div>
        </div>

        {/* PAGINATION FOOTER */}
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-slate-200 shadow-sm">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-400">Page</span>
            <span className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-100">
              {page}
            </span>
            <span className="text-sm font-bold text-slate-400">of {totalPages}</span>
          </div>
          
          <button 
            disabled={page >= totalPages} 
            onClick={() => setPage(p => p + 1)}
            className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>

      </div>
    </div>
  );
}

const ActionBtn = ({ label, variant, onClick, disabled }) => {
  const variants = {
    success: "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border-emerald-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-100",
    info: "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-blue-100",
    primary: "bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-100",
    warning: "bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white border-amber-100",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg border transition-all disabled:opacity-50 ${variants[variant]}`}
    >
      {label}
    </button>
  );
};

function StatusBadge({ status }) {
  const variants = {
    Pending: "bg-amber-100 text-amber-700",
    Confirmed: "bg-emerald-100 text-emerald-700",
    Dispatched: "bg-blue-100 text-blue-700",
    Delivered: "bg-indigo-100 text-indigo-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tight ${variants[status]}`}>
      {status}
    </span>
  );
}