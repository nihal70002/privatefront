import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom"; // Add this
import {
  Plus, X, Trash2, ChevronDown, ChevronUp,
  Upload, Loader2, Edit3, Search, Filter, Package,
  AlertTriangle // Add this
} from "lucide-react";

/* ================= CONSTANTS ================= */
/* ================= CONSTANTS ================= */
const DEFAULT_VARIANT = {
  size: "M",
  price: 100,
  stock: 0,
  productCode: ""
};

const EMPTY_FORM = {
  name: "",
  categoryId: "",
  brandId: "",
  description: "",
  imageUrl: "",
  variants: [{ ...DEFAULT_VARIANT }]
};


export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [selectedCatFilter, setSelectedCatFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  
  const [expandedRow, setExpandedRow] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [p, c, b] = await Promise.all([
        api.get("/admin/products"),
        api.get("/categories/admin"),
        api.get("/brands")
      ]);
      setProducts(p.data || []);
      setCategories(c.data || []);
      setBrands(b.data || []);
    } catch (err) {
      console.error("Failed to fetch data", err);
    }
  };

  /* ================= HANDLERS ================= */

  const handleToggleActive = async (productId) => {
    setTogglingId(productId);
    try {
      // Endpoint matched to your Swagger UI: PUT /api/admin/products/{productId}/toggle
      await api.put(`/admin/products/${productId}/toggle`);
      setProducts(prev => prev.map(p => 
        p.productId === productId ? { ...p, isActive: !p.isActive } : p
      ));
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

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
    if (!newCategory.trim()) return alert("Name required");
    try {
      await api.post("/categories", { name: newCategory.trim() });
      setNewCategory(""); setShowCatModal(false); loadData();
    } catch { alert("Failed to add category"); }
  };

  const openEditModal = (product) => {
    setEditingId(product.productId);
    setForm({
  name: product.name,
  categoryId: product.categoryId.toString(),
  brandId: product.brandId?.toString() || "",
  description: product.description || "",
  imageUrl: product.imageUrl || "",
  variants: product.variants.map(v => ({ ...v }))
});

    setShowModal(true);
  };

const saveProduct = async () => {
  // 🔴 BASIC PRODUCT VALIDATION
  if (!form.name || !form.categoryId || !form.brandId) {
    alert("Product name, category and brand are required");
    return;
  }

  if (!form.variants || form.variants.length === 0) {
    alert("At least one variant is required");
    return;
  }

  // 🔴 VARIANT VALIDATION (ON SAVE ONLY)
  const sizes = new Set();
  const skus = new Set();

  for (const v of form.variants) {
    const size = v.size?.trim();
    const sku = v.productCode?.trim();

    if (!size) {
      alert("Variant size cannot be empty");
      return;
    }

    if (!sku) {
      alert("SKU / Product Code is required for each variant");
      return;
    }

    const sizeKey = size.toLowerCase();
    const skuKey = sku.toLowerCase();

    if (sizes.has(sizeKey)) {
      alert(`Duplicate size not allowed: ${size}`);
      return;
    }

    if (skus.has(skuKey)) {
      alert(`Duplicate SKU not allowed: ${sku}`);
      return;
    }

    sizes.add(sizeKey);
    skus.add(skuKey);
  }

  // ✅ CLEAN & SAFE PAYLOAD
  const payload = {
    ...form,
    categoryId: Number(form.categoryId),
    brandId: Number(form.brandId),
    variants: form.variants.map(v => ({
      ...v,
      size: v.size.trim(),
      productCode: v.productCode.trim(),
      price: Number(v.price) || 0,
      stock: Number(v.stock) || 0
    }))
  };

  try {
    if (editingId) {
      // 1️⃣ UPDATE PRODUCT BASIC INFO
      await api.put(`/admin/products/${editingId}`, payload);

      // 2️⃣ UPDATE / ADD VARIANTS
      for (const v of payload.variants) {
        if (v.variantId) {
          // UPDATE EXISTING VARIANT
          await api.put(`/admin/products/variant/${v.variantId}`, v);
        } else {
          // ➕ ADD NEW VARIANT (XL, XS, Baby-2, etc.)
          await api.post(`/admin/products/${editingId}/variant`, v);
        }
      }
    } else {
      // CREATE PRODUCT + VARIANTS
      await api.post("/admin/products", payload);
    }

    closeModal();
    loadData();
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data ||
      "Error saving product";
    alert(msg);
  }
};



 const deleteProduct = async () => {
  if (!deleteTarget) return;

  try {
    await api.delete(`/admin/products/${deleteTarget.productId}`);
    setDeleteTarget(null);
    loadData();
  } catch (err) {
    alert("Failed to delete product permanently");
  }
};



  const closeModal = () => {
    setShowModal(false); setEditingId(null); setForm(EMPTY_FORM);
  };

 const filteredProducts = products.filter(p => {
  const term = searchTerm.toLowerCase();

  const matchesStatus =
    filter === "ALL"
      ? true
      : filter === "ACTIVE"
      ? p.isActive
      : !p.isActive;

  const matchesCategory =
    selectedCatFilter === "ALL"
      ? true
      : p.categoryId.toString() === selectedCatFilter;

  const matchesName =
    p.name?.toLowerCase().includes(term);

  const matchesProductCode =
    p.productCode?.toLowerCase().includes(term);

  const matchesVariantSku =
    p.variants?.some(v =>
      v.productCode?.toLowerCase().includes(term)
    );

  const matchesSearch =
    !term ||
    matchesName ||
    matchesProductCode ||
    matchesVariantSku;

  return matchesStatus && matchesCategory && matchesSearch;
});


  return (
   <div className="h-full overflow-y-auto bg-[#F8FAFC] px-6 py-6 text-[13px] leading-tight">
  <div className="max-w-[1700px] mx-auto space-y-3">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl text-blue-600">
              <Package size={28} />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Inventory Cloud</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowCatModal(true)} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm">
              + CATEGORY
            </button>
            <button onClick={() => setShowBrandModal(true)} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition shadow-sm">
              + BRAND
            </button>
            {/* LOW STOCK ALERT BUTTON */}


<button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[11px] font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
  + ADD PRODUCT
</button>
          </div>
        </div>

        {/* SEARCH & FILTERS - Matching Screenshot Style */}
        <div className="backdrop-blur-md bg-white/80 p-3 rounded-2xl shadow-sm border border-white/50 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-2 bg-slate-100 p-1 rounded-xl">
            {["ALL", "ACTIVE", "INACTIVE"].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-5 py-1.5 rounded-lg text-xs font-black tracking-widest transition-all ${filter === f ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}>
                {f}
              </button>
              
            ))}
          </div>
          

          <div className="flex items-center gap-3">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <select value={selectedCatFilter} onChange={(e) => setSelectedCatFilter(e.target.value)} className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-600 outline-none shadow-sm cursor-pointer appearance-none min-w-[150px]">
                <option value="ALL">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input placeholder="Search products..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64 pl-10 pr-4 py-2 bg-white border border-slate-200 text-xs text-slate-700 rounded-xl outline-none shadow-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
            </div>
          </div>
        </div>

        {/* PRODUCT TABLE */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-black text-slate-400 uppercase tracking-widest">
                <th className="px-6 py-3">Product Details</th>
                <th className="px-6 py-3 text-center">Visibility</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map(p => (
                <React.Fragment key={p.productId}>
                  <tr className="group hover:bg-slate-50/80 transition-all">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <img src={p.imageUrl || "https://via.placeholder.com/150"} className="w-10 h-10 rounded-l object-cover bg-slate-100 border border-slate-100 shadow-sm" />
                          <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${p.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-xs leading-tight group-hover:text-blue-600 transition-colors">{p.name}</p>
                          <p className="text-xs font-bold text-blue-500 uppercase tracking-tighter mt-1">{p.categoryName || 'General'}</p>
                          <p className="text-[10px] font-bold text-slate-400 tracking-widest mt-0.5">
    {p.productCode}
  </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex justify-center items-center gap-4">
                        <span className={`text-[11px] font-black uppercase tracking-tighter w-12 text-right ${p.isActive ? "text-emerald-500" : "text-slate-300"}`}>
                          {p.isActive ? "Active" : "Hidden"}
                        </span>
                        {/* THE TOGGLE BUTTON */}
                        <button 
                          disabled={togglingId === p.productId}
                          onClick={() => handleToggleActive(p.productId)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 focus:outline-none ${p.isActive ? 'bg-emerald-500 shadow-lg shadow-emerald-100' : 'bg-slate-200'}`}
                        >
                          <span className="sr-only">Toggle Active</span>
                          {togglingId === p.productId ? (
                            <Loader2 size={12} className="animate-spin mx-auto text-white" />
                          ) : (
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-all duration-300 shadow-sm ${p.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEditModal(p)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit3 size={16} /></button>
                        <button onClick={() => setDeleteTarget(p)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                        <button onClick={() => setExpandedRow(expandedRow === p.productId ? null : p.productId)} className={`p-2.5 rounded-xl transition-all ${expandedRow === p.productId ? "bg-slate-100 text-slate-900" : "text-slate-300"}`}>
                          {expandedRow === p.productId ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRow === p.productId && (
                    <tr className="bg-slate-50/50">
                      <td colSpan={3} className="px-12 py-6 border-l-4 border-blue-500">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {p.variants?.map((v, i) => (
                            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
                              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">
  Size {v.size}
</p>

<p className="text-[10px] font-bold text-slate-500 tracking-widest">
  SKU: {v.productCode}
</p>

                              <p className="text-blue-600 font-black text-xs mb-2">₹{v.price}</p>
                              <div className="flex items-center gap-2">
                            
                                
                              </div>
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
          {filteredProducts.length === 0 && (
            <div className="py-20 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-slate-300" size={30} />
              </div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">No matching inventory</p>
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 mb-2">Delete Product?</h3>
            <p className="text-xs text-slate-500 mb-8">This will remove <span className="font-bold text-slate-800">{deleteTarget.name}</span> permanently. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={deleteProduct} className="flex-1 bg-rose-500 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-rose-600 transition shadow-lg shadow-rose-100">Delete Product</button>
              <button onClick={() => setDeleteTarget(null)} className="flex-1 bg-slate-100 text-slate-500 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* BRAND & CATEGORY MODALS */}
      {(showCatModal || showBrandModal) && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{showCatModal ? "Add Category" : "Add Brand"}</h3>
              <button onClick={() => {setShowCatModal(false); setShowBrandModal(false);}} className="p-2 hover:bg-slate-50 rounded-full transition"><X size={20}/></button>
            </div>
            <input
              type="text"
              placeholder={showCatModal ? "Category Name" : "Brand Name"}
              value={showCatModal ? newCategory : newBrand}
              onChange={(e) => showCatModal ? setNewCategory(e.target.value) : setNewBrand(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl p-4 mb-6 focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-xs"
            />
            <button
              onClick={showCatModal ? addCategory : async () => {
                if (!newBrand.trim()) return alert("Brand name required");
                try {
                  await api.post("/brands", { brandName: newBrand.trim() });
                  setNewBrand(""); setShowBrandModal(false); loadData();
                } catch { alert("Failed to add brand"); }
              }}
              className="w-full bg-slate-900 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition shadow-xl"
            >
              Add Item
            </button>
          </div>
        </div>
      )}

      {/* ADD/EDIT PRODUCT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[110] p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200">

           <div className="p-5 border-b flex justify-between items-center bg-white sticky top-0 z-10">

              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tighter">
                  {editingId ? "Update Product" : "Initialize Stock"}
                </h2>
                <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">Global Inventory Control</p>
              </div>
              <button onClick={closeModal} className="p-3 hover:bg-slate-50 rounded-full transition-all border border-slate-100"><X /></button>
            </div>

            <div className="p-5 overflow-y-auto space-y-5">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-full md:w-1/3">
                  <div className="aspect-square border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden bg-slate-50 hover:border-blue-400 transition-all cursor-pointer group">
                    {imageUploading && <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>}
                    {form.imageUrl ? (
                      <img src={form.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    ) : (
                      <div className="text-center p-4">
                        <Upload className="mx-auto text-slate-300 mb-3" size={32} />
                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Upload Image</span>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                  </div>
                </div>

                <div className="w-full md:w-2/3 space-y-4">
                  <div>
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Product Name</label>
                    <input className="w-full bg-slate-50 border-none p-3 rounded-xl focus:bg-white focus:ring-2 ring-blue-500/10 outline-none transition-all font-bold" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Category</label>
                      <select className="w-full bg-slate-50 border-none p-3 rounded-xl focus:bg-white outline-none font-bold appearance-none cursor-pointer" value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                        <option value="">Select</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Brand Identity</label>
                      <select className="w-full bg-slate-50 border-none p-3 rounded-xl focus:bg-white outline-none font-bold appearance-none cursor-pointer" value={form.brandId} onChange={e => setForm({ ...form, brandId: e.target.value })}>
                        <option value="">Select</option>
                        {brands.map(b => <option key={b.brandId} value={b.brandId}>{b.brandName}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5 block">Nomenclature/Description</label>
                <textarea rows="3" className="w-full bg-slate-50 border-none p-4 rounded-2xl focus:bg-white outline-none transition-all font-medium text-base" placeholder="Summarize product attributes..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
     


              <div className="space-y-4">
  <div className="flex justify-between items-center">
    <h4 className="text-[13px] font-black text-slate-900 uppercase tracking-[0.2em]">
      SKU Configurations
    </h4>

    <button
      type="button"
      onClick={() =>
        setForm({
          ...form,
          variants: [...form.variants, { ...DEFAULT_VARIANT }]
        })
      }
      className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black hover:bg-blue-600 hover:text-white transition-all"
    >
      + CONFIG
    </button>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
    {form.variants.map((v, i) => (
      <div
        key={i}
        className="flex gap-2 items-center bg-slate-50/50 p-3 rounded-2xl border border-slate-100"
      >
        {/* SIZE */}
        {/* SIZE (CUSTOM + UNIQUE) */}
<input
  type="text"
  placeholder="Size (eg: M, 2-3Y, Baby-2)"
  className="bg-white border-none rounded-lg text-xs font-bold p-1.5 w-32"
  value={v.size}
  onChange={e => {
    const value = e.target.value;

   <input
  type="text"
  placeholder="Size (eg: M, XS, 2-3Y, Baby-2)"
  className="bg-white border-none rounded-lg text-xs font-bold p-1.5 w-32"
  value={v.size}
  onChange={e => {
    const vs = [...form.variants];
    vs[i].size = e.target.value;   // ✅ JUST UPDATE VALUE
    setForm({ ...form, variants: vs });
  }}
/>


    const vs = [...form.variants];
    vs[i].size = value;
    setForm({ ...form, variants: vs });
  }}
/>

       
        {/* PRODUCT CODE (SKU) */}
        <input
          type="text"
          placeholder="SKU / Product Code"
          className="bg-white border-none rounded-lg text-xs font-bold p-1.5 w-40"
          value={v.productCode}
          onChange={e => {
            const vs = [...form.variants];
            vs[i].productCode = e.target.value;
            setForm({ ...form, variants: vs });
          }}
        />

        {/* PRICE */}
        <input
  type="number"
  placeholder="Price"
  className="bg-white border-none rounded-lg text-xs font-bold p-1.5 w-24"
  value={v.price === 0 ? "" : v.price}
  onChange={e => {
    const vs = [...form.variants];
    vs[i].price = e.target.value === "" ? "" : Number(e.target.value);
    setForm({ ...form, variants: vs });
  }}
/>


        {/* REMOVE VARIANT */}
        <button
          type="button"
          onClick={() =>
            setForm({
              ...form,
              variants: form.variants.filter((_, idx) => idx !== i)
            })
          }
          className="p-1.5 text-rose-400 hover:bg-rose-50 rounded-lg"
        >
          <Trash2 size={14} />
        </button>
      </div>
    ))}
  </div>
</div>
</div>


            <div className="p-8 border-t bg-slate-50 flex gap-4">
              <button onClick={saveProduct} className="flex-1 bg-slate-900 text-white py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition shadow-xl shadow-slate-200">
                {editingId ? "Save Changes" : "Create Product"}
              </button>
              <button onClick={closeModal} className="px-6 border-2 border-slate-200 py-3 rounded-[1.5rem] font-black text-xs text-slate-400 uppercase tracking-widest hover:bg-white transition">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}