import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Package, MapPin, Lock, ChevronRight, Plus, X, Home, CheckCircle2, Trash2, ShoppingBag, Settings } from "lucide-react";
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

  const loadAddresses = async () => {
    try {
      const res = await getAddresses();
      setAddresses(res.data || []);
    } catch (err) {
      console.error("Failed to load addresses", err);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAddress(form);
      setForm({ fullName: "", phone: "", addressLine: "", city: "", state: "", pincode: "", isDefault: false });
      setShowForm(false);
      loadAddresses();
    } catch (err) {
      alert("Error adding address");
    }
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
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-[#282c3f]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        
        {/* Header matching Profile page */}
        <div className="mb-8 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#282c3f]">Account Settings</h1>
          <p className="text-sm text-gray-500">Manage your saved addresses for faster checkout</p>
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* ================= SIDEBAR ================= */}
          <div className="w-full md:w-64 shrink-0">
            <ProfileSidebar navigate={navigate} activeTab="addresses" />
          </div>

          {/* ================= CONTENT ================= */}
          <div className="flex-1 bg-white p-8 border border-gray-200 rounded-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-bold uppercase tracking-wider text-gray-700">My Addresses</h2>
              {!showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-5 py-2 border-2 border-[#009688] text-[#009688] font-bold text-xs uppercase tracking-widest hover:bg-[#009688] hover:text-white transition-all"
                >
                  + Add New Address
                </button>
              )}
            </div>

            {/* Form Section */}
            {showForm && (
              <div className="mb-10 p-6 border border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-gray-700 uppercase text-sm tracking-wide">Add New Address</h3>
                  <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput
                      label="Full Name"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      required
                    />
                    <FormInput
                      label="Mobile Number"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                    <div className="md:col-span-2">
                      <FormInput
                        label="Address (House No, Building, Street, Area)"
                        value={form.addressLine}
                        onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
                        required
                      />
                    </div>
                    <FormInput
                      label="Pincode"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      required
                    />
                    <FormInput
                      label="City / District"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      required
                    />
                    <FormInput
                      label="State"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      required
                    />
                  </div>

                  <label className="flex items-center gap-3 py-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.isDefault}
                      onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                      className="w-4 h-4 accent-[#009688]"
                    />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                      Make this my default address
                    </span>
                  </label>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="submit"
                      className="flex-1 md:flex-none md:px-10 py-3 bg-[#009688] text-white font-bold uppercase text-xs tracking-widest shadow-md hover:bg-[#00796b]"
                    >
                      Save Address
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-10 py-3 border border-gray-300 text-gray-600 font-bold uppercase text-xs tracking-widest hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Address List */}
            {addresses.length === 0 && !showForm ? (
              <div className="text-center py-20 border-2 border-dashed border-gray-100">
                <MapPin className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No saved addresses found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
  );
}

/* ================= REFINED COMPONENTS ================= */

function ProfileSidebar({ navigate, activeTab }) {
  return (
    <nav className="flex flex-col border-r border-gray-200 h-full">
      <div className="pb-4">
        <SidebarItem
          icon={<User className="w-5 h-5" />}
          label="Overview"
          active={activeTab === "profile"}
          onClick={() => navigate("/profile")}
        />
        <SidebarItem
          icon={<ShoppingBag className="w-5 h-5" />}
          label="Orders"
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
          icon={<Settings className="w-5 h-5" />}
          label="Account Settings"
          onClick={() => navigate("/profile")}
        />
      </div>
      <div className="pt-4 border-t border-gray-100">
         <button 
          onClick={() => navigate("/profile/change-password")}
          className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 hover:text-[#009688] transition-colors"
         >
          <Lock className="w-4 h-4" /> Change Password
         </button>
      </div>
    </nav>
  );
}

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

function FormInput({ label, value, onChange, required }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1 ml-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-3 border border-gray-300 text-sm focus:border-gray-900 outline-none transition-all"
      />
    </div>
  );
}

function AddressCard({ address, onDelete, onSetDefault }) {
  return (
    <div className={`relative p-6 border transition-all ${
      address.isDefault ? "border-[#009688] shadow-sm" : "border-gray-200 hover:shadow-md"
    }`}>
      {address.isDefault && (
        <span className="absolute top-0 right-0 bg-[#009688] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-tighter">
          Default
        </span>
      )}
      
      <h3 className="font-bold text-gray-800 mb-2 uppercase text-xs tracking-wider">
        {address.fullName}
      </h3>
      
      <div className="text-sm text-gray-600 space-y-1 mb-6 min-h-[80px]">
        <p className="font-medium text-gray-800">{address.phone}</p>
        <p className="leading-relaxed">{address.addressLine}</p>
        <p>{address.city}, {address.state} - {address.pincode}</p>
      </div>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address.id)}
            className="text-[11px] font-bold text-[#009688] uppercase tracking-widest hover:underline"
          >
            Set Default
          </button>
        )}
        <button
          onClick={() => onDelete(address.id)}
          className="text-[11px] font-bold text-red-500 uppercase tracking-widest hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" /> Remove
        </button>
      </div>
    </div>
  );
}