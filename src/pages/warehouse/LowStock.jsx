import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { AlertTriangle, PackageSearch } from "lucide-react";

export default function LowStock() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedItem, setSelectedItem] = useState(null);
  const [stockValue, setStockValue] = useState("");
  const [saving, setSaving] = useState(false);

  const REORDER_POINT = 20;

  const fetchLowStock = () => {
    setLoading(true);
    api
      .get("/warehouse/inventory/low-stock-alerts")
      .then(r => {
        setItems(r.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  // =============================
  // UPDATE STOCK (SET MODE)
  // =============================
  const submitUpdate = async () => {
    if (stockValue === "" || isNaN(stockValue)) return;

    const newStock = Number(stockValue);

    if (newStock < 0) {
      toast.error("Stock cannot be negative");
      return;
    }

    try {
      setSaving(true);

      await api.put("/warehouse/inventory/update", null, {
        params: {
          variantId: selectedItem.variantId,
          quantityChange: newStock
        }
      });

      setItems(prev =>
        prev.map(item =>
          item.variantId === selectedItem.variantId
            ? {
                ...item,
                currentStock: newStock
              }
            : item
        )
      );

      toast.success("Stock updated successfully 🎉");
      setSelectedItem(null);
      setStockValue("");
    } catch (err) {
      toast.error(err?.response?.data?.error || "Failed to update stock");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="p-4 animate-pulse text-gray-400">
        Checking levels...
      </div>
    );

  return (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
          <AlertTriangle className="text-red-600" size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#2A334E]">
            Low Stock Alerts
          </h2>
          <p className="text-xs text-[#718096]">
            Products below reorder level
          </p>
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-center text-[#718096]">
          <PackageSearch size={48} className="opacity-30 mb-3" />
          <p className="font-medium">All stock levels are healthy</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(i => {
            const stockPercentage = Math.min(
              (i.currentStock / REORDER_POINT) * 100,
              100
            );

            return (
              <div
                key={i.variantId}
                className="p-4 rounded-xl border border-gray-100 hover:border-red-200 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-[#2A334E]">
                      {i.productName} ({i.size})
                    </h3>
                    <p className="text-xs text-[#718096]">
                      Variant ID: {i.variantId}
                    </p>
                  </div>

                  <span className="text-sm font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    {i.currentStock} left
                  </span>
                </div>

                {/* Progress */}
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all ${
                      i.currentStock < 5
                        ? "bg-red-500"
                        : "bg-orange-400"
                    }`}
                    style={{ width: `${stockPercentage}%` }}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setSelectedItem(i);
                      setStockValue(i.currentStock);
                    }}
                    className="text-sm font-semibold text-[#4A86F7] hover:underline"
                  >
                    Update Stock
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>

    {/* ================= MODAL ================= */}
    {selectedItem && (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
          <h3 className="text-lg font-bold text-[#2A334E] mb-1">
            Update Stock
          </h3>

          <p className="text-sm text-[#718096] mb-4">
            {selectedItem.productName} ({selectedItem.size})
          </p>

          <label className="block text-sm font-medium text-[#2A334E] mb-1">
            Final stock quantity
          </label>

          <input
            type="number"
            value={stockValue}
            onChange={e => setStockValue(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex justify-end gap-3">
            <button
              onClick={() => {
                setSelectedItem(null);
                setStockValue("");
              }}
              className="px-4 py-2 text-[#718096] hover:text-[#2A334E]"
            >
              Cancel
            </button>

            <button
              disabled={saving}
              onClick={submitUpdate}
              className="px-5 py-2 bg-[#4A86F7] text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {saving ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

}
