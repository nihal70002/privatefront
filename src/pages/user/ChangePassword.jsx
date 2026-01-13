import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Package, MapPin, Lock, ChevronRight, KeyRound, Shield, Eye, EyeOff } from "lucide-react";
import { changePassword } from "../../api/users.api";

export default function ChangePassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword !== form.confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });

      alert("Password changed successfully");

      setForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (err) {
      console.error("Password change failed", err);
      alert(
        err.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
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
            <ProfileSidebar navigate={navigate} activeTab="password" />
          </div>

          {/* ================= CONTENT ================= */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
              {/* Header */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Change Password</h2>
                </div>
                <p className="text-slate-600 ml-13">Update your password to keep your account secure</p>
              </div>

              {/* Form */}
              <div className="p-6">
                <div className="max-w-xl">
                  {/* Security Tips */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <KeyRound className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-1">Password Requirements</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                          <li>• Minimum 6 characters long</li>
                          <li>• Use a mix of letters, numbers, and symbols</li>
                          <li>• Avoid using common words or personal information</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <PasswordInput
                      label="Current Password"
                      value={form.currentPassword}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          currentPassword: e.target.value
                        })
                      }
                      showPassword={showPasswords.current}
                      onToggleShow={() =>
                        setShowPasswords({
                          ...showPasswords,
                          current: !showPasswords.current
                        })
                      }
                      required
                    />

                    <PasswordInput
                      label="New Password"
                      value={form.newPassword}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          newPassword: e.target.value
                        })
                      }
                      showPassword={showPasswords.new}
                      onToggleShow={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new
                        })
                      }
                      required
                      minLength={6}
                    />

                    <PasswordInput
                      label="Confirm New Password"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          confirmPassword: e.target.value
                        })
                      }
                      showPassword={showPasswords.confirm}
                      onToggleShow={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm
                        })
                      }
                      required
                      minLength={6}
                      error={
                        form.confirmPassword &&
                        form.newPassword !== form.confirmPassword
                          ? "Passwords do not match"
                          : ""
                      }
                    />

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
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

function PasswordInput({ label, value, onChange, showPassword, onToggleShow, required, minLength, error }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Lock className="w-5 h-5" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
          className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
            error
              ? "border-red-300 focus:ring-red-500"
              : "border-slate-300 hover:border-slate-400"
          }`}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {showPassword ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}