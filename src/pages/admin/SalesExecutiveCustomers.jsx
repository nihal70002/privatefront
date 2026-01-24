import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Users, Building2, Mail, Phone, Search, Download, MoreVertical } from "lucide-react";
import api from "../../api/axios";

export default function SalesExecutiveCustomers() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const res = await api.get(`/admin/sales-executives/${id}/customers`);
        setCustomers(res.data);
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadCustomers();
  }, [id]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
    // Reduced padding-top (pt-4) and general padding to push content upwards
    <div className="min-h-screen bg-[#F8FAFC] px-6 pt-4 pb-10 font-sans antialiased text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        {/* COMPACT HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div className="space-y-1">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-1.5 text-slate-400 hover:text-indigo-600 transition-colors mb-2"
            >
              <ChevronLeft size={16} />
              <span className="text-[11px] font-bold uppercase tracking-widest">Back to Executives</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-lg text-white shadow-md shadow-indigo-100">
                <Users size={22} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight leading-none">Customer Base</h1>
                <p className="text-slate-500 text-xs mt-1">Managing {filteredCustomers.length} verified accounts</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search..."
                className="pl-9 pr-4 py-2 w-full md:w-60 rounded-lg border border-slate-200 bg-white shadow-sm outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-white border border-slate-200 p-2 rounded-lg text-slate-500 hover:bg-slate-50 transition-colors shadow-sm">
              <Download size={16} />
            </button>
          </div>
        </div>

        {/* COMPACT DATA TABLE */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Identity</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Organization</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</th>
                  <th className="px-5 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCustomers.map((c) => (
                  <tr key={c.customerId} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 font-bold text-xs group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          {c.name.charAt(0)}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 text-slate-600">
                        <Building2 size={13} className="text-slate-300" />
                        <span className="text-xs font-medium">{c.companyName || "Personal Account"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2 text-slate-500 text-xs">
                        <Mail size={13} className="text-slate-300" />
                        {c.email}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="inline-flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-md text-slate-600 text-[11px] font-bold">
                        <Phone size={11} className="text-indigo-400" />
                        {c.phoneNumber}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                       <button className="p-1 text-slate-300 hover:text-slate-500 transition-colors">
                          <MoreVertical size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredCustomers.length === 0 && (
            <div className="py-12 text-center">
               <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">No customers found</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}