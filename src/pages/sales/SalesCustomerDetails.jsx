import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { ChevronLeft, Search, Calendar, X, Package, ChevronDown, Mail, Phone, Building2 } from "lucide-react";

export default function SalesCustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    loadCustomerHistory();
  }, [id]);

  const loadCustomerHistory = async () => {
    try {
      const res = await api.get(`/sales/customers/${id}/orders`);
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load customer details");
    } finally {
      setLoading(false);
    }
  };

  const toggleOrder = (orderId) => {
    setExpandedOrders((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!data) return <div className="p-20 text-center">Customer not found</div>;

  const filteredOrders = data.orders.filter((order) => {
    const matchesSearch =
      order.orderId.toString().includes(searchTerm) ||
      order.items.some(
        (i) =>
          i.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.productCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    const orderDate = new Date(order.orderDate);
    const matchesDateFrom = !dateFrom || orderDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || orderDate <= new Date(dateTo);
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  return (
    <div className="min-h-screen bg-[#F4F7F9] pt-20 pb-10 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* BACK & TITLE */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/sales/customers")}
            className="p-2 bg-white rounded-xl shadow-sm border border-gray-200 text-slate-600 hover:text-emerald-600 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Customer Profile</h1>
            <p className="text-sm text-slate-500">ID: #{id}</p>
          </div>
        </div>

        {/* CUSTOMER INFO CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-emerald-600 p-6 text-white">
            <h2 className="text-xl font-bold">{data.companyName}</h2>
            <div className="flex items-center gap-2 text-emerald-100 text-sm mt-1">
              <Building2 size={14} />
              <span>{data.name}</span>
            </div>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Mail className="text-slate-400" size={18} />
              <div className="truncate">
                <p className="text-[10px] uppercase font-bold text-slate-400">Email</p>
                <p className="text-sm font-medium text-slate-700 truncate">{data.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Phone className="text-slate-400" size={18} />
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Phone</p>
                <p className="text-sm font-medium text-slate-700">{data.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* FILTERS SECTION */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search order ID or product..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 outline-none shadow-sm"
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="PendingSalesApproval">Pending Sales</option>
              <option value="PendingAdminApproval">Pending Admin</option>
              <option value="Delivered">Delivered</option>
            </select>
            <input 
              type="date" 
              value={dateFrom} 
              onChange={(e) => setDateFrom(e.target.value)}
              className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm outline-none" 
            />
            {/* Clear Filters (Visible only when active) */}
            {(searchTerm || statusFilter !== "ALL" || dateFrom) && (
              <button 
                onClick={() => {setSearchTerm(""); setStatusFilter("ALL"); setDateFrom("");}}
                className="col-span-2 md:col-span-1 flex items-center justify-center gap-2 text-red-500 font-bold text-xs uppercase"
              >
                <X size={14} /> Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* ORDERS LIST */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 px-1">Order History ({filteredOrders.length})</h3>
          
          {filteredOrders.map((order) => (
            <div key={order.orderId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div 
                onClick={() => toggleOrder(order.orderId)}
                className="p-4 flex items-center justify-between cursor-pointer active:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Package size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">Order #{order.orderId}</p>
                    <p className="text-xs text-slate-500">{formatDate(order.orderDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">₹{order.totalAmount.toLocaleString()}</p>
                    <StatusBadge status={order.status} />
                  </div>
                  <ChevronDown 
                    size={20} 
                    className={`text-slate-400 transition-transform ${expandedOrders[order.orderId] ? 'rotate-180' : ''}`} 
                  />
                </div>
              </div>

              {/* EXPANDED ITEMS */}
              {expandedOrders[order.orderId] && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-50 bg-slate-50/50">
                   <div className="space-y-2">
                     {order.items.map((item, idx) => (
                       <div key={idx} className="bg-white p-3 rounded-lg border border-gray-100 shadow-xs">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-sm font-bold text-slate-800">{item.productName}</p>
                            <span className="text-xs font-black text-emerald-600">x{item.quantity}</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                             {item.size && <Tag label="Size" val={item.size} />}
                             {item.color && <Tag label="Color" val={item.color} />}
                             {item.material && <Tag label="Material" val={item.material} />}
                          </div>
                       </div>
                     ))}
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* UI COMPONENTS */

function Tag({ label, val }) {
  return (
    <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
      {label}: {val}
    </span>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PendingSalesApproval: "text-amber-600",
    PendingAdminApproval: "text-blue-600",
    Delivered: "text-emerald-600",
    RejectedBySales: "text-red-600",
  };
  const labels = {
    PendingSalesApproval: "Pending",
    PendingAdminApproval: "Admin",
    Delivered: "Delivered",
    RejectedBySales: "Rejected",
  };
  return <span className={`text-[10px] font-bold uppercase ${styles[status] || 'text-slate-500'}`}>{labels[status] || status}</span>;
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}