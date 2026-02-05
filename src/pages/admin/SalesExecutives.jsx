import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Edit2,
  Eye,
  EyeOff,
  ChevronRight,
  X,
  CheckCircle2,
  Mail,
  Building2,
  Phone
} from "lucide-react";
import api from "../../api/axios";

export default function SalesExecutives() {
  const navigate = useNavigate();

  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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
    password: "",
    isActive: true
  });

  const loadData = async () => {
    try {
      const res = await api.get("/admin/sales-executives/summary");
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch sales executives", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = [...data];
    if (statusFilter === "active") result = result.filter(x => x.isActive);
    if (statusFilter === "inactive") result = result.filter(x => !x.isActive);

    const q = search.toLowerCase();
    result = result.filter(x =>
      x.name?.toLowerCase().includes(q) ||
      x.companyName?.toLowerCase().includes(q) ||
      x.email?.toLowerCase().includes(q)
    );
    setFiltered(result);
  }, [search, statusFilter, data]);

  const handleChange = e => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const resetForm = () => {
    setForm({
      salesExecutiveId: null,
      name: "",
      companyName: "",
      email: "",
      phoneNumber: "",
      password: "",
      isActive: true
    });
    setShowPassword(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/admin/${form.salesExecutiveId}`, form);
      } else {
        await api.post("/admin/create-sales-executive", form);
      }
      setShowModal(false);
      resetForm();
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Action failed");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleStatus = async (e, se) => {
    e.stopPropagation();
    const action = se.isActive ? "inactivate" : "reactivate";
    if (!window.confirm(`Are you sure you want to ${action} this executive?`)) return;

    try {
      if (se.isActive) {
        await api.post(`/admin/inactivate/${se.salesExecutiveId}`);
      } else {
        await api.post(`/admin/reactivate/${se.salesExecutiveId}`);
      }
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {/* INJECT CUSTOM SCROLLBAR CSS */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #6366F1; }
      `}</style>

      {/* FIXED TOP HEADER */}
      <div className="px-6 py-5 bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Sales Executives
          </h1>
          <p className="text-xs text-slate-500 font-medium">Manage team access and performance status.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsEdit(false); setShowModal(true); }}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-md shadow-indigo-100 active:scale-95 text-sm"
        >
          <Plus size={16} />
          <span>Add Executive</span>
        </button>
      </div>

      {/* SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto custom-scroll p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* CONTROLS AREA */}
          <div className="bg-white rounded-2xl border border-slate-200 p-3 shadow-sm flex flex-col lg:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border-none focus:ring-1 focus:ring-indigo-500/20 text-sm font-medium transition-all"
                placeholder="Search team..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="flex bg-slate-100 p-1 rounded-xl">
              {["all", "active", "inactive"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                    statusFilter === tab
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto custom-scroll">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Executive</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Company</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">Status</th>
                    <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.map(se => (
                    <tr
                      key={se.salesExecutiveId}
                      onClick={() => navigate(`/admin/sales-executives/${se.salesExecutiveId}`)}
                      className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-sm">
                            {se.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors">
                              {se.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium truncate max-w-[150px]">
                              {se.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                          <Building2 size={14} className="text-slate-300" />
                          {se.companyName}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            se.isActive
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          <div className={`h-1 w-1 rounded-full ${se.isActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                          {se.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-1" onClick={e => e.stopPropagation()}>
                          <button
                            onClick={e => toggleStatus(e, se)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          >
                            {se.isActive ? <EyeOff size={16} /> : <CheckCircle2 size={16} />}
                          </button>
                          <button
                            onClick={() => {
                              setIsEdit(true);
                              setForm({ ...se, password: "" });
                              setShowModal(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <ChevronRight size={16} className="text-slate-200 group-hover:text-indigo-300 group-hover:translate-x-1 transition-all" />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900">{isEdit ? "Edit Profile" : "Add Executive"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg bg-slate-50 text-slate-400 hover:text-rose-500 transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Name</label>
                <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-transparent focus:ring-1 focus:ring-indigo-500/20 transition-all text-sm font-semibold outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Company</label>
                  <input name="companyName" value={form.companyName} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-transparent focus:ring-1 focus:ring-indigo-500/20 text-sm font-semibold outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Phone</label>
                  <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-transparent focus:ring-1 focus:ring-indigo-500/20 text-sm font-semibold outline-none" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Email</label>
                <input name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-transparent focus:ring-1 focus:ring-indigo-500/20 text-sm font-semibold outline-none" />
              </div>

              {!isEdit && (
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-400 uppercase ml-1">Password</label>
                  <input name="password" type={showPassword ? "text" : "password"} value={form.password} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border-transparent focus:ring-1 focus:ring-indigo-500/20 text-sm font-semibold outline-none" />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm transition-all">Cancel</button>
                <button type="submit" disabled={submitting} className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all">
                  {submitting ? "Saving..." : isEdit ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}