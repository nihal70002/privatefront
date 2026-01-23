import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function SalesCustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-[#F4F7F9]">
        <div className="text-[#718096] text-lg">Loading customer details...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-[#F4F7F9]">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#718096]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[#2A334E] font-semibold">Customer not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F4F7F9] min-h-screen">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-[#2A334E]">Customer Details</h1>
            <p className="text-[#718096] mt-1">View customer information and order history</p>
          </div>
          <button
            onClick={() => navigate("/sales/customers")}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-[#2A334E] rounded-xl font-semibold transition-all shadow-sm border border-gray-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back</span>
          </button>
        </div>

        {/* CUSTOMER INFO CARD */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4A86F7] to-[#3A76E7] flex items-center justify-center shadow-lg shadow-[#4A86F7]/20">
              <span className="text-white font-bold text-3xl">
                {data.companyName?.charAt(0)?.toUpperCase() || "C"}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#2A334E] mb-1">{data.companyName}</h2>
              <p className="text-[#718096] text-lg">{data.name}</p>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#4A86F7] rounded-xl font-semibold text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{data.orders.length} Orders</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-[#F4F7F9] rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#4A86F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#718096] uppercase font-bold tracking-wider mb-1">Email</p>
                <p className="font-semibold text-[#2A334E] truncate">{data.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#F4F7F9] rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#48BB78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#718096] uppercase font-bold tracking-wider mb-1">Phone</p>
                <p className="font-semibold text-[#2A334E]">{data.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#F4F7F9] rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs text-[#718096] uppercase font-bold tracking-wider mb-1">Total Orders</p>
                <p className="font-semibold text-[#2A334E]">{data.orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ORDERS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#2A334E]">Order History</h2>
            {data.orders.length > 0 && (
              <span className="text-sm text-[#718096] font-medium">
                {data.orders.length} {data.orders.length === 1 ? 'order' : 'orders'} found
              </span>
            )}
          </div>

          {data.orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#718096]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-[#2A334E] font-semibold text-lg">No orders found</p>
              <p className="text-[#718096] mt-1">This customer hasn't placed any orders yet</p>
            </div>
          ) : (
            data.orders.map(order => (
              <div
                key={order.orderId}
                className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all"
              >
                {/* ORDER HEADER */}
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-[#2A334E]">
                        Order #{order.orderId}
                      </h3>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm font-medium text-[#718096]">
                        {formatDate(order.orderDate)}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={order.status} />
                </div>

                {/* ORDER INFO */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-[#F4F7F9] rounded-xl">
                    <svg className="w-5 h-5 text-[#718096]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs text-[#718096] font-semibold">Ordered Date</p>
                      <p className="font-semibold text-[#2A334E]">{formatDate(order.orderDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-[#F4F7F9] rounded-xl">
                    <svg className="w-5 h-5 text-[#718096]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs text-[#718096] font-semibold">Delivered Date</p>
                      <p className="font-semibold text-[#2A334E]">
                        {order.deliveredDate ? formatDate(order.deliveredDate) : "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl">
                    <svg className="w-5 h-5 text-[#4A86F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs text-[#4A86F7] font-bold">Total Amount</p>
                      <p className="font-bold text-[#2A334E] text-lg">₹{order.totalAmount}</p>
                    </div>
                  </div>
                </div>

                {/* ITEMS TABLE */}
                <div className="overflow-hidden border border-gray-100 rounded-xl">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-[#F4F7F9]">
                      <tr>
                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#718096]">
                          Product
                        </th>
                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#718096] text-center">
                          Size
                        </th>
                        <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#718096] text-center">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {order.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 font-medium text-[#2A334E]">{item.productName}</td>
                          <td className="px-5 py-4 text-center">
                            <span className="inline-block bg-[#4A86F7]/10 text-[#4A86F7] px-3 py-1.5 rounded-lg text-xs font-semibold">
                              {item.size}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-center font-semibold text-[#2A334E]">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function StatusBadge({ status }) {
  const statusConfig = {
    PendingSalesApproval: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      dot: "bg-amber-500"
    },
    PendingAdminApproval: {
      bg: "bg-blue-50",
      text: "text-[#4A86F7]",
      dot: "bg-[#4A86F7]"
    },
    Delivered: {
      bg: "bg-green-50",
      text: "text-[#48BB78]",
      dot: "bg-[#48BB78]"
    },
    RejectedBySales: {
      bg: "bg-red-50",
      text: "text-red-600",
      dot: "bg-red-500"
    },
  };

  const config = statusConfig[status] || {
    bg: "bg-gray-50",
    text: "text-[#718096]",
    dot: "bg-gray-500"
  };

  const label = status?.replace(/([A-Z])/g, " $1").trim().toUpperCase() || "UNKNOWN";

  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold ${config.bg} ${config.text}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot} mr-2`}></span>
      {label}
    </span>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}