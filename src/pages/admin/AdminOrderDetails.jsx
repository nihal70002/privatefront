import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

export default function AdminOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/admin/orders/${orderId}`)
      .then(res => setOrder(res.data));
  }, [orderId]);

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-500">
        Loading order details…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Order #{order.orderId}
            </h1>
            <p className="text-sm text-slate-500">
              {new Date(order.orderDate).toLocaleString()}
            </p>
          </div>

          <Link
            to="/admin/orders"
            className="text-indigo-600 font-medium hover:underline"
          >
            ← Back to Orders
          </Link>
        </div>

        {/* INFO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard label="Customer" value={order.customerName} />
          <InfoCard label="Company" value={order.companyName} />
          <InfoCard label="Phone" value={order.phoneNumber} />
          <InfoCard label="Status" value={order.status} status />
          <InfoCard
            label="Total Amount"
            value={`₹${order.totalAmount}`}
            highlight
          />
        </div>

        {/* PRODUCTS TABLE */}
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-bold text-slate-800">
              Products Ordered
            </h2>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-100 text-slate-600">
              <tr>
                <th className="px-6 py-4 text-left">Product</th>
                <th className="px-6 py-4 text-center">Quantity</th>
                <th className="px-6 py-4 text-center">Unit Price</th>
                <th className="px-6 py-4 text-center">Total</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((item, index) => (
                <tr
                  key={index}
                  className="border-t hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-slate-800">
                    {item.productName}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-center">
                    ₹{item.unitPrice}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-emerald-600">
                    ₹{item.quantity * item.unitPrice}
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

/* INFO CARD COMPONENT */
function InfoCard({ label, value, highlight, status }) {
  let extra = "bg-white border-slate-200";

  if (highlight) {
    extra = "bg-emerald-50 border-emerald-200 text-emerald-700";
  }

  if (status) {
    const map = {
      Pending: "bg-orange-50 border-orange-200 text-orange-700",
      Confirmed: "bg-green-50 border-green-200 text-green-700",
      Dispatched: "bg-blue-50 border-blue-200 text-blue-700",
      Delivered: "bg-purple-50 border-purple-200 text-purple-700",
      Cancelled: "bg-red-50 border-red-200 text-red-700"
    };
    extra = map[value];
  }

  return (
    <div className={`p-4 rounded-xl border ${extra}`}>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-semibold mt-1">{value}</div>
    </div>
  );
}
