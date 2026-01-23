import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Users, TrendingUp, Calendar } from "lucide-react";
import api from "../../api/axios";

export default function SalesExecutiveDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(
          `/admin/sales-executives/${id}/performance`
        );
        setPerformance(res.data);
      } catch (err) {
        console.error("Failed to load sales executive performance", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="text-slate-600 font-semibold">Loading...</div>
      </div>
    );
  }

  if (!performance) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] flex items-center justify-center">
        <div className="text-red-600 font-semibold">Failed to load data</div>
      </div>
    );
  }

  const goToOrders = (type) => {
    navigate(`/admin/sales-executives/${id}/orders?type=${type}`);
  };

  const goToCustomers = () => {
    navigate(`/admin/sales-executives/${id}/customers`);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <div className="max-w-7xl mx-auto p-8 lg:p-12 space-y-8">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>

        {/* HEADER CARD */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {performance.name}
              </h1>
              <p className="text-slate-500 font-medium">
                Sales Executive ID: {performance.salesExecutiveId}
              </p>
            </div>
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md">
              <Users size={32} className="text-white" />
            </div>
          </div>
        </div>

        {/* ORDER STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            label="Pending Orders"
            value={performance.pendingOrders}
            icon={<ShoppingCart size={20} />}
            theme="amber"
            onClick={() => goToOrders("pending")}
          />
          <StatCard
            label="Accepted Orders"
            value={performance.acceptedOrders}
            icon={<ShoppingCart size={20} />}
            theme="emerald"
            onClick={() => goToOrders("accepted")}
          />
          <StatCard
            label="Rejected Orders"
            value={performance.rejectedOrders}
            icon={<ShoppingCart size={20} />}
            theme="rose"
            onClick={() => goToOrders("rejected")}
          />
          <StatCard
            label="Total Orders"
            value={performance.totalOrders}
            icon={<ShoppingCart size={20} />}
            theme="indigo"
            onClick={() => goToOrders("all")}
          />
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* TOTAL CUSTOMERS */}
          <StatCard
            label="Total Customers"
            value={performance.totalCustomers}
            icon={<Users size={20} />}
            theme="sky"
            onClick={goToCustomers}
            large
          />

          {/* TOTAL ORDER VALUE */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wide mb-3">
                <TrendingUp size={16} />
                Total Order Value
              </div>
              <p className="text-4xl font-bold text-slate-900 mb-4">
                ₹{(performance.totalOrderValue ?? 0).toLocaleString()}
              </p>
            </div>
            
            {performance.lastOrderDate && (
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-50 rounded-xl px-4 py-3 border border-slate-200">
                <Calendar size={16} />
                <span>
                  Last Order: {new Date(performance.lastOrderDate).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* INFO NOTE */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <p className="text-sm text-blue-700 font-medium">
            💡 Click on any card to view detailed information about orders and customers.
          </p>
        </div>
      </div>
    </div>
  );
}

/* STAT CARD COMPONENT */
function StatCard({ label, value, icon, theme, onClick, large }) {
  const themes = {
    amber: {
      bg: "bg-[#FFF9E6]",
      border: "border-amber-200",
      text: "text-amber-700",
      hover: "hover:border-amber-400 hover:shadow-amber-100"
    },
    emerald: {
      bg: "bg-[#E8F5E9]",
      border: "border-emerald-200",
      text: "text-emerald-700",
      hover: "hover:border-emerald-400 hover:shadow-emerald-100"
    },
    rose: {
      bg: "bg-[#FFEBEE]",
      border: "border-rose-200",
      text: "text-rose-700",
      hover: "hover:border-rose-400 hover:shadow-rose-100"
    },
    indigo: {
      bg: "bg-[#EDE7F6]",
      border: "border-indigo-200",
      text: "text-indigo-700",
      hover: "hover:border-indigo-400 hover:shadow-indigo-100"
    },
    sky: {
      bg: "bg-[#E3F2FD]",
      border: "border-sky-200",
      text: "text-sky-700",
      hover: "hover:border-sky-400 hover:shadow-sky-100"
    }
  };

  const currentTheme = themes[theme];

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
      className={`
        ${currentTheme.bg} ${currentTheme.border} border rounded-3xl 
        ${large ? 'p-8' : 'p-6'} 
        cursor-pointer transition-all 
        hover:shadow-lg ${currentTheme.hover}
        flex flex-col gap-3
      `}
    >
      <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wide ${currentTheme.text} opacity-80`}>
        {icon}
        {label}
      </div>
      <p className={`${large ? 'text-4xl' : 'text-3xl'} font-bold ${currentTheme.text}`}>
        {value ?? 0}
      </p>
    </div>
  );
}