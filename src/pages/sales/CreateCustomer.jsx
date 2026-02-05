import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { Eye, EyeOff } from "lucide-react";


export default function CreateCustomer() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const [form, setForm] = useState({
    name: "",
    companyName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/sales/customers", form);
      alert("Customer created successfully");
      navigate("/sales/customers");
    } catch (err) {
      console.error(err);
      alert("Failed to create customer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Create Customer</h1>
          <p className="text-sm text-gray-500 mt-1">
            Add a new customer under your account
          </p>
        </div>

        <button
          onClick={() => navigate("/sales/customers")}
          className="px-4 py-2 border rounded-lg text-sm font-semibold hover:bg-gray-100"
        >
          ← Back to Customers
        </button>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-xl shadow border border-gray-100">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* SECTION */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Customer Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Customer Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="w-full mt-1 p-3 border rounded-lg"
                  required
                />
              </div>

              <div className="md:col-span-2">
  <label className="text-sm font-medium text-gray-700">
    Temporary Password
  </label>

  <div className="relative mt-1">
    <input
      name="password"
      type={showPassword ? "text" : "password"}
      value={form.password}
      onChange={handleChange}
      className="w-full p-3 pr-10 border rounded-lg"
      required
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
    </button>
  </div>

  <p className="text-xs text-gray-500 mt-1">
    Customer can change this password after first login
  </p>
</div>

            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              type="button"
              onClick={() => navigate("/sales/customers")}
              className="px-6 py-2 border rounded-lg font-semibold hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
