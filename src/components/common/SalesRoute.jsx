import { Navigate } from "react-router-dom";

export default function SalesRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "SalesExecutive") {
    return <Navigate to="/login" replace />;
  }

  return children;
}
