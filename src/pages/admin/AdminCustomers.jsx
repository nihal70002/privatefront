import { useEffect, useState, useMemo } from "react";
import api from "../../api/axios";
import {
  Users, ShoppingBag, IndianRupee, Mail, Search,
  ChevronRight, UserCircle, Loader2, Package, TrendingUp, BarChart3,
  Plus, X, Lock, Building, Phone
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
  
  // New States for User Creation
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    password: ""
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
    try {
      const userRes = await api.get(`/admin/users/${userId}/details`);
      setSelectedUser(userRes.data);
    } catch {
      alert("Failed to load customer data");
    } finally {
      setDetailLoading(false);
    }
  };

  // Create User Handler
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Matches backend schema from image_a8528e.png
      await api.post("/admin/create-user", formData);
      alert("User Created Successfully!");
      setShowAddModal(false);
      setFormData({ name: "", companyName: "", email: "", phoneNumber: "", password: "" });
      loadCustomers(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ================= LOGIC: CALCULATE STATS & INSIGHTS FROM HISTORY ================= */
  const { derivedStats, groupedProducts } = useMemo(() => {
    if (!selectedUser?.orderHistory) return { 
      derivedStats: { total: 0, count: 0, avg: 0 }, 
      groupedProducts: [] 
    };
    
    const total = selectedUser.orderHistory.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const count = selectedUser.orderHistory.length;
    const avg = count > 0 ? total / count : 0;

    const productMap = {};
    selectedUser.orderHistory.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const name = item.productName || item.name;
          if (!productMap[name]) {
            productMap[name] = { productName: name, quantityBought: 0, revenue: 0 };
          }
          productMap[name].quantityBought += Number(item.quantity);
          productMap[name].revenue += (Number(item.price) * Number(item.quantity));
        });
      }
    });

    const sortedProducts = Object.values(productMap).sort((a, b) => b.revenue - a.revenue);

    return { 
      derivedStats: { total, count, avg }, 
      groupedProducts: sortedProducts 
    };
  }, [selectedUser]);

  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans antialiased text-slate-900 relative">
      
      {/* SIDEBAR */}
      <aside className="w-80 bg-white border-r border-slate-200 flex flex-col relative">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <Users size={20} />
              </div>
              <h2 className="text-xl font-bold tracking-tight">Customers</h2>
            </div>
            {/* Add User Button inside Sidebar Header */}
            <button 
              onClick={() => setShowAddModal(true)}
              className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all"
              title="Add New User"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {filteredCustomers.map(c => (
            <button
              key={c.userId}
              onClick={() => handleUserSelect(c.userId)}
              className={`w-full p-4 rounded-xl flex items-center gap-4 transition-all duration-200
                ${selectedUser?.userId === c.userId ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" : "hover:bg-indigo-50 text-slate-600"}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs
                ${selectedUser?.userId === c.userId ? "bg-white/20" : "bg-slate-100 text-indigo-600"}`}>
                {c.name?.charAt(0)}
              </div>
              <div className="text-left flex-1">
                <p className="font-bold text-sm truncate">{c.name}</p>
                <p className={`text-[11px] truncate ${selectedUser?.userId === c.userId ? "text-indigo-100" : "text-slate-400"}`}>
                  {c.email}
                </p>
              </div>
              <ChevronRight size={14} className={selectedUser?.userId === c.userId ? "text-white" : "text-slate-300"} />
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN VIEW */}
      <main className="flex-1 overflow-y-auto p-8 relative">
        {detailLoading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center z-50">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        )}

        {!selectedUser ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-300">
            <UserCircle size={80} strokeWidth={1} />
            <p className="text-lg font-medium mt-4">Select a customer profile</p>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-6 pb-12">
            
            {/* HEADER CARD */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-wrap justify-between items-center gap-6">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-100">
                  <UserCircle size={44} />
                </div>
                <div>
                  <h1 className="text-3xl font-black tracking-tight">{selectedUser.name}</h1>
                  <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                    <Mail size={14} /> {selectedUser.email}
                  </p>
                </div>
              </div>
              <div className="bg-indigo-50 px-8 py-5 rounded-[2rem] border border-indigo-100 text-right">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Lifetime Value</p>
                <p className="text-4xl font-black text-indigo-700">₹{derivedStats.total.toLocaleString()}</p>
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard 
                icon={<ShoppingBag className="text-blue-600" />} 
                label="Total Orders" 
                value={derivedStats.count} 
                color="bg-blue-50"
              />
              <StatCard 
                icon={<IndianRupee className="text-emerald-600" />} 
                label="Average Order Value" 
                value={`₹${derivedStats.avg.toFixed(0)}`} 
                color="bg-emerald-50"
              />
            </div>

            {/* PURCHASE INSIGHTS */}
            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                  <BarChart3 size={20} />
                </div>
                <h2 className="text-xl font-bold">Purchase Insights</h2>
              </div>

              {groupedProducts.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium text-sm">No items found in order history</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {groupedProducts.map((p, i) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50 p-5 rounded-3xl hover:bg-white hover:shadow-md hover:border-indigo-100 border border-transparent transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-600 border border-slate-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-sm">
                          {p.quantityBought}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 leading-tight">{p.productName}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">Total Units Bought</p>
                        </div>
                      </div>
                      <p className="text-lg font-black text-indigo-600">₹{p.revenue.toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* HISTORY TABLE */}
            <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-lg">Order History</h3>
                <span className="text-[10px] font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-500 uppercase tracking-tighter">
                  {selectedUser.orderHistory?.length || 0} Total Records
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 text-[11px] uppercase tracking-widest text-slate-400 font-black">
                    <tr>
                      <th className="px-8 py-5">Order ID</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {selectedUser.orderHistory?.map((o) => (
                      <tr key={o.orderId} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="px-8 py-6">
                          <span className="font-bold text-slate-700 group-hover:text-indigo-600">#ORD-{o.orderId}</span>
                        </td>
                        <td className="px-8 py-6">
                          <StatusBadge status={o.status} />
                        </td>
                        <td className="px-8 py-6 text-right font-black text-slate-900">
                          ₹{Number(o.totalAmount).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* CREATE USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-indigo-600 p-8 text-white flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-black tracking-tight">Create Customer</h3>
                <p className="text-indigo-100 text-xs mt-1">Add a new profile to the directory</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateUser} className="p-8 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Full Name</label>
                <div className="relative">
                  <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required 
                    placeholder="Enter name" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Company</label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required 
                      placeholder="Name" 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.companyName}
                      onChange={e => setFormData({...formData, companyName: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      required 
                      placeholder="Number" 
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={formData.phoneNumber}
                      onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required 
                    type="email" 
                    placeholder="example@mail.com" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-1 pb-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-2 tracking-widest">Access Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    required 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </div>

              <button 
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                Create Profile
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center gap-6">
      <div className={`p-5 ${color} rounded-[1.5rem]`}>{icon}</div>
      <div>
        <p className="text-3xl font-black text-slate-800">{value}</p>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}