import { useEffect, useState } from "react";
import api from "../../api/axios";

// Using simple SVG strings so you don't need to install extra icon libraries
const IconIn = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
);
const IconOut = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

export default function StockMovements() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/warehouse/inventory/stock-movements")
      .then(res => setMovements(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={styles.loader}>Scanning history...</div>;

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div>
          <h2 style={styles.title}>Stock Activity</h2>
          <p style={styles.subtitle}>Real-time movement tracking</p>
        </div>
        <div style={styles.badge}>{movements.length} Events</div>
      </header>

      <div style={styles.timeline}>
        {movements.length === 0 ? (
          <div style={styles.emptyState}>No movements recorded yet.</div>
        ) : (
          movements.map((m, index) => {
            const isIn = (m.movementType || "").toLowerCase() === "in";
            return (
              <div key={index} style={styles.card}>
                {/* Movement Indicator */}
                <div style={{...styles.statusIcon, backgroundColor: isIn ? "#ecfdf5" : "#fff1f2", color: isIn ? "#059669" : "#e11d48"}}>
                  {isIn ? <IconIn /> : <IconOut />}
                </div>

                {/* Main Content */}
                <div style={styles.cardBody}>
                  <div style={styles.row}>
                    <h3 style={styles.productName}>
                      {m.productName} 
                      {m.size && <span style={styles.variantTag}>{m.size}</span>}
                    </h3>
                    <span style={{...styles.qty, color: isIn ? "#059669" : "#e11d48"}}>
                      {isIn ? "+" : "-"}{m.quantityChanged}
                    </span>
                  </div>
                  
                  <div style={styles.row}>
                    <span style={styles.reason}>{m.reason || "No reason provided"}</span>
                    <span style={styles.date}>
                      {new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { 
    padding: "20px", 
    maxWidth: "800px", 
    margin: "0 auto",
    fontFamily: "Inter, system-ui, sans-serif"
  },
  header: { 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: "24px" 
  },
  title: { margin: 0, fontSize: "24px", fontWeight: "800", color: "#111827" },
  subtitle: { margin: 0, fontSize: "14px", color: "#6b7280" },
  badge: { backgroundColor: "#f3f4f6", padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "600" },
  
  timeline: { display: "flex", flexDirection: "column", gap: "12px" },
  
  card: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #f3f4f6",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    transition: "transform 0.1s ease",
  },
  statusIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0
  },
  cardBody: { flex: 1 },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  productName: { fontSize: "16px", fontWeight: "600", color: "#1f2937", margin: 0 },
  variantTag: { marginLeft: "8px", fontSize: "11px", backgroundColor: "#f3f4f6", padding: "2px 6px", borderRadius: "4px", color: "#6b7280", textTransform: "uppercase" },
  qty: { fontSize: "18px", fontWeight: "700" },
  reason: { fontSize: "13px", color: "#6b7280", marginTop: "4px" },
  date: { fontSize: "12px", color: "#9ca3af" },
  
  loader: { padding: "100px", textAlign: "center", color: "#6b7280", fontWeight: "500" },
  emptyState: { padding: "40px", textAlign: "center", color: "#9ca3af", border: "2px dashed #f3f4f6", borderRadius: "12px" }
};