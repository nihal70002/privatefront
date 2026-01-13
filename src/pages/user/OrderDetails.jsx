import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderDetails } from "../../api/orders.api";
import StatusBadge from "../../components/common/StatusBadge";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const res = await getOrderDetails(id);
      setOrder(res.data);
    } catch (err) {
      console.error("Order load failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <button
        onClick={() => navigate(-1)}
        className="text-teal-600 font-semibold mb-6"
      >
        ← Back to Orders
      </button>

      <div className="bg-white rounded-xl shadow border p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            Order #{order.orderId}
          </h2>
          <StatusBadge status={order.status} />
        </div>

        <p className="text-gray-500 mt-1">
          {new Date(order.orderDate).toLocaleString()}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow border p-6">
        <h3 className="font-bold mb-4">Items</h3>

        {order.items.map((item, idx) => (
          <div
            key={idx}
            className="flex justify-between border-b py-3"
          >
            <span>{item.productName}</span>
            <span>
              ₹{item.unitPrice} × {item.quantity}
            </span>
          </div>
        ))}

        <div className="flex justify-between font-bold text-lg pt-4">
          <span>Total</span>
          <span>₹{order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
