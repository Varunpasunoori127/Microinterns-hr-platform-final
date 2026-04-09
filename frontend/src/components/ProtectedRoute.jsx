import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  console.log("ProtectedRoute → token:", token);
  console.log("ProtectedRoute → role:", role);

  // not logged in
  if (!token) return <Navigate to="/login" replace />;

  // only HR allowed
  if (role !== "HR") return <Navigate to="/" replace />;

  return children;
}