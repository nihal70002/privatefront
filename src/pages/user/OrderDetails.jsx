import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderDetails, cancelOrder } from "../../api/orders.api";
import { ArrowLeft, Pencil, XCircle } from "lucide-react";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const isEditable =
    order?.status === "PendingSalesApproval";

  useEffect(() => {
    getOrderDetails(id)
      .then(res => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancelOrder = async () => {
    if (!window.confirm("Cancel this order?")) return;

    try {
      await cancelOrder(id);
      navigate("/orders");
    } catch {
      alert("Unable to cancel order");
    }
  };

  /* -------------------- LOADING -------------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Loading order details...
        </p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-lg">
          Order not found
        </p>
      </div>
    );
  }

  /* -------------------- STATUS COLOR -------------------- */

  const getStatusColor = () => {
    if (order.status === "Delivered")
      return "bg-green-100 text-green-700";

    if (order.status === "PendingSalesApproval")
      return "bg-yellow-100 text-yellow-700";

    if (order.status === "Cancelled")
      return "bg-red-100 text-red-600";

    return "bg-gray-100 text-gray-700";
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-6"
        >
          <ArrowLeft size={18} />
          Back to orders
        </button>

        {/* ORDER SUMMARY */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

          <div className="flex justify-between items-center">

            <h1 className="text-2xl font-bold">
              Order #{order.orderId}
            </h1>

            <span
              className={`px-4 py-1 rounded-full text-sm font-semibold ${getStatusColor()}`}
            >
              {order.status}
            </span>

          </div>

          {/* ACTION BUTTONS */}

          {isEditable && (
            <div className="flex gap-3 mt-4">

              <button
                onClick={() =>
                  navigate(`/orders/edit/${order.orderId}`)
                }
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
              >
                <Pencil size={16} />
                Edit Order
              </button>

              <button
                onClick={handleCancelOrder}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                <XCircle size={16} />
                Cancel Order
              </button>

            </div>
          )}

          {/* SUMMARY GRID */}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mt-6">

            <div>
              <p className="text-gray-500">
                Order Date
              </p>

              <p className="font-semibold">
                {new Date(
                  order.orderDate
                ).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Delivered Date
              </p>

              <p className="font-semibold">
                {order.deliveredDate
                  ? new Date(
                      order.deliveredDate
                    ).toLocaleDateString()
                  : "Not delivered yet"}
              </p>
            </div>

            <div>
              <p className="text-gray-500">
                Total Amount
              </p>

              <p className="font-bold text-lg text-teal-600">
                SAR {order.totalAmount}
              </p>
            </div>

          </div>
        </div>

        {/* ORDER ITEMS */}

        <div className="bg-white rounded-2xl shadow-md p-6">

          <h2 className="text-xl font-bold mb-4">
            Ordered Items
          </h2>

          <div className="divide-y">

            {order.items.map(item => (

              <div
                key={item.productId}
                className="flex items-center gap-4 py-4"
              >

                <img
                  src={
                    item.productImage ||
                    "/placeholder.png"
                  }
                  alt={item.productName}
                  className="w-20 h-20 object-cover rounded-xl border"
                />

                <div className="flex-1">

                  <p className="font-semibold text-gray-800">
                    {item.productName}
                  </p>

                  <p className="text-sm text-gray-500">
                    Qty: {item.quantity} × SAR 
                    {item.unitPrice}
                  </p>

                </div>

                <p className="font-bold text-gray-800">
                  SAR {item.subtotal}
                </p>

              </div>

            ))}

          </div>

          {/* TOTAL */}

          <div className="flex justify-between items-center border-t pt-4 mt-4">

            <p className="text-lg font-semibold">
              Grand Total
            </p>

            <p className="text-2xl font-bold text-teal-600">
              SAR {order.totalAmount}
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}