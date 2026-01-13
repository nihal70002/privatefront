import { Navigate } from "react-router-dom";
import { getAuth } from "../../utils/auth";

export default function AdminRoute({ children }) {
  const auth = getAuth();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  if (auth.role !== "Admin") {
    return <Navigate to="/products" replace />;
  }

  return children;
}
