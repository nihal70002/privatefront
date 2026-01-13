import { useEffect, useState, useRef } from "react";
import api from "../../api/axios";
import {
  AlertTriangle,
  Loader2,
  Save,
  RefreshCw,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Inbox
} from "lucide-react";

export default function AdminLowStock() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const inputRefs = useRef({});

  useEffect(() => {
    loadLowStock();
  }, []);

  const loadLowStock = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/admin/products/low-stock", {
        params: { threshold: 10 }
      });
      setItems(res.data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to sync inventory data.");
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (item) => {
    try {
      setUpdatingId(item.variantId);
      const latestStock = Number(inputRefs.current[item.variantId]?.value);
      
      await api.put(
        `/admin/products/variant/${item.variantId}/stock`,
        null,
        { params: { stock: latestStock } }
      );
      await loadLowStock();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <LoadingState />;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 lg:p-12 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                <AlertTriangle size={20} />
              </span>
              <h1 className="text-3xl font-black tracking-tight">Stock Alerts</h1>
            </div>
            <p className="text-slate-500 font-medium">Items currently below the threshold of 10 units.</p>
          </div>

          <button
            onClick={loadLowStock}
            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 hover:shadow-sm transition-all active:scale-95"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Sync Inventory
          </button>
        </header>

        {error && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl text-rose-700 text-sm font-bold flex items-center gap-3">
             <AlertTriangle size={18} /> {error}
          </div>
        )}

        {/* CONTENT AREA */}
        {items.length === 0 ? (
          <EmptyState onRefresh={loadLowStock} />
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-50">
                    <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Product Identity</th>
                    <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400">Variant</th>
                    <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-center">Current Level</th>
                    <th className="px-8 py-5 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 text-right">Quick Refill</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {items.map(item => (
                    <tr key={item.variantId} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="font-bold text-slate-800">{item.productName}</div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">ID: {item.variantId.toString().slice(-6)}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 border border-slate-200">
                          {item.size}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col items-center">
                          <span className={`text-lg font-black ${item.stock <= 3 ? 'text-rose-600' : 'text-amber-600'}`}>
                            {item.stock}
                          </span>
                          <span className="text-[9px] font-black uppercase text-slate-300">Units Left</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-3">
                          <div className="relative">
                            <input
                              type="number"
                              min="0"
                              defaultValue={item.stock}
                              ref={el => (inputRefs.current[item.variantId] = el)}
                              className="w-24 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
                            />
                          </div>
                          <button
                            onClick={() => updateStock(item)}
                            disabled={updatingId === item.variantId}
                            className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all disabled:opacity-50 active:scale-90"
                          >
                            {updatingId === item.variantId ? (
                              <Loader2 size={20} className="animate-spin" />
                            ) : (
                              <Save size={20} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= SUB-COMPONENTS ================= */

function LoadingState() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[#F8FAFC]">
      <div className="relative">
        <div className="h-16 w-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <RefreshCw className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={20} />
      </div>
      <p className="mt-4 text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Auditing Inventory Levels...</p>
    </div>
  );
}

function EmptyState({ onRefresh }) {
  return (
    <div className="bg-white p-16 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col items-center justify-center text-center">
      <div className="h-24 w-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
        <CheckCircle2 size={48} strokeWidth={1.5} />
      </div>
      <h2 className="text-2xl font-black text-slate-800 tracking-tight">
        Inventory Optimized
      </h2>
      <p className="mt-2 text-slate-500 font-medium max-w-sm">
        Excellent! Every product variant is currently above your minimum threshold.
      </p>

      <button
        onClick={onRefresh}
        className="mt-8 flex items-center gap-2 px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
      >
        <RefreshCw size={18} /> Re-verify Stock
      </button>
    </div>
  );
}