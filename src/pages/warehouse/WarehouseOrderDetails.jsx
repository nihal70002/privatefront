import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function WarehouseOrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    api.get(`/warehouse/orders/${orderId}`)
      .then(res => setOrder(res.data))
      .catch(() => toast.error("Failed to load order"))
      .finally(() => setLoading(false));
  }, [orderId]);

  const confirmOrder = async () => {
    try {
      setConfirming(true);
      await api.post(`/warehouse/orders/${orderId}/approve`);
      toast.success("Order confirmed by warehouse");
      navigate("/warehouse/orders/pending");
    } catch {
      toast.error("Confirm failed");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) return <div className="p-10">Loading...</div>;
  if (!order) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-black">Order #{order.orderId}</h2>

      {/* CUSTOMER */}
      <div className="bg-white rounded-xl p-4 shadow">
        <p><b>Customer:</b> {order.customerName}</p>
        <p><b>Company:</b> {order.companyName}</p>
        <p><b>Status:</b> {order.status}</p>
      </div>

      {/* ITEMS */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-2 text-left">Product</th>
              <th className="px-4 py-2">Size</th>
              <th className="px-4 py-2">Qty</th>
              <th className="px-4 py-2 text-right">Unit Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((i, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-4 py-2">{i.productName}</td>
                <td className="px-4 py-2 text-center">{i.size}</td>
                <td className="px-4 py-2 text-center">{i.quantity}</td>
                <td className="px-4 py-2 text-right">₹{i.unitPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ACTION */}
      <div className="flex justify-end gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg border"
        >
          Back
        </button>

        <button
          onClick={confirmOrder}
          disabled={confirming}
          className="px-5 py-2 rounded-lg bg-emerald-600 text-white font-bold disabled:opacity-40"
        >
          Confirm Order
        </button>
      </div>
    </div>
  );
}
