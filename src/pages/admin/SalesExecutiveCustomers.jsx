import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Users, Building2, Mail, Phone, Search, Download } from "lucide-react";
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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="animate-spin h-14 w-14 border-4 border-indigo-600 border-t-transparent rounded-full mb-6" />
      <p className="text-3xl font-black text-slate-400 uppercase tracking-[0.2em]">Loading Directory...</p>
    </div>
  );

  return (
    <div style={{ zoom: "80%" }} className="min-h-screen bg-[#F8FAFC] p-12 font-sans antialiased">
      <div className="max-w-[1600px] mx-auto space-y-12">
        
        {/* TOP NAV & TOOLS */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 text-indigo-600 font-black text-2xl hover:-translate-x-2 transition-transform uppercase tracking-widest"
          >
            <ChevronLeft size={32} strokeWidth={3} /> Back
          </button>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
              <input 
                type="text"
                placeholder="Search customers..."
                className="pl-16 pr-8 py-5 w-full sm:w-[450px] rounded-[2rem] border-4 border-white bg-white shadow-xl shadow-slate-200/50 outline-none focus:border-indigo-500 font-bold text-xl transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-white p-5 rounded-[2rem] border-4 border-white shadow-xl shadow-slate-200/50 text-slate-400 hover:text-indigo-600 transition-colors">
              <Download size={28} />
            </button>
          </div>
        </div>

        {/* PAGE HEADER */}
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-6">
            <div className="p-6 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-200">
              <Users size={48} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">Customer Base</h1>
              <p className="text-2xl text-slate-500 font-bold mt-4">Verified business accounts assigned to this executive.</p>
            </div>
          </div>
          <div className="text-right">
             <span className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Active Directory</span>
             <p className="text-6xl font-black text-indigo-600 mt-2">{filteredCustomers.length}</p>
          </div>
        </div>

        {/* CUSTOMER TABLE */}
        <div className="bg-white rounded-[4rem] shadow-2xl shadow-slate-200/60 border-4 border-white overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b-4 border-slate-100">
                <th className="p-10 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Contact Identity</th>
                <th className="p-10 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Organization</th>
                <th className="p-10 text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Email Address</th>
                <th className="p-10 text-xs font-black text-slate-400 uppercase tracking-[0.2em] text-right">Phone Number</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-50">
              {filteredCustomers.map((c) => (
                <tr key={c.customerId} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="p-10">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {c.name.charAt(0)}
                      </div>
                      <span className="text-3xl font-black text-slate-800 tracking-tight">{c.name}</span>
                    </div>
                  </td>
                  <td className="p-10">
                    <div className="flex items-center gap-3 text-indigo-600">
                      <Building2 size={24} className="opacity-50" />
                      <span className="text-2xl font-black tracking-tight">{c.companyName || "Personal Account"}</span>
                    </div>
                  </td>
                  <td className="p-10">
                    <div className="flex items-center gap-3 text-slate-500 font-bold text-xl">
                      <Mail size={22} className="text-slate-300" />
                      {c.email}
                    </div>
                  </td>
                  <td className="p-10 text-right">
                    <div className="inline-flex items-center gap-3 bg-slate-100 px-6 py-3 rounded-2xl text-slate-700 font-black text-xl group-hover:bg-white group-hover:shadow-md transition-all">
                      <Phone size={20} className="text-indigo-500" />
                      {c.phoneNumber}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCustomers.length === 0 && (
            <div className="p-32 text-center">
               <p className="text-3xl font-black text-slate-300 uppercase tracking-widest">No customer data found</p>
            </div>
          )}
        </div>

        {/* FOOTER SPACER */}
        <div className="h-20" />
      </div>
    </div>
  );
}