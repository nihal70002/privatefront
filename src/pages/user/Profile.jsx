import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { 
  User, Package, MapPin, Lock, Mail, Building2, 
  Phone, ShoppingBag, Settings, LogOut, ChevronRight, CheckCircle2, ShieldCheck
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile"); // profile, orders, password
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);

  // Form States
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await api.get("/users/me");
      setProfile(res.data);
    } catch (err) {
      console.error("Load failed", err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch (err) {
      console.error("Orders failed", err);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setBtnLoading(true);
    try {
      await api.put("/users/me", { name: profile.name, phoneNumber: profile.phoneNumber });
      alert("Profile updated!");
    } catch (err) {
      alert("Update failed");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) return alert("Passwords do not match");
    setBtnLoading(true);
    try {
      await api.put("/users/change-password", { 
        oldPassword: passwords.old, 
        newPassword: passwords.new 
      });
      alert("Password changed successfully!");
      setPasswords({ old: "", new: "", confirm: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Error changing password");
    } finally {
      setBtnLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8f9fa]">
        <div className="w-8 h-8 border-2 border-[#009688] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-[#282c3f]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        
        {/* TOP HEADER */}
        <div className="mb-8 pb-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-2l font-bold text-[#282c3f]">Account Settings</h1>
            <p className="text-sm text-gray-500">Manage your profile, orders and security</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[#009688] bg-[#e6f4f3] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tighter">
            <CheckCircle2 size={14} /> Verified Account
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          
          {/* ================= SIDEBAR ================= */}
          <div className="w-full md:w-64 shrink-0">
            <nav className="flex flex-col border-r border-gray-200 h-full">
              <div className="pb-4">
                <SidebarItem
                  icon={<User className="w-5 h-5" />}
                  label="Personal Info"
                  active={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                />
                <SidebarItem
                  icon={<ShoppingBag className="w-5 h-5" />}
                  label="My Orders"
                  active={activeTab === "orders"}
                  onClick={() => { setActiveTab("orders"); loadOrders(); }}
                />
                
                <SidebarItem
                  icon={<Lock className="w-5 h-5" />}
                  label="Password & Security"
                  active={activeTab === "password"}
                  onClick={() => setActiveTab("password")}
                />
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <button 
                  onClick={() => { localStorage.removeItem("token"); window.location.href = "/login"; }}
                  className="w-full flex items-center gap-3 px-4 py-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors uppercase tracking-widest"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </nav>
          </div>

          {/* ================= MAIN CONTENT AREA ================= */}
          <div className="flex-1 bg-white p-8 border border-gray-200 rounded-sm shadow-sm min-h-[500px]">
            
            {/* TAB 1: PROFILE INFO */}
            {activeTab === "profile" && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-8 border-b pb-2">Profile Details</h2>
                <form onSubmit={handleUpdateProfile} className="max-w-2xl space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormInput label="Full Name" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                    <FormInput label="Mobile Number" value={profile.phoneNumber} onChange={(e) => setProfile({...profile, phoneNumber: e.target.value})} />
                    <FormInput label="Email ID" value={profile.email} disabled />
                    <FormInput label="Company" value={profile.companyName} disabled />
                  </div>
                  <button type="submit" disabled={btnLoading} className="w-full md:w-64 py-4 bg-[#009688] text-white font-bold uppercase text-xs tracking-widest hover:bg-[#00796b] shadow-md transition-all">
                    {btnLoading ? "Updating..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: ORDER HISTORY */}
            {activeTab === "orders" && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-8 border-b pb-2">Order History</h2>
                {orders.length === 0 ? (
                  <div className="text-center py-20 border-2 border-dashed border-gray-100">
                    <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                    <p className="text-gray-500">No transactions found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <OrderRow key={order.orderId} order={order} navigate={navigate} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: CHANGE PASSWORD */}
            {activeTab === "password" && (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-lg font-bold uppercase tracking-wider text-gray-700 mb-8 border-b pb-2">Change Password</h2>
                <form onSubmit={handleChangePassword} className="max-w-md space-y-6">
                  <FormInput type="password" label="Current Password" value={passwords.old} onChange={(e) => setPasswords({...passwords, old: e.target.value})} required />
                  <FormInput type="password" label="New Password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} required />
                  <FormInput type="password" label="Confirm New Password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} required />
                  
                  <div className="bg-amber-50 p-4 border-l-4 border-amber-400 text-xs text-amber-800">
                    Strong passwords include a mix of letters, numbers, and symbols.
                  </div>

                  <button type="submit" disabled={btnLoading} className="w-full py-4 bg-[#009688] text-white font-bold uppercase text-xs tracking-widest hover:bg-[#00796b] shadow-md transition-all">
                    {btnLoading ? "Processing..." : "Update Security"}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SHARED INTERNAL COMPONENTS ================= */

function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-4 py-4 text-sm transition-all border-l-4 ${
        active
          ? "border-[#009688] bg-[#f5f5f6] text-[#009688] font-bold"
          : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function FormInput({ label, value, onChange, disabled, type = "text", required }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1 tracking-wider">{label}</label>
      <input
        type={type}
        value={value || ""}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-3 border text-sm outline-none transition-all ${
          disabled ? "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed" : "border-gray-300 focus:border-gray-900"
        }`}
      />
    </div>
  );
}

function OrderRow({ order, navigate }) {
  return (
    <div onClick={() => navigate(`/orders/${order.orderId}`)} className="flex items-center justify-between p-5 border border-gray-200 hover:border-[#009688] cursor-pointer transition-all group">
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#e6f4f3] group-hover:text-[#009688]">
          <Package size={18} />
        </div>
        <div>
          <p className="text-[11px] font-bold text-gray-800 uppercase">Order #{order.orderId}</p>
          <p className="text-[10px] text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</p>
          <p className="text-[10px] font-black uppercase text-[#009688]">{order.status}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#009688]" />
      </div>
    </div>
  );
}