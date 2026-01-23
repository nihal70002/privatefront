import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Trash2, ChevronLeft, ShoppingCart, CheckCircle } from "lucide-react";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const navigate = useNavigate();

  // ================= LOAD CART =================
  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCart(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Cart load error:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ================= REMOVE ITEM =================
  const handleRemove = async (productVariantId) => {
    try {
      await api.delete(`/cart/remove/${productVariantId}`);
      loadCart();
    } catch (err) {
      console.error("Remove failed", err);
      alert("Failed to remove item");
    }
  };

  // ================= UPDATE QUANTITY =================
const handleQuantityChange = async (productVariantId, newQty) => {
  if (newQty < 1) return;

  // 1️⃣ Update UI immediately (NO reload)
  setCart(prev =>
    prev.map(item =>
      item.productVariantId === productVariantId
        ? { ...item, quantity: newQty }
        : item
    )
  );

  // 2️⃣ Sync with backend
  try {
    await api.put("/cart/update", {
      productVariantId,
      quantity: newQty
    });
  } catch (err) {
    alert("Update failed, reverting");
    loadCart(); // fallback only if error
  }
};



  // ================= CHECKOUT (TEMP) =================
 const handleCheckout = async () => {
  setPlacingOrder(true);

  try {
    const payload = {
      items: cart.map(item => ({
        productVariantId: Number(item.productVariantId), // force number
        quantity: Number(item.quantity)
      }))
    };

    console.log("ORDER PAYLOAD:", payload);

    await api.post("/orders", payload);
    await api.delete("/cart/clear");

    setCart([]);
    setOrderPlaced(true);
  } catch (err) {
    console.error("Order placement failed:", err.response?.data || err);
    alert("Order failed");
  } finally {
    setPlacingOrder(false);
  }
};


  // ================= STATES =================
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-600 border-t-transparent"></div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50 p-6 text-center">
        <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-2xl border border-gray-200/50 max-w-md">
          <div className="bg-gradient-to-br from-green-100 to-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-14 h-14 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent mb-3">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-8">
            Thank you for choosing Safa Al-Tamayyuz Trading.
          </p>
          <button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-10 py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-slate-50 pb-20">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-all hover:gap-3 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">Back</span>
          </button>
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-teal-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">Shopping Cart</h1>
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-10">
        {cart.length === 0 ? (
          <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-gray-200/50">
            <div className="bg-gradient-to-br from-teal-100 to-teal-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-teal-600" />
            </div>
            <p className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</p>
            <p className="text-gray-500 mb-6">Discover our amazing products and start shopping!</p>
            <button
              onClick={() => navigate("/products")}
              className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all"
            >
              Explore Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ITEMS */}
            <div className="lg:col-span-2 space-y-5">
              {cart.map(item => (
                <div
                  key={item.productVariantId}
                  className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl shadow-md border border-gray-200/50 flex gap-5 hover:shadow-xl transition-all group"
                >
                  <div className="w-28 h-28 bg-gradient-to-br from-gray-100 to-gray-50 rounded-2xl overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                    <img
                      src={item.imageUrl}
                      alt={item.productName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 mb-1">
                        {item.productName}
                      </h3>
                      <div className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full">
                        Size: {item.size}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
                          ₹{item.price}
                        </span>
                        <div className="flex items-center gap-3">
  <button
    onClick={() =>
      handleQuantityChange(item.productVariantId, item.quantity - 1)
    }
    disabled={item.quantity === 1}
    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold disabled:opacity-50"
  >
    −
  </button>

  <span className="font-semibold">{item.quantity}</span>

  <button
    onClick={() =>
      handleQuantityChange(item.productVariantId, item.quantity + 1)
    }
    className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 font-bold"
  >
    +
  </button>
</div>

                      </div>

                      <button
                        onClick={() => handleRemove(item.productVariantId)}
                        className="p-2 text-red-400 hover:text-white hover:bg-red-500 rounded-xl transition-all hover:scale-110"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div>
              <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-gray-200/50 sticky top-28">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <span className="w-2 h-8 bg-gradient-to-b from-teal-600 to-teal-700 rounded-full"></span>
                  Order Summary
                </h3>

                <div className="space-y-4 border-b border-gray-200 pb-6 mb-6">
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-semibold text-gray-800">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="font-medium">Shipping</span>
                    <span className="px-3 py-1 bg-green-50 text-green-600 font-bold text-sm rounded-full">Free</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-600">
                    <span className="font-medium">Tax</span>
                    <span className="text-gray-500 text-sm">Included</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 mb-6">
                  <span className="text-lg font-bold text-gray-800">Total</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">₹{subtotal.toFixed(2)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={placingOrder}
                  className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform ${
                    placingOrder
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-teal-600 to-teal-700 hover:shadow-2xl hover:scale-105"
                  }`}
                >
                  {placingOrder ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></span>
                      Processing...
                    </span>
                  ) : (
                    "Confirm Order"
                  )}
                </button>
                
                <p className="text-center text-xs text-gray-500 mt-4">
                  Secure checkout • 100% satisfaction guaranteed
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}