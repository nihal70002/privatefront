import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ChevronLeft, Printer, Package, Truck, 
  CheckCircle2, XCircle, Undo2, Calendar, 
  User, Building2, Phone, CreditCard 
} from "lucide-react";
import api from "../../api/axios";

export default function AdminOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/admin/orders/${orderId}`).then(res => {
      setOrder(res.data);
    });
  }, [orderId]);

  const doAction = async (action) => {
    try {
      let url = `/admin/orders/${orderId}/${action}`;
      if (action === "revert") url = `/admin/orders/${orderId}/revert`;

      await api.put(url);
      const res = await api.get(`/admin/orders/${orderId}`);
      setOrder(res.data);
    } catch (err) {
      console.error(err);
      alert("Action failed");
    }
  };

  const confirmAction = (msg, fn) => {
    if (window.confirm(msg)) fn();
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-6 pt-4 pb-10 font-sans antialiased text-slate-900">
      <div className="max-w-6xl mx-auto space-y-4">

        {/* COMPACT TOP NAV */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <ChevronLeft size={16} />
            <span className="text-[11px] font-bold uppercase tracking-widest">Back to Orders</span>
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-50 transition-all text-xs font-bold shadow-sm">
            <Printer size={14} /> Print Invoice
          </button>
        </div>

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl text-white shadow-lg ${getStatusColor(order.status).iconBg}`}>
              <Package size={24} />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black tracking-tight">Order #{order.orderId}</h1>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-400 font-bold uppercase tracking-tighter">
                <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(order.orderDate).toLocaleDateString()}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><CreditCard size={12}/> {order.paymentMethod || 'Credit Account'}</span>
              </div>
            </div>
          </div>

          {/* DYNAMIC ACTIONS BAR */}
          <div className="flex flex-wrap gap-2 pt-4 md:pt-0 border-t md:border-t-0 border-slate-50">
            {order.status === "PendingAdminApproval" && (
              <>
                <ActionBtn label="Confirm Order" icon={<CheckCircle2 size={14}/>} variant="success" onClick={() => confirmAction("Confirm this order?", () => doAction("confirm"))} />
                <ActionBtn label="Cancel" icon={<XCircle size={14}/>} variant="danger" onClick={() => confirmAction("Cancel this order?", () => doAction("cancel"))} />
              </>
            )}
            {order.status === "Confirmed" && (
              <>
                <ActionBtn label="Dispatch" icon={<Truck size={14}/>} variant="info" onClick={() => confirmAction("Dispatch this order?", () => doAction("dispatch"))} />
                <ActionBtn label="Revert" icon={<Undo2 size={14}/>} variant="warning" onClick={() => confirmAction("Revert to Approval?", () => doAction("revert"))} />
              </>
            )}
            {order.status === "Dispatched" && (
              <ActionBtn label="Mark Delivered" icon={<CheckCircle2 size={14}/>} variant="primary" onClick={() => confirmAction("Mark as delivered?", () => doAction("deliver"))} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* LEFT: ORDER ITEMS (Main Content) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Line Items</h2>
                <span className="text-[11px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{order.items.length} Products</span>
              </div>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 text-[10px] text-slate-400 uppercase font-bold">
                    <th className="px-5 py-3">Product</th>
                    <th className="px-5 py-3 text-center">Qty</th>
                    <th className="px-5 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {order.items.map((item, index) => (
                    <tr key={index} className="text-sm">
                      <td className="px-5 py-3">
                        <p className="font-bold text-slate-700">{item.productName}</p>
                        <p className="text-[10px] text-slate-400 font-medium">Size: {item.size} • ₹{item.unitPrice} / unit</p>
                      </td>
                      <td className="px-5 py-3 text-center font-bold text-slate-600">×{item.quantity}</td>
                      <td className="px-5 py-3 text-right font-black text-slate-800">₹{(item.quantity * item.unitPrice).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50/80">
                    <td colSpan="2" className="px-5 py-4 text-right text-xs font-bold text-slate-500">Order Grand Total:</td>
                    <td className="px-5 py-4 text-right text-lg font-black text-indigo-600">₹{order.totalAmount.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {order.status === "Cancelled" && order.rejectedReason && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex gap-3">
                <XCircle className="text-rose-500 shrink-0" size={20} />
                <div>
                  <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest">Cancellation Reason</p>
                  <p className="text-sm font-bold text-rose-800 mt-0.5">{order.rejectedReason}</p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: CUSTOMER & SALES INFO (Sidebar) */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
              <SectionHeader title="Customer Details" icon={<User size={14}/>} />
              <div className="space-y-3">
                <DetailRow icon={<User size={14}/>} label="Contact" value={order.customerName} />
                <DetailRow icon={<Building2 size={14}/>} label="Company" value={order.companyName} />
                <DetailRow icon={<Phone size={14}/>} label="Phone" value={order.phoneNumber} />
              </div>
              
              <div className="pt-4 border-t border-slate-100">
                <SectionHeader title="Assigned Sales" icon={<Truck size={14}/>} />
                {order.salesExecutiveName ? (
                   <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100">
                      <p className="text-xs font-bold text-slate-700">{order.salesExecutiveName}</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5">{order.salesExecutivePhone}</p>
                   </div>
                ) : (
                  <p className="text-[10px] text-slate-400 italic mt-2">No executive assigned</p>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---

function SectionHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
      {icon} {title}
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-slate-300">{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 leading-none">{label}</p>
        <p className="text-xs font-bold text-slate-700 mt-1">{value || "N/A"}</p>
      </div>
    </div>
  );
}

function ActionBtn({ label, variant, onClick, icon }) {
  const variants = {
    success: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100",
    danger: "bg-rose-600 hover:bg-rose-700 shadow-rose-100",
    info: "bg-blue-600 hover:bg-blue-700 shadow-blue-100",
    primary: "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100",
    warning: "bg-amber-500 hover:bg-amber-600 shadow-amber-100",
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold text-white rounded-lg shadow-md transition-all active:scale-95 ${variants[variant]}`}
    >
      {icon} {label}
    </button>
  );
}

function StatusBadge({ status }) {
  const config = getStatusColor(status);
  return (
    <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${config.bg} ${config.text} ${config.border}`}>
      {status}
    </span>
  );
}

function getStatusColor(status) {
  const map = {
    PendingAdminApproval: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", iconBg: "bg-amber-500" },
    Confirmed: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", iconBg: "bg-emerald-500" },
    Dispatched: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", iconBg: "bg-blue-500" },
    Delivered: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", iconBg: "bg-indigo-500" },
    Cancelled: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", iconBg: "bg-rose-500" },
  };
  return map[status] || { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", iconBg: "bg-slate-500" };
}