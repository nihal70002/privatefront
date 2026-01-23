import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import api from "../../api/axios";

export default function Login() {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await api.post("/auth/login", {
      loginId: loginId.trim(),
      password: password.trim(),
    });

    console.log("LOGIN RESPONSE:", res.data);

    const { token, role, id } = res.data;

    // ✅ FORCE localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userId", id);

    if (role === "Admin") {
      navigate("/admin", { replace: true });
    } else if (role === "SalesExecutive") {
      navigate("/sales-executive", { replace: true });
    } else if (role === "Customer") {
  navigate("/products");
}


  } catch (err) {
    setError(err.response?.data?.message || "Invalid credentials");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">

      {/* ================= LEFT : LOGIN ================= */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-8 md:px-16 lg:px-20 bg-white shadow-xl z-10">
        <div className="max-w-md w-full mx-auto">

        

          {/* Title */}
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">
              Welcome back
            </h1>
            <p className="text-slate-500 text-lg">
              Please enter your details to access the portal.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Login ID */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email or Phone
              </label>
              <input
                type="text"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                placeholder="admin@company.com"
                className="w-full h-14 px-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-black/5 focus:border-black outline-none"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-14 px-4 pr-12 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-black/5 focus:border-black outline-none"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-black"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>

              <button type="button" className="font-bold text-black">
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-black text-white rounded-2xl font-bold hover:bg-slate-800 transition disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="mt-10 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <span className="font-bold text-black cursor-pointer">
              Request access
            </span>
          </p>
        </div>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="hidden lg:flex w-[55%] bg-white items-center justify-center">
        <img
          src="/logo/logo.png"
          alt="Company logo"
          className="max-w-[70%] max-h-[70%] object-contain"
        />
      </div>
    </div>
  );
}
