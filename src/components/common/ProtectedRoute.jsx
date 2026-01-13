import { Navigate } from "react-router-dom";
import { getAuth } from "../../utils/auth";

export default function ProtectedRoute({ children }) {
  const auth = getAuth();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
