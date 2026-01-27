import { useState } from "react";
import api from "../../api/axios";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); 
  const [message, setMessage] = useState("");

  const submit = async () => {
  if (!email) {
    setStatus("error");
    setMessage("Please enter your email address.");
    return;
  }

  // 🔹 SHOW IMMEDIATE FEEDBACK
  setStatus("loading");
  setMessage("Sending password reset link…");

  try {
    await api.post("/auth/forgot-password", {
  email: email.trim().toLowerCase()
});


    setStatus("success");
    setMessage(
      "If an account with this email exists, a password reset link has been sent."
    );
  } catch (err) {
    setStatus("error");
    setMessage(
      "We couldn’t send the reset link right now. Please try again later."
    );
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4F7F9] p-4">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 w-full max-w-md transition-all">
        
        {/* ICON & HEADER */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#009688]/10 rounded-2xl flex items-center justify-center mb-4 text-[#009688]">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-black text-[#2A334E] tracking-tight text-center">Forgot Password?</h2>
          <p className="text-sm text-gray-500 font-medium text-center mt-2 px-4">
            No worries! Enter your email and we'll send you instructions to reset your password.
          </p>
        </div>

        {/* INPUT FIELD */}
        <div className="space-y-4">
          <div className="relative">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-1 block">
              Registered Email
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl text-sm outline-none transition-all ${
                status === "error" 
                  ? "border-red-200 focus:ring-4 focus:ring-red-500/10" 
                  : "border-gray-100 focus:ring-4 focus:ring-[#009688]/10 focus:border-[#009688]"
              }`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "success"}
            />
          </div>

          {/* STATUS MESSAGES */}
          {message && (
            <div className={`flex items-start gap-3 p-4 rounded-2xl text-xs font-bold animate-in fade-in slide-in-from-top-2 ${
              status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"
            }`}>
              {status === "success" ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertCircle size={18} className="shrink-0" />}
              <span>{message}</span>
            </div>
          )}

          {/* SUBMIT BUTTON */}
          {status !== "success" ? (
            <button
              onClick={submit}
              disabled={status === "loading"}
              className="w-full bg-[#009688] text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-[#009688]/20 hover:bg-[#00796B] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          ) : (
            <Link 
              to="/login"
              className="w-full bg-gray-900 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest text-center block hover:bg-black transition-all"
            >
              Return to Login
            </Link>
          )}

          {/* FOOTER ACTION */}
          <div className="pt-4 text-center">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#009688] transition-colors"
            >
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* SUCCESS HINT */}
        {status === "success" && (
          <p className="text-[10px] text-gray-400 text-center mt-6 font-medium leading-relaxed">
            Didn’t receive the email? Please check your <span className="font-bold">spam folder</span> or wait a few minutes before trying again.
          </p>
        )}
      </div>
    </div>
  );
}