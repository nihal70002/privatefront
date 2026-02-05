import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AdminWarehouseUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  // =============================
  // LOAD USERS
  // =============================
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/warehouse-users");
      setUsers(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load warehouse users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // =============================
  // OPEN CREATE
  // =============================
  const openCreate = () => {
    setEditingUser(null);
    setForm({
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
    });
    setShowForm(true);
  };

  // =============================
  // OPEN EDIT
  // =============================
  const openEdit = (user) => {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      password: "",
    });
    setShowForm(true);
  };

  // =============================
  // SUBMIT (CREATE / EDIT)
  // =============================
  const submit = async () => {
    try {
      if (editingUser) {
        await api.put(`/admin/warehouse-users/${editingUser.id}`, {
          name: form.name,
          phoneNumber: form.phoneNumber,
        });
      } else {
        await api.post("/admin/warehouse-users", form);
      }

      setShowForm(false);
      loadUsers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data || "Something went wrong");
    }
  };

  // =============================
  // TOGGLE ACTIVE STATUS
  // =============================
  const toggleStatus = async (user) => {
    try {
      await api.patch(`/admin/warehouse-users/${user.id}/status`, {
        isActive: !user.isActive,
      });
      loadUsers();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Warehouse Users</h1>
        <button
          onClick={openCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
        >
          + Create Warehouse User
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.phoneNumber}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        u.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="p-3 space-x-3">
                    <button
                      onClick={() => openEdit(u)}
                      className="text-blue-600 text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(u)}
                      className="text-red-600 text-xs font-semibold"
                    >
                      {u.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-[400px] p-6 rounded shadow">
            <h2 className="font-bold mb-4">
              {editingUser ? "Edit Warehouse User" : "Create Warehouse User"}
            </h2>

            <input
              className="border p-2 w-full mb-3 text-sm"
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              className="border p-2 w-full mb-3 text-sm"
              placeholder="Email"
              disabled={!!editingUser}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              className="border p-2 w-full mb-3 text-sm"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
            />

            {!editingUser && (
              <input
                className="border p-2 w-full mb-3 text-sm"
                placeholder="Password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowForm(false)}
                className="text-sm"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="bg-blue-600 text-white px-4 py-1 rounded text-sm"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
