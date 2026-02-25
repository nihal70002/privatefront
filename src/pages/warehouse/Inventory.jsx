import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const fetchInventory = () => {
    setLoading(true);
    api
      .get("/warehouse/inventory")
      .then(r => {
        setItems(r.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load inventory");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...items];
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.size?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (sortBy === "name") {
      filtered.sort((a, b) => a.productName.localeCompare(b.productName));
    } else if (sortBy === "size") {
      filtered.sort((a, b) => (a.size || "").localeCompare(b.size || ""));
    }
    return filtered;
  }, [items, searchQuery, sortBy]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Loading Inventory</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tight">
            Warehouse Inventory
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1">
            Manage and track your product catalog
          </p>
        </div>

        {/* Statistics Card (Responsive 2-column) */}
        <div className="grid grid-cols-2 gap-3 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center transition-all hover:shadow-md">
            <p className="text-[10px] md:text-xs font-black text-indigo-500 uppercase tracking-widest mb-1">
              Total SKUs
            </p>
            <p className="text-2xl md:text-4xl font-black text-slate-800">{items.length}</p>
          </div>
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center transition-all hover:shadow-md">
            <p className="text-[10px] md:text-xs font-black text-emerald-500 uppercase tracking-widest mb-1">
              Filtered
            </p>
            <p className="text-2xl md:text-4xl font-black text-slate-800">
              {filteredAndSortedItems.length}
            </p>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium"
                  placeholder="Name or size..."
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all text-sm font-medium appearance-none"
              >
                <option value="name">Name (A-Z)</option>
                <option value="size">Size</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        {filteredAndSortedItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center shadow-sm">
            <p className="text-slate-400 font-bold text-sm">No items found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-4 md:px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">#</th>
                    <th className="px-4 md:px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Product Name</th>
                    <th className="px-4 md:px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Size</th>
                    <th className="px-4 md:px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:table-cell">Variant ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredAndSortedItems.map((item, index) => (
                    <tr
                      key={item.variantId}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-4 md:px-6 py-4 text-xs font-bold text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <p className="text-sm font-bold text-slate-700 truncate max-w-[150px] md:max-w-none">
                          {item.productName}
                        </p>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-black bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                          {item.size || "-"}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {item.variantId}
                        </span>
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