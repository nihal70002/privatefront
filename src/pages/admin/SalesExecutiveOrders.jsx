import { useEffect, useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function SalesExecutiveOrders() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get("type") || "all";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await api.get(
          `/admin/sales-executives/${id}/orders?type=${type}`
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to load orders", err);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [id, type]);

  if (loading) return <div className="p-10 font-bold">Loading...</div>;

  return (
    <div className="p-10 space-y-6">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="text-indigo-600 font-bold"
      >
        ← Back
      </button>

      {/* HEADER */}
      <h1 className="text-2xl font-black capitalize">
        {type} Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-slate-500 italic">No orders found</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="bg-white border rounded-xl p-4"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-bold">
                    {order.customer.name} — {order.customer.companyName}
                  </p>
                  <p className="text-sm text-slate-500">
                    {order.customer.phoneNumber} | {order.customer.email}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold">₹{order.totalAmount}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex gap-2 flex-wrap">
                {order.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-100 px-2 py-1 rounded"
                  >
                    {item.productName} ({item.size}) × {item.quantity}
                  </span>
                ))}
              </div>

              <div className="mt-2 text-xs font-bold text-indigo-600">
                Status: {order.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
