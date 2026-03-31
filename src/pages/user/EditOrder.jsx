import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrderDetails, editOrder } from "../../api/orders.api";
import { Trash2, ArrowLeft, ShoppingBag, AlertCircle, CheckCircle2 } from "lucide-react";

export default function EditOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', message }

  useEffect(() => {
    getOrderDetails(id)
      .then(res => {
        console.log(res.data);
        setOrder(res.data);
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const changeQuantity = (index, value) => {
    const updated = [...order.items];
    updated[index].quantity = Math.max(1, Number(value));
    setOrder({ ...order, items: updated });
  };

  const removeItem = (index) => {
    const updated = [...order.items];
    updated.splice(index, 1);
    setOrder({ ...order, items: updated });
  };

  const totalAmount = order?.items?.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity, 0
  ) ?? 0;

  const handleSave = async () => {
    if (order.items.length === 0) {
      showToast("error", "Order must contain at least one product.");
      return;
    }
    setSaving(true);
    try {
      await editOrder(id, {
        items: order.items.map(item => ({
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        })),
      });
      showToast("success", "Order updated successfully!");
      setTimeout(() => navigate(`/orders/${id}`), 1200);
    } catch {
      showToast("error", "Failed to update order. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* ── Loading ── */
  if (loading) return (
    <div style={styles.page}>
      <div style={styles.skeleton}>
        {[1,2,3].map(i => (
          <div key={i} style={styles.skeletonRow}>
            <div style={{...styles.skeletonBox, width: 72, height: 72, borderRadius: 12}} />
            <div style={{flex: 1, display:'flex', flexDirection:'column', gap: 8}}>
              <div style={{...styles.skeletonBox, height: 16, width: '55%'}} />
              <div style={{...styles.skeletonBox, height: 13, width: '30%'}} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  /* ── Not Found ── */
  if (!order) return (
    <div style={styles.page}>
      <div style={styles.notFound}>
        <AlertCircle size={40} color="#ef4444" />
        <p style={{color:'#ef4444', fontWeight:600, fontSize:16, marginTop:12}}>Order not found</p>
        <button style={styles.backBtnSmall} onClick={() => navigate('/orders')}>
          ← Back to orders
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Toast */}
      {toast && (
        <div style={{...styles.toast, ...(toast.type === 'success' ? styles.toastSuccess : styles.toastError)}}>
          {toast.type === 'success'
            ? <CheckCircle2 size={17} />
            : <AlertCircle size={17} />}
          <span>{toast.message}</span>
        </div>
      )}

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div>
            <div style={styles.orderLabel}>
              <ShoppingBag size={14} style={{marginRight: 6}} />
              Edit Order
            </div>
            <h1 style={styles.title}>Order #{order.orderId}</h1>
          </div>
        </div>

        {/* Items Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.cardTitle}>Items</span>
            <span style={styles.itemCount}>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
          </div>

          {order.items.length === 0 ? (
            <div style={styles.emptyState}>
              <ShoppingBag size={36} color="#d1d5db" />
              <p style={{color:'#9ca3af', marginTop:10, fontSize:14}}>No items in this order</p>
            </div>
          ) : (
            <div style={styles.itemList}>
              {order.items.map((item, index) => (
                <div key={item.productId ?? index} style={styles.itemRow}>
                  {/* Image */}
                  <img
                    src={item.productImage || "/placeholder.png"}
                    alt={item.productName}
                    style={styles.itemImage}
                    onError={e => { e.target.src = "/placeholder.png"; }}
                  />

                  {/* Info */}
                  <div style={styles.itemInfo}>
                    <p style={styles.itemName}>{item.productName}</p>
                    <p style={styles.itemPrice}>SAR{item.unitPrice?.toLocaleString('en-IN')}</p>
                  </div>

                  {/* Subtotal */}
                  <div style={styles.itemSubtotal}>
                    SAR{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                  </div>

                  {/* Quantity */}
                  <div style={styles.qtyWrapper}>
                    <button
                      style={styles.qtyBtn}
                      onClick={() => changeQuantity(index, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >−</button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={e => changeQuantity(index, e.target.value)}
                      style={styles.qtyInput}
                      aria-label="Quantity"
                    />
                    <button
                      style={styles.qtyBtn}
                      onClick={() => changeQuantity(index, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >+</button>
                  </div>

                  {/* Remove */}
                  <button
                    style={styles.removeBtn}
                    onClick={() => removeItem(index)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Order Total */}
          {order.items.length > 0 && (
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Order Total</span>
              <span style={styles.totalValue}>SAR{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={() => navigate(-1)}>
            Cancel
          </button>
          <button
            style={{...styles.saveBtn, ...(saving ? styles.saveBtnDisabled : {})}}
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <span style={styles.spinner} />
            ) : (
              <CheckCircle2 size={16} />
            )}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Styles ── */
const styles = {
  page: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    padding: '24px 16px 48px',
    position: 'relative',
  },
  container: {
    maxWidth: 720,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    background: 'none',
    border: 'none',
    color: '#6b7280',
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    padding: '4px 0',
    width: 'fit-content',
  },
  backBtnSmall: {
    marginTop: 16,
    background: 'none',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 13,
    color: '#374151',
    cursor: 'pointer',
  },
  orderLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: 12,
    fontWeight: 600,
    color: '#3b82f6',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#111827',
    margin: 0,
    lineHeight: 1.2,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #f3f4f6',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 600,
    color: '#374151',
    letterSpacing: '0.01em',
  },
  itemCount: {
    fontSize: 12,
    color: '#9ca3af',
    background: '#f3f4f6',
    borderRadius: 20,
    padding: '3px 10px',
    fontWeight: 500,
  },
  itemList: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 20px',
    borderBottom: '1px solid #f9fafb',
    flexWrap: 'wrap',
    transition: 'background 0.15s',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    objectFit: 'cover',
    border: '1px solid #e5e7eb',
    flexShrink: 0,
    background: '#f9fafb',
  },
  itemInfo: {
    flex: 1,
    minWidth: 120,
  },
  itemName: {
    fontWeight: 600,
    fontSize: 14,
    color: '#111827',
    margin: 0,
    lineHeight: 1.4,
  },
  itemPrice: {
    fontSize: 13,
    color: '#6b7280',
    margin: '3px 0 0',
  },
  itemSubtotal: {
    fontSize: 14,
    fontWeight: 600,
    color: '#111827',
    minWidth: 80,
    textAlign: 'right',
  },
  qtyWrapper: {
    display: 'flex',
    alignItems: 'center',
    border: '1px solid #e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    background: '#fff',
    flexShrink: 0,
  },
  qtyBtn: {
    width: 30,
    height: 32,
    background: '#f9fafb',
    border: 'none',
    fontSize: 16,
    color: '#374151',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: 1,
    userSelect: 'none',
  },
  qtyInput: {
    width: 40,
    height: 32,
    textAlign: 'center',
    border: 'none',
    borderLeft: '1px solid #e5e7eb',
    borderRight: '1px solid #e5e7eb',
    fontSize: 14,
    fontWeight: 600,
    color: '#111827',
    background: '#fff',
    outline: 'none',
    padding: 0,
    MozAppearance: 'textfield',
  },
  removeBtn: {
    background: 'none',
    border: '1px solid #fee2e2',
    borderRadius: 8,
    padding: '6px 8px',
    color: '#ef4444',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.15s',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 20px',
    borderTop: '1px solid #f3f4f6',
    background: '#fafafa',
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: 600,
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 700,
    color: '#111827',
  },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 12,
    flexWrap: 'wrap',
  },
  cancelBtn: {
    padding: '10px 22px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    color: '#374151',
    cursor: 'pointer',
  },
  saveBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 7,
    padding: '10px 24px',
    background: '#111827',
    border: 'none',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },
  saveBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  spinner: {
    display: 'inline-block',
    width: 14,
    height: 14,
    border: '2px solid rgba(255,255,255,0.3)',
    borderTopColor: '#fff',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  },
  toast: {
    position: 'fixed',
    top: 20,
    right: 20,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 18px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 500,
    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
    animation: 'fadeIn 0.25s ease',
    maxWidth: 320,
  },
  toastSuccess: {
    background: '#ecfdf5',
    border: '1px solid #6ee7b7',
    color: '#065f46',
  },
  toastError: {
    background: '#fef2f2',
    border: '1px solid #fca5a5',
    color: '#991b1b',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '40px 20px',
  },
  notFound: {
    maxWidth: 320,
    margin: '80px auto',
    textAlign: 'center',
    padding: 24,
  },
  skeleton: {
    maxWidth: 720,
    margin: '0 auto',
    background: '#fff',
    borderRadius: 16,
    border: '1px solid #e5e7eb',
    overflow: 'hidden',
    padding: '8px 0',
  },
  skeletonRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 20px',
    borderBottom: '1px solid #f9fafb',
  },
  skeletonBox: {
    background: 'linear-gradient(90deg, #f3f4f6 25%, #e9eaec 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
    borderRadius: 6,
  },
};