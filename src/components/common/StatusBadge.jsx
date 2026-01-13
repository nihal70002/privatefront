// ✅ MUST BE DEFAULT EXPORT
export default function StatusBadge({ status }) {
  if (!status) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
        Unknown
      </span>
    );
  }

  const normalized = status.toString().toLowerCase();

  const styles = {
    pending: "bg-amber-100 text-amber-700",
    confirmed: "bg-indigo-100 text-indigo-700",
    dispatched: "bg-blue-100 text-blue-700",
    delivered: "bg-emerald-100 text-emerald-700",
    completed: "bg-emerald-100 text-emerald-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold ${
        styles[normalized] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}
