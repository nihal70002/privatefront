import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Phone, Mail, Search, Package } from "lucide-react";
import api from "../../api/axios";

export default function SalesExecutiveOrders() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type") || "all";

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.get(`/admin/sales-executives/${id}/orders?type=${type}`);
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };
    loadOrders();
  }, [id, type]);

  const filteredOrders = orders.filter((order) => {
    const q = search.toLowerCase();
    return (
      order.orderId?.toString().includes(q) ||
      order.customer.name?.toLowerCase().includes(q) ||
      order.customer.companyName?.toLowerCase().includes(q) ||
      order.items.some((item) => item.productName?.toLowerCase().includes(q))
    );
  });

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
      <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
    /* FIX: 
      1. h-screen + flex-col ensures the header stays top and body scrolls.
      2. overflow-hidden on root prevents double scrollbars.
    */
    <div className="w-full h-screen flex flex-col bg-[#F8FAFC] font-sans antialiased text-slate-900 overflow-hidden">
      
      {/* HEADER BAR - Sticky & Full Width */}
      <div className="w-full bg-[#F8FAFC]/90 backdrop-blur-sm z-20 border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-500 bg-white shadow-sm border border-slate-200"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-black capitalize tracking-tight text-slate-800">
                {type} Orders
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {filteredOrders.length} Results Found
              </p>
            </div>
          </div>

          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Quick search..."
              className="w-full pl-11 pr-4 py-2.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/5 bg-white shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA - SCROLLABLE 
        FIX: flex-1 + overflow-y-auto enables the scroll 
      */}
      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-slate-200">
        <div className="w-full space-y-3 pb-10"> 
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-16 text-center">
              <Package size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Orders Found</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.orderId}
                className="w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                onClick={() => navigate(`/admin/orders/${order.orderId}`)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-indigo-600 font-black text-sm border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      {order.customer.name?.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="text-sm font-bold text-slate-800 truncate">
                          {order.customer.name}
                        </h3>
                        <StatusBadge status={order.status} />
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        <span className="font-bold text-indigo-500">{order.customer.companyName || "Private Client"}</span> • ID: #{order.orderId}
                      </p>
                    </div>
                  </div>

                  {/* Price/Date */}
                  <div className="flex items-center gap-6 text-right">
                    <div className="hidden sm:block">
                       <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Date</p>
                       <p className="text-xs font-bold text-slate-600">
                        {new Date(order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>
                    <div className="bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100 group-hover:bg-indigo-600 transition-colors">
                      <p className="text-lg font-black text-indigo-600 group-hover:text-white">
                        ₹{order.totalAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="mt-3 pt-3 border-t border-slate-50 flex flex-wrap gap-1.5">
                  {order.items.map((item, idx) => (
                    <span key={idx} className="text-[10px] font-bold bg-slate-50 text-slate-500 px-2 py-1 rounded-lg border border-slate-100">
                      {item.productName} <span className="text-indigo-500 ml-1">×{item.quantity}</span>
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Pending: "bg-amber-50 text-amber-600 border-amber-100",
    Accepted: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Rejected: "bg-rose-50 text-rose-600 border-rose-100",
    PENDINGSALESAPPROVAL: "bg-blue-50 text-blue-600 border-blue-100",
  };
  
  const normalizedStatus = status?.replace(/\s/g, '').toUpperCase();
  return (
    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${map[normalizedStatus] || "bg-slate-50 text-slate-400 border-slate-100"}`}>
      {status || "Unknown"}
    </span>
  );
}