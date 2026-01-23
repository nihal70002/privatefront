import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import {
  Users, ShoppingBag, IndianRupee, Mail, Search,
  ChevronRight, UserCircle, Loader2, Package, TrendingUp, BarChart3,
  Plus, X, Lock, Building, Phone, ArrowLeft, Eye
} from "lucide-react";

/* ================= MODERN STATUS BADGE ================= */
const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase();
  const styles = {
    confirmed: "bg-indigo-100 text-indigo-700",
    completed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    dispatched: "bg-blue-100 text-blue-700",
    delivered: "bg-emerald-100 text-emerald-700",
  };
  return (
    <span className={`px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold ${styles[s] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
};

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [salesExecutives, setSalesExecutives] = useState([]);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "", companyName: "", email: "", phoneNumber: "", password: "", salesExecutiveId: ""
  });

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    try {
      const res = await api.get("/admin/users");
      setCustomers(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleUserSelect = async (userId) => {
    setDetailLoading(true);
    setShowDetailView(true);
    try {
      const userRes = await api.get(`/admin/users/${userId}/details`);
      setSelectedUser(userRes.data);
    } catch {
      alert("Failed to load customer data");
      setShowDetailView(false);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (showAddModal) loadSalesExecutives();
  }, [showAddModal]);

  const loadSalesExecutives = async () => {
    try {
      const res = await api.get("/admin/sales-executives");
      setSalesExecutives(res.data);
    } catch (err) { console.error("Failed to load sales executives"); }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/admin/customers", {
        ...formData,
        salesExecutiveId: Number(formData.salesExecutiveId)
      });
      alert("Customer Created Successfully!");
      setShowAddModal(false);
      setFormData({ name: "", companyName: "", email: "", phoneNumber: "", password: "", salesExecutiveId: "" });
      loadCustomers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create customer");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= CALCULATION LOGIC ================= */
  const { derivedStats, groupedProducts } = useMemo(() => {
    if (!selectedUser?.orderHistory) return { derivedStats: { total: 0, count: 0, avg: 0 }, groupedProducts: [] };
    const total = selectedUser.orderHistory.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const count = selectedUser.orderHistory.length;
    const avg = count > 0 ? total / count : 0;
    const productMap = {};
    selectedUser.orderHistory.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const name = item.productName || item.name;
          if (!productMap[name]) productMap[name] = { productName: name, quantityBought: 0, revenue: 0 };
          productMap[name].quantityBought += Number(item.quantity);
          productMap[name].revenue += (Number(item.price) * Number(item.quantity));
        });
      }
    });
    return { derivedStats: { total, count, avg }, groupedProducts: Object.values(productMap).sort((a, b) => b.revenue - a.revenue) };
  }, [selectedUser]);

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#FAFBFC]">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div style={{ zoom: "85%" }} className="min-h-screen bg-[#FAFBFC] p-8 font-sans antialiased text-slate-900">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Customers</h1>
            <p className="text-slate-500 font-medium">Manage your client directory and purchase insights.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
          >
            <Plus size={20} />
            Create Customer
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            placeholder="Search by name, email or company..."
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-[1.5rem] text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all shadow-sm"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* MAIN TABLE */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Customer Identity</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Company</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400">Contact</th>
                <th className="px-8 py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((c) => (
                <tr key={c.userId} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm border border-indigo-100">
                        {c.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{c.name}</p>
                        <p className="text-xs text-slate-400 font-medium">{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-semibold text-slate-600">{c.companyName || "—"}</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{c.phoneNumber || "N/A"}</td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => handleUserSelect(c.userId)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      <Eye size={14} /> View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL OVERLAY VIEW */}
      {showDetailView && (
        <div className="fixed inset-0 z-[100] bg-[#FAFBFC] overflow-y-auto animate-in slide-in-from-right duration-300">
          <div className="max-w-5xl mx-auto p-8 space-y-8">
            {/* Back Nav */}
            <button 
              onClick={() => setShowDetailView(false)}
              className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-colors"
            >
              <ArrowLeft size={20} /> Back to Directory
            </button>

            {detailLoading ? (
               <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>
            ) : selectedUser && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* Profile Header */}
                <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-wrap justify-between items-center gap-6">
                  <div className="flex items-center gap-8">
                    <div className="w-28 h-28 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                      <UserCircle size={60} strokeWidth={1} />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black text-slate-800">{selectedUser.name}</h2>
                      <div className="flex gap-4 mt-3">
                        <span className="flex items-center gap-2 text-sm font-bold text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full"><Mail size={14}/> {selectedUser.email}</span>
                        <span className="flex items-center gap-2 text-sm font-bold text-slate-400 bg-slate-50 px-4 py-1.5 rounded-full"><Building size={14}/> {selectedUser.companyName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Total Lifetime Value</p>
                    <p className="text-4xl font-black">₹{derivedStats.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6">
                    <div className="p-5 bg-blue-50 rounded-[1.8rem] text-blue-600"><ShoppingBag size={30}/></div>
                    <div><p className="text-3xl font-black">{derivedStats.count}</p><p className="text-xs font-bold text-slate-400 uppercase">Total Orders</p></div>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex items-center gap-6">
                    <div className="p-5 bg-emerald-50 rounded-[1.8rem] text-emerald-600"><IndianRupee size={30}/></div>
                    <div><p className="text-3xl font-black">₹{derivedStats.avg.toFixed(0)}</p><p className="text-xs font-bold text-slate-400 uppercase">Average Order</p></div>
                  </div>
                </div>

                {/* Insights & History */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-1 bg-white p-8 rounded-[3rem] border border-slate-100 h-fit">
                      <h3 className="font-black text-lg mb-6 flex items-center gap-2"><BarChart3 size={20} className="text-purple-600"/> Top Items</h3>
                      <div className="space-y-4">
                        {groupedProducts.slice(0, 5).map((p, i) => (
                          <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                             <div className="min-w-0 flex-1 pr-2">
                               <p className="font-bold text-slate-800 text-sm truncate">{p.productName}</p>
                               <p className="text-[10px] font-bold text-slate-400 uppercase">{p.quantityBought} Units</p>
                             </div>
                             <p className="font-black text-indigo-600 text-sm whitespace-nowrap">₹{p.revenue.toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                   </div>

                   <div className="lg:col-span-2 bg-white rounded-[3rem] border border-slate-100 overflow-hidden">
                      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                        <h3 className="font-black text-lg">Order History</h3>
                        <StatusBadge status="All Records" />
                      </div>
                      <table className="w-full">
                        <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400">
                          <tr><th className="px-8 py-4">Order ID</th><th className="px-8 py-4">Status</th><th className="px-8 py-4 text-right">Amount</th></tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {selectedUser.orderHistory?.map(o => (
                            <tr key={o.orderId} className="hover:bg-slate-50">
                              <td className="px-8 py-5 font-bold text-sm text-slate-600">#ORD-{o.orderId}</td>
                              <td className="px-8 py-5"><StatusBadge status={o.status} /></td>
                              <td className="px-8 py-5 text-right font-black text-slate-900">₹{Number(o.totalAmount).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white w-full max-w-md rounded-[3rem] overflow-hidden animate-in zoom-in-95">
            <div className="bg-indigo-600 p-10 text-white flex justify-between items-center">
              <div><h3 className="text-2xl font-black">New Customer</h3><p className="opacity-70 text-xs">Add a new account to the system</p></div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-xl"><X size={24}/></button>
            </div>
            <form onSubmit={handleCreateUser} className="p-10 space-y-4">
              <input required placeholder="Full Name" className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required placeholder="Company" className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                <input required placeholder="Phone" className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} />
              </div>
              <input required type="email" placeholder="Email Address" className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input required type="password" placeholder="Password" className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
              <select required className="w-full px-5 py-4 bg-slate-50 rounded-2xl text-sm font-bold outline-none appearance-none" value={formData.salesExecutiveId} onChange={e => setFormData({...formData, salesExecutiveId: e.target.value})} >
                <option value="">Assign Sales Executive</option>
                {salesExecutives.map(se => <option key={se.id} value={se.id}>{se.name}</option>)}
              </select>
              <button disabled={isSubmitting} className="w-full bg-indigo-600 text-white py-5 rounded-[1.8rem] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">
                {isSubmitting ? "Creating..." : "Create Profile"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}