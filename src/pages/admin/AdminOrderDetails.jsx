import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../api/axios";

export default function AdminOrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/admin/orders/${orderId}`).then(res => {
      setOrder(res.data);
    });
  }, [orderId]);

  const doAction = async (action) => {
    try {
      let url = `/admin/orders/${orderId}/${action}`;
      if (action === "revert") {
        url = `/admin/orders/${orderId}/revert`;
      }

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

          {order.salesExecutiveName && (
            <InfoCard
              label="Sales Executive"
              value={`${order.salesExecutiveName} (${order.salesExecutivePhone})`}
            />
          )}

          <InfoCard label="Status" value={order.status} status />
          <InfoCard
            label="Total Amount"
            value={`₹${order.totalAmount}`}
            highlight
          />
        </div>

        {/* ACTIONS */}
        <div className="bg-white border rounded-xl p-4 flex flex-wrap gap-3">
          {order.status === "PendingAdminApproval" && (
            <>
              <ActionBtn
                label="Confirm"
                variant="success"
                onClick={() =>
                  confirmAction("Confirm this order?", () => doAction("confirm"))
                }
              />
              <ActionBtn
                label="Cancel"
                variant="danger"
                onClick={() =>
                  confirmAction("Cancel this order?", () => doAction("cancel"))
                }
              />
            </>
          )}

          {order.status === "Confirmed" && (
            <>
              <ActionBtn
                label="Dispatch"
                variant="info"
                onClick={() =>
                  confirmAction("Dispatch this order?", () => doAction("dispatch"))
                }
              />
              <ActionBtn
                label="Revert"
                variant="warning"
                onClick={() =>
                  confirmAction(
                    "Revert back to Admin approval?",
                    () => doAction("revert")
                  )
                }
              />
            </>
          )}

          {order.status === "Dispatched" && (
            <ActionBtn
              label="Deliver"
              variant="primary"
              onClick={() =>
                confirmAction("Mark as delivered?", () => doAction("deliver"))
              }
            />
          )}

          {order.status === "Cancelled" && order.isRejectedBySales && (
            <ActionBtn
              label="Revert"
              variant="warning"
              onClick={() =>
                confirmAction(
                  "Send back to Sales approval?",
                  () => doAction("revert")
                )
              }
            />
          )}
        </div>

        {/* CANCEL REASON */}
        {order.status === "Cancelled" && order.rejectedReason && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="text-xs text-red-600 font-semibold">
              Cancellation Reason
            </div>
            <div className="mt-1 text-red-800 font-medium">
              {order.rejectedReason}
            </div>
          </div>
        )}

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
                <th className="px-6 py-4 text-center">Size</th>
                <th className="px-6 py-4 text-center">Quantity</th>
                <th className="px-6 py-4 text-center">Unit Price</th>
                <th className="px-6 py-4 text-center">Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-6 py-4">{item.productName}</td>
                  <td className="px-6 py-4 text-center">{item.size}</td>
                  <td className="px-6 py-4 text-center">{item.quantity}</td>
                  <td className="px-6 py-4 text-center">₹{item.unitPrice}</td>
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

/* ACTION BUTTON */
function ActionBtn({ label, variant, onClick }) {
  const variants = {
    success: "bg-emerald-600 hover:bg-emerald-700",
    danger: "bg-red-600 hover:bg-red-700",
    info: "bg-blue-600 hover:bg-blue-700",
    primary: "bg-indigo-600 hover:bg-indigo-700",
    warning: "bg-amber-500 hover:bg-amber-600",
  };

  return (
    <button
      onClick={onClick}
      className={`px-5 py-2 text-sm font-bold text-white rounded-lg ${variants[variant]}`}
    >
      {label}
    </button>
  );
}

/* INFO CARD */
function InfoCard({ label, value, highlight, status }) {
  let extra = "bg-white border-slate-200";

  if (highlight) extra = "bg-emerald-50 border-emerald-200 text-emerald-700";

  if (status) {
    const map = {
      PendingAdminApproval: "bg-orange-50 border-orange-200 text-orange-700",
      Confirmed: "bg-green-50 border-green-200 text-green-700",
      Dispatched: "bg-blue-50 border-blue-200 text-blue-700",
      Delivered: "bg-purple-50 border-purple-200 text-purple-700",
      Cancelled: "bg-red-50 border-red-200 text-red-700",
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
