import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, Search, Plus, Edit2, Trash2, Eye, EyeOff, 
  Building2, Phone, Mail, ChevronRight, X 
} from "lucide-react";
import api from "../../api/axios";

export default function SalesExecutives() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    salesExecutiveId: null,
    name: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    password: ""
  });

  const loadData = async () => {
    try {
      const res = await api.get("/admin/sales-executives/summary");
      setData(res.data);
      setFiltered(res.data);
    } catch (e) { console.error(e); } 
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(data.filter(se => 
      se.name?.toLowerCase().includes(q) || se.companyName?.toLowerCase().includes(q)
    ));
  }, [search, data]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ salesExecutiveId: null, name: "", companyName: "", email: "", phoneNumber: "", password: "" });
    setShowPassword(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEdit) await api.put(`/admin/${form.salesExecutiveId}`, form);
      else await api.post("/admin/create-sales-executive", form);
      setShowModal(false);
      resetForm();
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally { setSubmitting(false); }
  };

  const openEdit = (e, se) => {
    e.stopPropagation();
    setIsEdit(true);
    setForm({ ...se, password: "" });
    setShowModal(true);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm("Delete this executive?")) return;
    try {
      await api.delete(`/admin/${id}`);
      loadData();
    } catch { alert("Delete failed"); }
  };

  if (loading) return (
    <div className="h-full w-full flex items-center justify-center bg-[#FAFBFC]">
      <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div style={{ zoom: "80%" }} className="flex-1 overflow-y-auto p-10 bg-[#FAFBFC] text-slate-900">
      <div className="max-w-[1700px] mx-auto space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Sales Executives</h1>
            <p className="text-slate-500 text-base font-medium">Manage your sales team and their performance.</p>
          </div>
          <button
            onClick={() => { resetForm(); setIsEdit(false); setShowModal(true); }}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus size={18} />
            Add Executive
          </button>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none shadow-sm"
            placeholder="Search by name, email or company..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[13px] uppercase font-black text-slate-400 tracking-wider">Executive Details</th>
                <th className="px-6 py-4 text-[13px] uppercase font-black text-slate-400 tracking-wider">Company</th>
                <th className="px-6 py-4 text-[13px] uppercase font-black text-slate-400 tracking-wider">Contact</th>
                <th className="px-6 py-4 text-[13px] uppercase font-black text-slate-400 tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(se => (
                <tr 
                  key={se.salesExecutiveId} 
                  onClick={() => navigate(`/admin/sales-executives/${se.salesExecutiveId}`)}
                  className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-100">
                        {se.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-base font-bold text-slate-800">{se.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{se.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-base font-semibold text-slate-600">{se.companyName || "—"}</td>
                  <td className="px-6 py-4 text-base font-medium text-slate-500">{se.phoneNumber}</td>
                  
                  <td className="px-6 py-4">
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={e => openEdit(e, se)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={e => handleDelete(e, se.salesExecutiveId)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                      <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-slate-800">
                  {isEdit ? "Update Profile" : "New Executive"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Full Name</label>
                  <input name="name" value={form.name} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Company</label>
                  <input name="companyName" value={form.companyName} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="Enterprise Inc." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Email</label>
                    <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="john@email.com" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Phone</label>
                    <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required className="w-full bg-slate-50 border-none rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-500" placeholder="+91..." />
                  </div>
                </div>

                {!isEdit && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Password</label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-50 border-none rounded-2xl p-3.5 text-sm focus:ring-2 focus:ring-indigo-500 pr-12"
                        placeholder="••••••••"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3.5 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-[2] px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-50 transition-all"
                  >
                    {submitting ? "Processing..." : isEdit ? "Update Executive" : "Create Account"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}