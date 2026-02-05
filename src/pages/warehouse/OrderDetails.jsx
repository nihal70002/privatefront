import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/warehouse/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to load order:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div style={styles.centered}>Loading order details...</div>;
  if (!order) return <div style={styles.centered}>Order not found</div>;

  // Helper to color-code status
  const getStatusStyle = (status) => {
    const s = status?.toLowerCase();
    if (s === 'delivered' || s === 'completed') return styles.statusGreen;
    if (s === 'pending' || s === 'processing') return styles.statusYellow;
    return styles.statusGray;
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>← Back</button>
        <div style={styles.headerTitle}>
          <h2 style={{ margin: 0 }}>Order #{order.orderId}</h2>
          <span style={{ ...styles.badge, ...getStatusStyle(order.status) }}>
            {order.status}
          </span>
        </div>
      </div>

      <div style={styles.contentGrid}>
        {/* Customer Info Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Customer Information</h3>
          <div style={styles.infoRow}>
            <span style={styles.label}>Name:</span>
            <span>{order.customerName}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Company:</span>
            <span>{order.companyName}</span>
          </div>
        </div>

        {/* Order Summary Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Order Summary</h3>
          <div style={styles.infoRow}>
            <span style={styles.label}>Total Amount:</span>
            <span style={styles.totalText}>₹{order.totalAmount.toLocaleString()}</span>
          </div>
          <div style={styles.infoRow}>
            <span style={styles.label}>Items Count:</span>
            <span>{order.items?.length || 0} Products</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Line Items</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th style={styles.th}>Product</th>
              <th style={styles.th}>Size</th>
              <th style={styles.th}>Qty</th>
              <th style={styles.th}>Unit Price</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((i, idx) => (
              <tr key={idx} style={styles.tr}>
                <td style={styles.td}><strong>{i.productName}</strong></td>
                <td style={styles.td}>{i.size}</td>
                <td style={styles.td}>{i.quantity}</td>
                <td style={styles.td}>₹{i.unitPrice}</td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                   ₹{(i.quantity * i.unitPrice).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    padding: "40px", 
    backgroundColor: "#f8f9fa", 
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Roboto, sans-serif"
  },
  centered: { display: 'flex', justifyContent: 'center', padding: '50px', fontSize: '1.2rem' },
  header: { marginBottom: '24px' },
  headerTitle: { display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' },
  backBtn: { 
    background: 'none', border: 'none', color: '#6c757d', cursor: 'pointer', padding: 0, fontSize: '1rem' 
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '20px'
  },
  card: {
    backgroundColor: '#fff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid #edf2f7'
  },
  cardTitle: { marginTop: 0, marginBottom: '16px', fontSize: '1.1rem', color: '#4a5568' },
  infoRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '10px' },
  label: { color: '#718096', fontWeight: 500 },
  totalText: { fontSize: '1.2rem', fontWeight: 'bold', color: '#2d3748' },
  badge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: 600,
    textTransform: 'uppercase'
  },
  statusGreen: { backgroundColor: '#def7ec', color: '#03543f' },
  statusYellow: { backgroundColor: '#fef3c7', color: '#92400e' },
  statusGray: { backgroundColor: '#f3f4f6', color: '#374151' },
  table: { width: "100%", borderCollapse: "collapse", marginTop: '10px' },
  tableHeaderRow: { borderBottom: '2px solid #edf2f7' },
  th: { textAlign: 'left', padding: '12px', color: '#718096', fontSize: '0.9rem' },
  td: { padding: '16px 12px', borderBottom: '1px solid #f7fafc' },
  tr: { transition: 'background 0.2s', '&:hover': { background: '#f7fafc' } }
};