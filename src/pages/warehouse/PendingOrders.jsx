import React, { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/warehouse/orders/pending");
      setOrders(res.data || []);
    } catch {
      toast.error("Failed to load pending orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading)
    return <div className="text-center mt-20 text-sm">Loading orders...</div>;

  if (!orders.length)
    return <div className="text-center mt-20">🎉 No pending orders</div>;

  return (
  <div className="min-h-screen bg-[#F4F7FB] p-6">
    <div className="max-w-[1400px] mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#2A334E]">
            Pending Orders
          </h2>
          <p className="text-sm text-[#718096]">
            Orders waiting for warehouse processing
          </p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[#F4F7F9] border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096]">
                Order ID
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096]">
                Client
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096]">
                Order Date
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096] text-right">
                Amount
              </th>
              <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096] text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {orders.map(o => (
              <tr
                key={o.orderId}
                onClick={() => navigate(`/warehouse/orders/${o.orderId}`)}
                className="group hover:bg-blue-50/40 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 font-bold text-[#2A334E]">
                  #{o.orderId}
                </td>

                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#2A334E]">
                      {o.customerName}
                    </span>
                    <span className="text-xs text-[#718096]">
                      {o.companyName}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 text-sm text-[#718096]">
                  {new Date(o.orderDate).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 text-right font-bold text-[#2A334E]">
                  ₹{o.totalAmount}
                </td>

                <td
                  className="px-6 py-4 text-center"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/warehouse/orders/${o.orderId}`);
                  }}
                >
                  <button className="p-2 rounded-lg hover:bg-blue-100 transition-colors">
                    <Eye
                      size={16}
                      className="text-[#718096] group-hover:text-[#4A86F7]"
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </div>
);

}
