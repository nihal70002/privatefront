import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Search, Plus, Users, CheckCircle, MousePointer2, ChevronRight, Building2, Phone, Mail } from "lucide-react";

export default function SalesCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/sales/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) =>
    `${c.companyName} ${c.name} ${c.email} ${c.phoneNumber}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F4F7F9]">
        <div className="animate-spin h-8 w-8 border-4 border-[#4A86F7] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7F9] pt-20 pb-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#2A334E]">Assigned Customers</h1>
            <p className="text-[#718096] text-sm mt-1">Manage your customer relationships</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718096]" size={18} />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 pr-4 py-3 w-full border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#4A86F7]/30 transition-all shadow-sm"
              />
            </div>

            <button
              onClick={() => navigate("/sales/customers/create")}
              className="flex items-center justify-center gap-2 bg-[#2A334E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#1F2937] transition-all shrink-0 shadow-sm"
            >
              <Plus size={18} />
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* STATS BAR - 2x2 on Mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <StatMiniCard 
            label="Total" 
            value={customers.length} 
            icon={<Users className="text-[#4A86F7]" size={20} />} 
            bg="bg-blue-50" 
          />
          <StatMiniCard 
            label="Active" 
            value={customers.length} 
            icon={<CheckCircle className="text-[#48BB78]" size={20} />} 
            bg="bg-green-50" 
          />
          <StatMiniCard 
            label="Found" 
            value={filteredCustomers.length} 
            icon={<MousePointer2 className="text-purple-600" size={20} />} 
            bg="bg-purple-50" 
            className="col-span-2 md:col-span-1"
          />
        </div>

        {/* MOBILE VIEW: 2x2 GRID OF CARDS */}
        <div className="grid grid-cols-2 md:hidden gap-3">
          {filteredCustomers.map((c) => (
            <div 
              key={c.id} 
              onClick={() => navigate(`/sales/customers/${c.id}`)}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between active:scale-95 transition-transform"
            >
              <div>
                <div className="w-10 h-10 rounded-lg bg-[#4A86F7]/10 flex items-center justify-center mb-3">
                   <span className="text-[#4A86F7] font-bold text-sm">
                    {c.companyName?.charAt(0)?.toUpperCase() || "C"}
                   </span>
                </div>
                <h3 className="text-sm font-bold text-[#2A334E] line-clamp-1">{c.companyName}</h3>
                <p className="text-[11px] text-[#718096] mb-2">{c.name}</p>
              </div>
              
              <div className="space-y-1.5 pt-2 border-t border-gray-50">
                <div className="flex items-center gap-1.5 text-[10px] text-[#718096]">
                  <Phone size={10} className="shrink-0" />
                  <span className="truncate">{c.phoneNumber}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                   <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[9px] font-bold uppercase">
                     {c.size || 'N/A'}
                   </span>
                   <ChevronRight size={14} className="text-gray-300" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* DESKTOP VIEW: TABLE (Hidden on mobile) */}
        <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F4F7F9]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#718096]">Company</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#718096]">Contact Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#718096]">Email</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#718096]">Phone</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#718096]">Variant</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase text-[#718096] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#4A86F7]/10 flex items-center justify-center font-bold text-[#4A86F7]">
                          {c.companyName?.charAt(0)?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-[#2A334E]">{c.companyName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#2A334E] text-sm">{c.name}</td>
                    <td className="px-6 py-4 text-[#718096] text-sm">{c.email}</td>
                    <td className="px-6 py-4 text-[#718096] text-sm">{c.phoneNumber}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md bg-teal-50 text-teal-700 text-xs font-bold">{c.size}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => navigate(`/sales/customers/${c.id}`)}
                        className="text-[#4A86F7] hover:underline font-bold text-sm"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-[#718096]">No matching customers found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatMiniCard({ label, value, icon, bg, className = "" }) {
  return (
    <div className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3 ${className}`}>
      <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-[#718096] text-[10px] sm:text-xs font-medium uppercase tracking-wider">{label}</p>
        <p className="text-lg sm:text-xl font-extrabold text-[#2A334E]">{value}</p>
      </div>
    </div>
  );
}