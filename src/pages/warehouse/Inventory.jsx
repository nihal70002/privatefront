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

  // Filtering & Sorting
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            Warehouse Inventory
          </h1>
          <p className="text-slate-600">
            View and manage your product catalog
          </p>
        </div>

        {/* Statistics Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200">
              <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide mb-2">
                Total Products
              </p>
              <p className="text-4xl font-bold text-indigo-700">{items.length}</p>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200">
              <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide mb-2">
                Showing
              </p>
              <p className="text-4xl font-bold text-emerald-700">
                {filteredAndSortedItems.length}
              </p>
            </div>
          </div>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Search Products
              </label>
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                  placeholder="Search by name or size..."
                />
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
              >
                <option value="name">Name (A-Z)</option>
                <option value="size">Size</option>
              </select>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        {filteredAndSortedItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-16 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-10 h-10 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              No products found
            </h3>
            <p className="text-slate-600">
              Try adjusting your search query
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      #
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      Size
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-bold uppercase tracking-wider">
                      Variant ID
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredAndSortedItems.map((item, index) => (
                    <tr
                      key={item.variantId}
                      className="hover:bg-indigo-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-slate-600">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-base font-semibold text-slate-800">
                          {item.productName}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.size || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-slate-600">
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