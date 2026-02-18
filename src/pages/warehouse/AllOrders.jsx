import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Building2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  X,
  Eye,
  Package,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const PAGE_SIZE = 10;

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filters, setFilters] = useState({
    company: "",
    salesExec: "",
    status: "",
    fromDate: "",
    toDate: "",
  });

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/warehouse/orders");
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let data = [...orders];

    if (filters.company) {
      data = data.filter((o) =>
        o.customer?.name?.toLowerCase().includes(filters.company.toLowerCase())
      );
    }

    if (filters.salesExec) {
      data = data.filter((o) =>
        o.salesExecutive?.name
          ?.toLowerCase()
          .includes(filters.salesExec.toLowerCase())
      );
    }

    if (filters.status) {
      data = data.filter((o) => o.status === filters.status);
    }

    if (filters.fromDate) {
      data = data.filter(
        (o) => new Date(o.orderDate) >= new Date(filters.fromDate)
      );
    }

    if (filters.toDate) {
      data = data.filter(
        (o) => new Date(o.orderDate) <= new Date(filters.toDate)
      );
    }

    setFilteredOrders(data);
    setPage(1);
  }, [filters, orders]);

  const clearFilters = () => {
    setFilters({
      company: "",
      salesExec: "",
      status: "",
      fromDate: "",
      toDate: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((val) => val !== "");

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const exportToCSV = () => {
    const headers = [
      "Order ID",
      "Date",
      "Company",
      "Sales Executive",
      "Status",
      "Total Quantity",
      "Total Amount",
    ];
    const rows = filteredOrders.map((o) => [
      o.orderId,
      new Date(o.orderDate).toLocaleDateString(),
      o.customer?.name || "",
      o.salesExecutive?.name || "",
      o.status,
      o.totalQuantity || 0,
      o.totalAmount || 0,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const toggleExpand = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                All Orders
              </h1>
              <p className="text-gray-600">
                Manage and track all warehouse orders
              </p>
            </div>
            <button
              onClick={fetchOrders}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border transition-all shadow-sm ${
                showFilters || hasActiveFilters
                  ? "bg-blue-600 text-white border-blue-600 shadow-blue-100"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs font-semibold">
                  {Object.values(filters).filter((v) => v).length}
                </span>
              )}
            </button>

            <button
              onClick={exportToCSV}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Filter Orders
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Company Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search company..."
                    value={filters.company}
                    onChange={(e) =>
                      setFilters({ ...filters, company: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              {/* Sales Executive Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sales Executive
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search executive..."
                    value={filters.salesExec}
                    onChange={(e) =>
                      setFilters({ ...filters, salesExec: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-shadow"
                >
                  <option value="">All Status</option>
                  <option value="PendingWarehouseApproval">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="Delivered">Delivered</option>
                  <option value="RejectedByWarehouse">Rejected</option>
                </select>
              </div>

              {/* From Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={filters.fromDate}
                    onChange={(e) =>
                      setFilters({ ...filters, fromDate: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>

              {/* To Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={filters.toDate}
                    onChange={(e) =>
                      setFilters({ ...filters, toDate: e.target.value })
                    }
                    className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{paginatedOrders.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{filteredOrders.length}</span> orders
          </p>
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-100">
                {Object.values(filters).filter((v) => v).length} active filter(s)
              </span>
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                    Sales Executive
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                    Quantity
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedOrders.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-16 text-center">
                      <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 font-medium text-lg mb-2">
                        {hasActiveFilters
                          ? "No orders match your filters"
                          : "No orders found"}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-blue-600 hover:text-blue-700 font-medium text-sm mt-2 transition-colors"
                        >
                          Clear filters
                        </button>
                      )}
                    </td>
                  </tr>
                )}

                {paginatedOrders.map((order) => (
                  <>
                    <tr
                      key={order.orderId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-900">
                          #{order.orderId}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="max-w-xs">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {order.customer?.name || "-"}
                          </p>
                          {order.customer?.email && (
                            <p className="text-xs text-gray-500 truncate">
                              {order.customer.email}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden lg:table-cell">
                        {order.salesExecutive?.name ?? "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900 hidden sm:table-cell">
                        {order.totalQuantity || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900 hidden md:table-cell">
                        ₹{order.totalAmount?.toLocaleString("en-IN") || "0"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => toggleExpand(order.orderId)}
                          className="inline-flex items-center justify-center p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={
                            expandedOrderId === order.orderId
                              ? "Hide details"
                              : "View details"
                          }
                        >
                          {expandedOrderId === order.orderId ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </td>
                    </tr>

                    {/* Expanded Order Details */}
                    {expandedOrderId === order.orderId && (
                      <tr>
                        <td colSpan="8" className="bg-gray-50 px-6 py-4">
                          <OrderDetails order={order} />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredOrders.length > PAGE_SIZE && (
            <div className="border-t border-gray-200 bg-white px-6 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-600">
                  Page <span className="font-semibold text-gray-900">{page}</span> of{" "}
                  <span className="font-semibold text-gray-900">{totalPages}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium text-gray-700">
                    {page} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== ORDER DETAILS COMPONENT ===== */
function OrderDetails({ order }) {
  return (
    <div className="space-y-6">
      {/* Order Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Total Amount
          </p>
          <p className="text-2xl font-bold text-gray-900">
            ₹{order.totalAmount?.toLocaleString("en-IN") || "0"}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Total Quantity
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {order.totalQuantity || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Sales Executive
          </p>
          <p className="text-lg font-semibold text-gray-900 truncate">
            {order.salesExecutive?.name || "N/A"}
          </p>
        </div>
      </div>

      {/* Order Items Table */}
      {order.items && order.items.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-4 h-4" />
              Order Items ({order.items.length})
            </h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Product
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Unit Price
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div>
  <p className="text-sm font-semibold text-gray-900">
    {item.productName || "-"}
  </p>

  {(item.variantSize ||
    item.class ||
    item.style ||
    item.material ||
    item.color) && (
    <div className="flex flex-wrap gap-2 mt-1">
      {item.variantSize && (
        <span className="px-2 py-0.5 text-[11px] bg-indigo-50 text-indigo-700 rounded">
          Size: {item.variantSize}
        </span>
      )}

      {item.class && (
        <span className="px-2 py-0.5 text-[11px] bg-blue-50 text-blue-700 rounded">
          {item.class}
        </span>
      )}

      {item.style && (
        <span className="px-2 py-0.5 text-[11px] bg-purple-50 text-purple-700 rounded">
          {item.style}
        </span>
      )}

      {item.material && (
        <span className="px-2 py-0.5 text-[11px] bg-amber-50 text-amber-700 rounded">
          {item.material}
        </span>
      )}

      {item.color && (
        <span className="px-2 py-0.5 text-[11px] bg-gray-100 text-gray-700 rounded">
          {item.color}
        </span>
      )}
    </div>
  )}
</div>

                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-900 font-medium">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-sm text-gray-900">
                      ₹{item.unitprice?.toLocaleString("en-IN") || "0"}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                      ₹{((item.quantity || 0) * (item.unitPrice || 0)).toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan="3" className="px-4 py-3 text-right text-sm text-gray-900">
                    Total:
                  </td>
                  <td className="px-4 py-3 text-right text-sm text-gray-900">
                    ₹{order.totalAmount?.toLocaleString("en-IN") || "0"}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== STATUS BADGE COMPONENT ===== */
function StatusBadge({ status }) {
  const statusConfig = {
    PendingWarehouseApproval: {
      label: "Pending",
      className: "bg-yellow-50 text-yellow-700 border-yellow-200",
    },
    Confirmed: {
      label: "Confirmed",
      className: "bg-green-50 text-green-700 border-green-200",
    },
    Dispatched: {
      label: "Dispatched",
      className: "bg-blue-50 text-blue-700 border-blue-200",
    },
    Delivered: {
      label: "Delivered",
      className: "bg-gray-50 text-gray-700 border-gray-200",
    },
    RejectedByWarehouse: {
      label: "Rejected",
      className: "bg-red-50 text-red-700 border-red-200",
    },
  };

  const config = statusConfig[status] || {
    label: status,
    className: "bg-gray-50 text-gray-700 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${config.className}`}
    >
      {config.label}
    </span>
  );
}

/* ===== LOADING SKELETON ===== */
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
        </div>

        {/* Filters Skeleton */}
        <div className="flex gap-3 mb-6">
          <div className="h-11 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
          <div className="h-11 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
        </div>

        {/* Table Skeleton */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-12 bg-gray-200 rounded flex-1"></div>
                <div className="h-12 bg-gray-200 rounded flex-1"></div>
                <div className="h-12 bg-gray-200 rounded flex-1"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}