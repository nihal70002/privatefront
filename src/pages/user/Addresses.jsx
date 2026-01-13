import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Package, MapPin, Lock, ChevronRight, Plus, X, Home, CheckCircle2, Trash2, Star } from "lucide-react";
import {
  getAddresses,
  addAddress,
  deleteAddress,
  setDefaultAddress
} from "../../api/address.api";

export default function Addresses() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false
  });

  // ✅ MUST BE ABOVE useEffect
  const loadAddresses = async () => {
    try {
      const res = await getAddresses();
      setAddresses(res.data || []);
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  // ✅ SAFE TO USE NOW
  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addAddress(form);

    setForm({
      fullName: "",
      phone: "",
      addressLine: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false
    });

    setShowForm(false);
    loadAddresses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    await deleteAddress(id);
    loadAddresses();
  };

  const handleSetDefault = async (id) => {
    await setDefaultAddress(id);
    loadAddresses();
  };

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
            <ProfileSidebar navigate={navigate} activeTab="addresses" />
          </div>

          {/* ================= CONTENT ================= */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              {/* Header */}
              <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">My Addresses</h2>
                  <p className="text-slate-600 mt-1">Manage your delivery addresses</p>
                </div>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className={`px-4 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    showForm
                      ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
                  }`}
                >
                  {showForm ? (
                    <>
                      <X className="w-4 h-4" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Add Address
                    </>
                  )}
                </button>
              </div>

              <div className="p-6">
                {/* Add Address Form */}
                {showForm && (
                  <form
                    onSubmit={handleSubmit}
                    className="bg-gradient-to-br from-blue-50 to-slate-50 p-6 rounded-xl border border-blue-200 mb-6"
                  >
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Home className="w-5 h-5 text-blue-600" />
                      New Address
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormInput
                        placeholder="Full Name"
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                        required
                      />

                      <FormInput
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={(e) =>
                          setForm({ ...form, phone: e.target.value })
                        }
                        required
                      />

                      <FormInput
                        placeholder="Address Line (House No, Street, Area)"
                        value={form.addressLine}
                        onChange={(e) =>
                          setForm({ ...form, addressLine: e.target.value })
                        }
                        required
                        className="md:col-span-2"
                      />

                      <FormInput
                        placeholder="City"
                        value={form.city}
                        onChange={(e) =>
                          setForm({ ...form, city: e.target.value })
                        }
                        required
                      />

                      <FormInput
                        placeholder="State"
                        value={form.state}
                        onChange={(e) =>
                          setForm({ ...form, state: e.target.value })
                        }
                        required
                      />

                      <FormInput
                        placeholder="Pincode"
                        value={form.pincode}
                        onChange={(e) =>
                          setForm({ ...form, pincode: e.target.value })
                        }
                        required
                      />

                      <label className="flex items-center gap-3 md:col-span-2 bg-white px-4 py-3 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-all">
                        <input
                          type="checkbox"
                          checked={form.isDefault}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              isDefault: e.target.checked
                            })
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-slate-700">
                          Set as default delivery address
                        </span>
                      </label>

                      <button
                        type="submit"
                        className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all md:col-span-2 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                {/* Address Cards */}
                {addresses.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No addresses yet</h3>
                    <p className="text-slate-600 mb-6">Add your first delivery address to get started</p>
                    <button
                      onClick={() => setShowForm(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-500/30"
                    >
                      <Plus className="w-5 h-5" />
                      Add Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <AddressCard
                        key={addr.id}
                        address={addr}
                        onDelete={handleDelete}
                        onSetDefault={handleSetDefault}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function ProfileSidebar({ navigate, activeTab }) {
  // Mock profile data - replace with actual data if needed
  const profile = {
    name: "User",
    email: "user@example.com"
  };

  return (
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
          onClick={() => navigate("/profile")}
        />
        <SidebarItem
          icon={<Package className="w-5 h-5" />}
          label="My Orders"
          active={activeTab === "orders"}
          onClick={() => navigate("/profile")}
        />
        <SidebarItem
          icon={<MapPin className="w-5 h-5" />}
          label="Addresses"
          active={activeTab === "addresses"}
          onClick={() => navigate("/profile/addresses")}
        />
        <SidebarItem
          icon={<Lock className="w-5 h-5" />}
          label="Change Password"
          active={activeTab === "password"}
          onClick={() => navigate("/profile/change-password")}
        />
      </div>
    </div>
  );
}

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

function FormInput({ placeholder, value, onChange, required, className = "" }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-slate-400 ${className}`}
    />
  );
}

function AddressCard({ address, onDelete, onSetDefault }) {
  return (
    <div className={`relative border rounded-xl p-5 transition-all ${
      address.isDefault
        ? "border-blue-300 bg-gradient-to-br from-blue-50 to-white shadow-md"
        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
    }`}>
      {/* Default Badge */}
      {address.isDefault && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
            <Star className="w-3 h-3 fill-current" />
            Default
          </span>
        </div>
      )}

      {/* Address Icon */}
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
        <Home className="w-5 h-5 text-blue-600" />
      </div>

      {/* Address Details */}
      <div className="mb-4">
        <h3 className="font-bold text-slate-900 text-lg mb-1">
          {address.fullName}
        </h3>
        <p className="text-sm text-slate-600 mb-1">{address.phone}</p>
        <p className="text-sm text-slate-700 leading-relaxed">
          {address.addressLine}, {address.city}, {address.state} - {address.pincode}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-4 border-t border-slate-200">
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-semibold rounded-lg hover:bg-blue-100 transition-all"
          >
            Set as Default
          </button>
        )}
        <button
          onClick={() => onDelete(address.id)}
          className="px-4 py-2 bg-red-50 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-100 transition-all flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}