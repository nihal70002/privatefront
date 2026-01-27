import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (!password) {
      setStatus("error");
      setMessage("Please enter a new password");
      return;
    }
    if (password.length < 6) {
      setStatus("error");
      setMessage("Password must be at least 6 characters");
      return;
    }

    try {
      setStatus("loading");
      await api.post("/auth/reset-password", {
        token,
        newPassword: password,
      });

      setStatus("success");
      setMessage("Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setStatus("error");
      setMessage(err.response?.data?.message || "Invalid or expired reset link");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F9] p-4">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 w-full max-w-md transition-all">
        
        {/* ICON & HEADER */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#009688]/10 rounded-2xl flex items-center justify-center mb-4">
            <Lock className="text-[#009688]" size={32} />
          </div>
          <h2 className="text-2xl font-black text-[#2A334E] tracking-tight">Set New Password</h2>
          <p className="text-sm text-gray-500 font-medium text-center mt-1">
            Choose a secure password to protect your account.
          </p>
        </div>

        {/* INPUT FIELD */}
        <div className="space-y-4">
          <div className="relative">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
              New Password
            </label>
            <div className="relative group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`w-full pl-4 pr-12 py-3 bg-gray-50 border rounded-2xl text-sm outline-none transition-all ${
                  status === "error" ? "border-red-200 focus:ring-4 focus:ring-red-500/10" : "border-gray-100 focus:ring-4 focus:ring-[#009688]/10 focus:border-[#009688]"
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={status === "loading" || status === "success"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#009688] transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* STATUS MESSAGES */}
          {message && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-xs font-bold animate-in fade-in slide-in-from-top-2 ${
              status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
            }`}>
              {status === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              {message}
            </div>
          )}

          {/* SUBMIT BUTTON */}
          {status !== "success" && (
            <button
              onClick={submit}
              disabled={status === "loading"}
              className="w-full bg-[#009688] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#009688]/20 hover:bg-[#00796B] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Updating Password...
                </>
              ) : (
                "Reset Password"
              )}
            </button>
          )}

          {/* REDIRECT NOTICE */}
          {status === "success" && (
            <div className="text-center">
              <div className="inline-block h-1 w-full bg-gray-100 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-[#009688] animate-progress-bar"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}