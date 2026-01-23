import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function SalesCustomers() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await api.get("/sales/customers");
        setCustomers(res.data);
      } catch (err) {
        console.error("Failed to fetch customers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((c) =>
    `${c.companyName} ${c.name} ${c.email} ${c.phoneNumber}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen bg-[#F4F7F9]">
        <div className="text-[#718096] text-lg">Loading customers...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#F4F7F9] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#2A334E]">Assigned Customers</h1>
            <p className="text-[#718096] mt-1">Manage your customer relationships</p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#718096] w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by company, name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 pr-4 py-3 w-80 border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#4A86F7]/30 focus:border-[#4A86F7] transition-all shadow-sm"
              />
            </div>

            <button
              onClick={() => navigate("/sales/customers/create")}
              className="flex items-center gap-2 bg-[#2A334E] hover:bg-[#1F2937] text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Customer</span>
            </button>
          </div>
        </div>

        {/* STATS BAR */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#4A86F7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[#718096] text-sm font-medium">Total Customers</p>
                <p className="text-2xl font-bold text-[#2A334E]">{customers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#48BB78]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[#718096] text-sm font-medium">Active Customers</p>
                <p className="text-2xl font-bold text-[#2A334E]">{customers.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div>
                <p className="text-[#718096] text-sm font-medium">Search Results</p>
                <p className="text-2xl font-bold text-[#2A334E]">{filteredCustomers.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CUSTOMERS TABLE */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#F4F7F9]">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096]">
                    Company
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096]">
                    Contact Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096]">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096]">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-[#718096] text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#4A86F7]/10 flex items-center justify-center">
                            <span className="text-[#4A86F7] font-bold text-sm">
                              {c.companyName?.charAt(0)?.toUpperCase() || "C"}
                            </span>
                          </div>
                          <span className="font-semibold text-[#2A334E]">{c.companyName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#2A334E]">{c.name}</td>
                      <td className="px-6 py-4 text-[#718096]">{c.email}</td>
                      <td className="px-6 py-4 text-[#718096]">{c.phoneNumber}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => navigate(`/sales/customers/${c.id}`)}
                          className="inline-flex items-center gap-2 text-[#4A86F7] hover:text-[#3A76E7] font-semibold text-sm transition-colors"
                        >
                          <span>View Details</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="w-8 h-8 text-[#718096]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-[#2A334E] font-semibold">No matching customers found</p>
                          <p className="text-[#718096] text-sm mt-1">Try adjusting your search criteria</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PAGINATION (if needed) */}
        {filteredCustomers.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-[#718096] font-medium">
              Showing {filteredCustomers.length} of {customers.length} customers
            </p>
            <div className="flex gap-2">
              <button className="px-5 py-2.5 text-sm font-semibold text-[#718096] bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 shadow-sm">
                Previous
              </button>
              <button className="px-5 py-2.5 text-sm font-semibold text-white bg-[#4A86F7] rounded-xl shadow-sm hover:bg-[#3A76E7] transition-all">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}