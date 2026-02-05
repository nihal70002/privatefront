import toast from "react-hot-toast";

export default function TestToast() {
  return (
    <div style={{ padding: 40 }}>
      <button
        onClick={() => toast.success("🔥 Toast clicked & working")}
        style={{
          padding: 12,
          background: "green",
          color: "white",
          borderRadius: 6,
        }}
      >
        Click me
      </button>
    </div>
  );
}
