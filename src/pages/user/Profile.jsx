import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { User, Package, MapPin, Lock, Mail, Building2, Phone, ChevronRight, Calendar, CreditCard } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ================= LOAD DATA =================
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.get("/users/me");
      setProfile(res.data);
    } catch (err) {
      console.error("Profile load failed", err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data);
    } catch (err) {
      console.error("Orders load failed", err);
    }
  };

  // ================= SAVE PROFILE =================
  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/users/me", {
        name: profile.name,
        phoneNumber: profile.phoneNumber
      });
      alert("Profile updated successfully");
    } catch {
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Account Settings</h1>
          <p className="text-slate-600">Manage your profile and view your orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ================= SIDEBAR ================= */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-3">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="font-semibold text-lg">{profile.name}</h3>
                <p className="text-blue-100 text-sm mt-1">{profile.email}</p>
              </div>
              
              <div className="p-2">
                <SidebarItem
                  icon={<User className="w-5 h-5" />}
                  label="Profile"
                  active={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                />
                <SidebarItem
                  icon={<Package className="w-5 h-5" />}
                  label="My Orders"
                  active={activeTab === "orders"}
                  onClick={() => {
                    setActiveTab("orders");
                    loadOrders();
                  }}
                />
                <SidebarItem
                  icon={<MapPin className="w-5 h-5" />}
                  label="Addresses"
                  onClick={() => navigate("/profile/addresses")}
                />
                <SidebarItem
                  icon={<Lock className="w-5 h-5" />}
                  label="Change Password"
                  onClick={() => navigate("/profile/change-password")}
                />
              </div>
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          <div className="lg:col-span-3">
            {/* ================= PROFILE ================= */}
            {activeTab === "profile" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900">Personal Information</h2>
                  <p className="text-slate-600 mt-1">Update your account details</p>
                </div>

                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      icon={<User className="w-5 h-5" />}
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                    />
                    <Input
                      label="Phone Number"
                      icon={<Phone className="w-5 h-5" />}
                      value={profile.phoneNumber}
                      onChange={(e) =>
                        setProfile({ ...profile, phoneNumber: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Email Address"
                      icon={<Mail className="w-5 h-5" />}
                      value={profile.email}
                      disabled
                    />
                    <Input
                      label="Company Name"
                      icon={<Building2 className="w-5 h-5" />}
                      value={profile.companyName}
                      disabled
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <p className="text-sm text-amber-800">
                      To change your email or company name, please contact the administrator for assistance.
                    </p>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                    >
                      {saving ? (
                        <span className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= MY ORDERS ================= */}
            {activeTab === "orders" && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
                <div className="p-6 border-b border-slate-200">
                  <h2 className="text-2xl font-bold text-slate-900">Order History</h2>
                  <p className="text-slate-600 mt-1">Track and manage your orders</p>
                </div>

                <div className="p-6">
                  {orders.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-10 h-10 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No orders yet</h3>
                      <p className="text-slate-600">When you place orders, they will appear here.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div
                          key={order.orderId}
                          onClick={() => navigate(`/orders/${order.orderId}`)}
                          className="group border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-gradient-to-br from-white to-slate-50"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-slate-900">
                                    Order #{order.orderId}
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm text-slate-600 mt-1">
                                    <Calendar className="w-4 h-4" />
                                    {new Date(order.orderDate).toLocaleDateString('en-US', { 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <CreditCard className="w-4 h-4 text-slate-500" />
                                  <span className="font-semibold text-slate-900">
                                    ₹{order.totalAmount.toLocaleString()}
                                  </span>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  order.status === 'Delivered' 
                                    ? 'bg-green-100 text-green-700' 
                                    : order.status === 'Processing'
                                    ? 'bg-blue-100 text-blue-700'
                                    : order.status === 'Shipped'
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'bg-amber-100 text-amber-700'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>

                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */
function SidebarItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        active
          ? "bg-blue-50 text-blue-700 font-semibold"
          : "text-slate-700 hover:bg-slate-50"
      }`}
    >
      {icon}
      <span className="text-sm">{label}</span>
      {!active && <ChevronRight className="w-4 h-4 ml-auto text-slate-400" />}
    </button>
  );
}

function Input({ label, icon, value, onChange, disabled }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </div>
        <input
          type="text"
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          className={`w-full pl-11 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            disabled
              ? "bg-slate-50 text-slate-500 cursor-not-allowed border-slate-200"
              : "bg-white text-slate-900 border-slate-300 hover:border-slate-400"
          }`}
        />
      </div>
    </div>
  );
}