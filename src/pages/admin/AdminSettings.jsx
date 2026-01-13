import { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get("/admin/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = async (productId) => {
    await api.put(`/admin/products/${productId}/toggle`);
    loadProducts();
  };

  const updateVariant = async (variantId, price, stock) => {
    await api.put(`/admin/products/variants/${variantId}`, {
      price,
      stock
    });
    loadProducts();
  };

  if (loading) return <div className="p-6">Loading products...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Product
        </Link>
      </div>

      {products.map(product => (
        <div key={product.productId} className="border rounded mb-4">
          {/* PRODUCT HEADER */}
          <div className="flex justify-between items-center p-4 bg-gray-50">
            <div>
              <h2 className="font-semibold">{product.name}</h2>
              <p className="text-sm text-gray-500">{product.category}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  setExpanded(
                    expanded === product.productId
                      ? null
                      : product.productId
                  )
                }
                className="px-3 py-1 border rounded"
              >
                Variants
              </button>

              <button
                onClick={() => toggleProduct(product.productId)}
                className="px-3 py-1 border rounded"
              >
                Enable / Disable
              </button>
            </div>
          </div>

          {/* VARIANTS */}
          {expanded === product.productId && (
            <Variants productId={product.productId} onSave={updateVariant} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ================= VARIANTS ================= */

function Variants({ productId, onSave }) {
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    api.get(`/products/${productId}`).then(res => {
      setVariants(res.data.sizes);
    });
  }, [productId]);

  return (
    <div className="p-4 bg-white">
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Size</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {variants.map(v => (
            <VariantRow key={v.variantId} variant={v} onSave={onSave} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function VariantRow({ variant, onSave }) {
  const [price, setPrice] = useState(variant.price);
  const [stock, setStock] = useState(variant.availableStock);

  return (
    <tr>
      <td className="border p-2 text-center">{variant.size}</td>

      <td className="border p-2">
        <input
          type="number"
          value={price}
          onChange={e => setPrice(+e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </td>

      <td className="border p-2">
        <input
          type="number"
          value={stock}
          onChange={e => setStock(+e.target.value)}
          className="border px-2 py-1 w-full"
        />
      </td>

      <td className="border p-2 text-center">
        <button
          onClick={() => onSave(variant.variantId, price, stock)}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Save
        </button>
      </td>
    </tr>
  );
}
