import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  Plus, X, Trash2, ChevronDown, ChevronUp,
  Upload, Loader2, Edit3
} from "lucide-react";

/* ================= CONSTANTS ================= */
const DEFAULT_VARIANT = { size: "M", price: 100, stock: 0 };
const EMPTY_FORM = {
  name: "",
  categoryId: "",
  description: "",
  imageUrl: "",
  variants: [{ ...DEFAULT_VARIANT }]
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [newCategory, setNewCategory] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [p, c] = await Promise.all([
        api.get("/admin/products"),
        api.get("/categories/admin")
      ]);
      setProducts(p.data || []);
      setCategories(c.data || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  /* ================= HANDLERS ================= */

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/upload/image", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setForm(prev => ({ ...prev, imageUrl: res.data.imageUrl }));
    } catch {
      alert("Image upload failed");
    } finally {
      setImageUploading(false);
    }
  };

  const addCategory = async () => {
  if (!newCategory.trim()) {
    alert("Category name required");
    return;
  }

  try {
    await api.post("/categories", {
      name: newCategory.trim()
    });

    setNewCategory("");
    setShowCatModal(false);
    loadData(); // reload categories
  } catch (err) {
    alert("Failed to add category");
  }
};



  

  // --- NEW: EDIT MODE TRIGGER ---
  const openEditModal = (product) => {
    setEditingId(product.productId);
    setForm({
      name: product.name,
      categoryId: product.categoryId.toString(), // Select expects string
      description: product.description || "",
      imageUrl: product.imageUrl || "",
      variants: product.variants.map(v => ({ ...v }))
    });
    setShowModal(true);
  };


  const confirmDeleteProduct = (product) => {
  setDeleteTarget(product);
};

const deleteProduct = async () => {
  if (!deleteTarget) return;

  try {
    await api.delete(`/admin/products/${deleteTarget.productId}`);
    setDeleteTarget(null);
    loadData();
  } catch {
    alert("Failed to delete product");
  }
};



  const saveProduct = async () => {
    if (!form.name || !form.categoryId) return alert("Name & Category required");
    if (!form.variants.length) return alert("At least one variant required");

    const payload = {
      ...form,
      categoryId: Number(form.categoryId)
    };

    try {
      if (editingId) {
  // 1️⃣ update product basic info
  await api.put(`/admin/products/${editingId}`, {
    name: form.name,
    categoryId: Number(form.categoryId),
    description: form.description,
    imageUrl: form.imageUrl
  });

  // 2️⃣ update variants separately
  for (const v of form.variants) {
    await api.put(`/admin/products/variant/${v.variantId}`, {
      size: v.size,
      price: v.price,
      stock: v.stock
    });
  }

} else {
  // CREATE product (this API already accepts variants)
  await api.post("/admin/products", payload);
}

      closeModal();
      loadData();
    } catch (err) {
      alert("Error saving product. Check if product name is unique or API is reachable.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const filteredProducts = products.filter(p => {
    if (filter === "ACTIVE") return p.isActive;
    if (filter === "INACTIVE") return !p.isActive;
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-slate-800">Admin Inventory</h1>
          <div className="flex gap-3">
            <button onClick={() => setShowCatModal(true)} className="bg-white border-2 border-slate-200 px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-50 transition">
              <Plus size={18} /> Category
            </button>
            <button onClick={() => setShowModal(true)} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition flex items-center gap-2">
              <Plus size={18} /> Add Product
            </button>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex gap-2 mb-6">
          {["ALL", "ACTIVE", "INACTIVE"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all
                ${filter === f ? "bg-indigo-600 text-white shadow-md" : "bg-white border text-slate-600"}`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* PRODUCT TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase">Product Details</th>
                <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="p-4 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => (
                <React.Fragment key={p.productId}>
                  <tr className="border-b last:border-0 hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={p.imageUrl || "https://via.placeholder.com/80?text=No+Image"} 
                          className="w-12 h-12 rounded-lg object-cover bg-slate-100" 
                        />
                        <div>
                          <p className="font-bold text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.categoryName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black ${p.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {p.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(p)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                          <Edit3 size={18} />
                        </button>


                        
                        <button
  onClick={() => confirmDeleteProduct(p)}

  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
  title="Delete product"
>
  <Trash2 size={18} />
</button>
{deleteTarget && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
      <h3 className="text-lg font-bold text-slate-800 mb-2">
        Delete Product
      </h3>
      <p className="text-sm text-slate-600 mb-6">
        Are you sure you want to delete
        <span className="font-bold"> {deleteTarget.name}</span>?
        <br />This action cannot be undone.
      </p>

      <div className="flex gap-3">
        <button
          onClick={deleteProduct}
          className="flex-1 bg-red-600 text-white py-2 rounded-xl font-bold hover:bg-red-700 transition"
        >
          Yes, Delete
        </button>
        <button
          onClick={() => setDeleteTarget(null)}
          className="flex-1 border border-slate-200 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

                        <button 
                          onClick={() => setExpandedRow(expandedRow === p.productId ? null : p.productId)}
                          className={`p-2 rounded-lg transition ${expandedRow === p.productId ? "bg-slate-100 text-slate-800" : "text-slate-400"}`}
                        >
                          {expandedRow === p.productId ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* VARIANT DETAILS (Left Quantity & Sizes) */}
                  {expandedRow === p.productId && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={3} className="p-4 border-b">
                        <div className="flex flex-wrap gap-3">
                          {p.variants.map((v, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-xl p-3 min-w-[120px] shadow-sm">
                              <div className="flex justify-between items-start mb-1">
                                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">Size {v.size}</span>
                                <span className="text-indigo-600 font-bold text-sm">₹{v.price}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-2">
                                Stock Left: <span className={`font-bold ${v.stock < 5 ? 'text-red-500' : 'text-slate-800'}`}>{v.stock}</span>
                              </p>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODALS (Category and Product as defined in your prompt) */}
      {/* ... Add Category Modal Code from original snippet ... */}
      
      {/* PRODUCT MODAL (Handles both Add & Edit) */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0">
              <h2 className="text-xl font-black text-slate-800">
                {editingId ? "Edit Product Details" : "Create New Product"}
              </h2>
              <button onClick={closeModal} className="p-2 hover:bg-slate-100 rounded-full transition"><X /></button>
            </div>

            <div className="p-6 overflow-y-auto">
              {/* Image Upload UI - Keep as per your current working version */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 mb-6 text-center hover:border-indigo-400 transition cursor-pointer relative">
                 {imageUploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>}
                 {form.imageUrl ? (
                   <img src={form.imageUrl} className="h-40 mx-auto rounded-lg mb-2 object-contain" />
                 ) : <Upload className="mx-auto text-slate-300 mb-2" size={32} />}
                 <label className="cursor-pointer block">
                    <span className="text-sm font-bold text-indigo-600">Click to upload product image</span>
                    <input type="file" className="hidden" onChange={handleImageUpload} />
                 </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="mb-4">
  <label className="text-xs font-bold text-slate-500 ml-1">
    PRODUCT DESCRIPTION
  </label>
  <textarea
    rows="3"
    className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition resize-none"
    placeholder="Enter product description"
    value={form.description}
    onChange={(e) =>
      setForm({ ...form, description: e.target.value })
    }
  />
</div>

                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1">PRODUCT NAME</label>
                  <input className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 ml-1">CATEGORY</label>
                  <select className="w-full border-2 border-slate-100 p-3 rounded-xl focus:border-indigo-500 outline-none transition" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs font-bold text-slate-500 ml-1">VARIANTS & INVENTORY</label>
                  <button onClick={() => setForm({ ...form, variants: [...form.variants, { ...DEFAULT_VARIANT }] })} className="text-indigo-600 font-bold text-xs flex items-center gap-1 hover:underline">
                    <Plus size={14} /> Add Variant
                  </button>
                </div>

                <div className="space-y-3">
                  {form.variants.map((v, i) => (
                    <div key={i} className="flex gap-3 items-end bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400">SIZE</label>
                        <select className="w-full border-none bg-white p-2 rounded-lg text-sm" value={v.size} onChange={e => {
                          const vs = [...form.variants]; vs[i].size = e.target.value; setForm({ ...form, variants: vs });
                        }}>
                          <option>S</option><option>M</option><option>L</option><option>XL</option><option>XXL</option>
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400">PRICE (₹)</label>
                        <input
  type="number"
  className="w-full border-none bg-white p-2 rounded-lg text-sm"
  value={v.price}
  onChange={e => {
    const vs = [...form.variants];
    vs[i].price = e.target.value;
    setForm({ ...form, variants: vs });
  }}
  onBlur={e => {
    const vs = [...form.variants];
    vs[i].price = Number(e.target.value);
    setForm({ ...form, variants: vs });
  }}
/>

                      </div>
                      <div className="flex-1">
                        <label className="text-[10px] font-bold text-slate-400">STOCK QTY</label>
                       <input
  type="number"
  className="w-full border-none bg-white p-2 rounded-lg text-sm"
  value={v.stock}
  onChange={e => {
    const vs = [...form.variants];
    vs[i].stock = e.target.value;
    setForm({ ...form, variants: vs });
  }}
  onBlur={e => {
    const vs = [...form.variants];
    vs[i].stock = Number(e.target.value);
    setForm({ ...form, variants: vs });
  }}
/>

                      </div>
                      <button onClick={() => setForm({ ...form, variants: form.variants.filter((_, idx) => idx !== i) })} className="p-2 text-red-400 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
{showCatModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
      <h3 className="text-lg font-bold text-slate-800 mb-4">
        Add Category
      </h3>

      <input
        type="text"
        placeholder="Category name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="w-full border-2 border-slate-200 rounded-xl p-3 mb-4 focus:border-indigo-500 outline-none"
      />

      <div className="flex gap-3">
        <button
          onClick={addCategory}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700 transition"
        >
          Add
        </button>

        <button
          onClick={() => setShowCatModal(false)}
          className="flex-1 border border-slate-200 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

            <div className="p-6 border-t bg-slate-50 flex gap-3">
              <button onClick={saveProduct} className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition">
                {editingId ? "Update Product" : "Save Product"}
              </button>
              <button onClick={closeModal} className="px-6 border-2 border-slate-200 py-3 rounded-2xl font-bold text-slate-500 hover:bg-white transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {showCatModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">
          Add Category
        </h3>
        <button
          onClick={() => setShowCatModal(false)}
          className="p-2 hover:bg-slate-100 rounded-full"
        >
          <X size={18} />
        </button>
      </div>

      <input
        type="text"
        placeholder="Category name"
        value={newCategory}
        onChange={(e) => setNewCategory(e.target.value)}
        className="w-full border-2 border-slate-200 rounded-xl p-3 mb-4 focus:border-indigo-500 outline-none"
      />

      <div className="flex gap-3">
        <button
          onClick={addCategory}
          className="flex-1 bg-indigo-600 text-white py-2 rounded-xl font-bold hover:bg-indigo-700 transition"
        >
          Add
        </button>

        <button
          onClick={() => setShowCatModal(false)}
          className="flex-1 border border-slate-200 py-2 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}