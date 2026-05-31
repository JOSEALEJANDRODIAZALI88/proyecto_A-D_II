import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, allowedRole }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("rol");

  const normalizeRole = (value) => {
    const text = String(value || "").toLowerCase();

    if (text === "admin" || text === "administrador") {
      return "admin";
    }

    if (text === "usuario" || text === "cliente" || text === "user") {
      return "usuario";
    }

    return "";
  };

  const currentRole = normalizeRole(role);
  const requiredRole = normalizeRole(allowedRole);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && currentRole !== requiredRole) {
    if (currentRole === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (currentRole === "usuario") {
      return <Navigate to="/home" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}