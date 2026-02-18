import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

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
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading customer details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 mx-auto">
            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <p className="text-slate-900 text-lg font-semibold mb-2">Customer not found</p>
          <p className="text-slate-500 text-sm">The customer you're looking for doesn't exist</p>
        </div>
      </div>
    );
  }

  const filteredOrders = data.orders.filter((order) => {
    const matchesSearch =
      order.orderId.toString().includes(searchTerm) ||
      order.items.some(
        (i) =>
          i.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.productCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesStatus = statusFilter === "ALL" || order.status === statusFilter;
    
    // Date filtering
    const orderDate = new Date(order.orderDate);
    const matchesDateFrom = !dateFrom || orderDate >= new Date(dateFrom);
    const matchesDateTo = !dateTo || orderDate <= new Date(dateTo);
    
    return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">Customer Details</h1>
              <p className="text-slate-500 text-sm">View customer information and order history</p>
            </div>
            <button
              onClick={() => navigate("/sales/customers")}
              className="px-5 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Customer Info Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm mb-8 overflow-hidden">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 px-8 py-6">
            <h2 className="text-2xl font-bold text-white mb-1">{data.companyName}</h2>
            <p className="text-emerald-100 text-sm">{data.name}</p>
          </div>
          <div className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Email Address</p>
                <p className="text-slate-900 font-medium">{data.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Phone Number</p>
                <p className="text-slate-900 font-medium">{data.phoneNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Orders Header */}
          <div className="px-8 py-6 border-b border-slate-200">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 mb-1">Order History</h2>
                  <p className="text-sm text-slate-500">{filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'} found</p>
                </div>
              </div>
              
              {/* Filter Row */}
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search orders, products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm w-full focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                >
                  <option value="ALL">All Status</option>
                  <option value="PendingSalesApproval">Pending Sales</option>
                  <option value="PendingAdminApproval">Pending Admin</option>
                  <option value="Delivered">Delivered</option>
                  <option value="RejectedBySales">Rejected</option>
                </select>

                <div className="flex gap-3">
                  <div className="relative">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      placeholder="From date"
                      className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                    />
                  </div>
                  
                  <div className="relative">
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      placeholder="To date"
                      className="px-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
                    />
                  </div>
                </div>

                {(searchTerm || statusFilter !== "ALL" || dateFrom || dateTo) && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("ALL");
                      setDateFrom("");
                      setDateTo("");
                    }}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 whitespace-nowrap"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="divide-y divide-slate-200">
            {filteredOrders.length === 0 ? (
              <div className="px-8 py-16 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="text-slate-600 font-medium mb-1">No orders found</p>
                <p className="text-slate-500 text-sm">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const isOpen = expandedOrders[order.orderId];
                return (
                  <div key={order.orderId} className="transition-all duration-200 hover:bg-slate-50/50">
                    {/* Order Header - Clickable */}
                    <div
                      onClick={() => toggleOrder(order.orderId)}
                      className="px-8 py-6 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-6 h-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-semibold text-slate-900 mb-1">
                              Order #{order.orderId}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {formatDate(order.orderDate)}
                            </p>
                          </div>
                          <StatusBadge status={order.status} />
                        </div>
                        <div className="ml-6 flex items-center gap-3">
                          <div className="text-right hidden sm:block">
                            <p className="text-xs text-slate-500 mb-1">Total Amount</p>
                            <p className="text-lg font-bold text-slate-900">₹{order.totalAmount.toLocaleString()}</p>
                          </div>
                          <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                            <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Order Details - Collapsible */}
                    {isOpen && (
                      <div className="px-8 pb-6 animate-slideDown">
                        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                          {/* Order Metadata */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                Order Date
                              </p>
                              <p className="text-sm text-slate-900 font-medium">
                                {formatDate(order.orderDate)}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                Delivery Date
                              </p>
                              <p className="text-sm text-slate-900 font-medium">
                                {order.deliveredDate ? formatDate(order.deliveredDate) : "—"}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                Total Amount
                              </p>
                              <p className="text-sm text-emerald-700 font-bold">
                                ₹{order.totalAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          {/* Order Items Table */}
                          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
                            <table className="w-full">
                              <thead>
                               <tr className="bg-slate-100 border-b border-slate-200">
  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
    Product
  </th>
  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
    Code
  </th>
  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
    Size
  </th>
  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
    Class
  </th>
  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
    Style
  </th>
  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
    Material
  </th>
  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">
    Color
  </th>
  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wide">
    Quantity
  </th>
</tr>

                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {order.items.map((item, i) => (
                                  <tr key={i} className="hover:bg-slate-50 transition-colors">
  <td className="px-4 py-3 text-sm text-slate-900 font-medium">
    {item.productName}
  </td>

  <td className="px-4 py-3 text-sm text-slate-600">
    {item.productCode || "—"}
  </td>

  <td className="px-4 py-3 text-sm text-slate-600">
    {item.size || "—"}
  </td>

  <td className="px-4 py-3 text-sm text-slate-600">
    {item.class || "—"}
  </td>

  <td className="px-4 py-3 text-sm text-slate-600">
    {item.style || "—"}
  </td>

  <td className="px-4 py-3 text-sm text-slate-600">
    {item.material || "—"}
  </td>

  <td className="px-4 py-3 text-sm text-slate-600">
    {item.color || "—"}
  </td>

  <td className="px-4 py-3 text-sm text-slate-900 font-semibold text-right">
    {item.quantity}
  </td>
</tr>

                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}

/* ===== HELPER COMPONENTS ===== */

function StatusBadge({ status }) {
  const statusConfig = {
    PendingSalesApproval: {
      bg: "bg-amber-100",
      text: "text-amber-800",
      label: "Pending Sales",
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
    },
    PendingAdminApproval: {
      bg: "bg-blue-100",
      text: "text-blue-800",
      label: "Pending Admin",
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
        </svg>
      ),
    },
    Delivered: {
      bg: "bg-emerald-100",
      text: "text-emerald-800",
      label: "Delivered",
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
    RejectedBySales: {
      bg: "bg-red-100",
      text: "text-red-800",
      label: "Rejected",
      icon: (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      ),
    },
  };

  const config = statusConfig[status] || {
    bg: "bg-slate-100",
    text: "text-slate-800",
    label: status,
    icon: null,
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
      {config.icon}
      {config.label}
    </span>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}