import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";
import EmployeeTablePage from "../pages/admin/jabatan";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Home Page */}
      <Route path="/" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/user"} /> : <Home />} />

      {/* Login Page */}
      <Route path="/login" element={user ? <Navigate to={user.role === "admin" ? "/admin" : "/user"} /> : <Login />} />

      {/* User Dashboard */}
      <Route
        path="/user"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/jabatan"
        element={
          <ProtectedRoute role="admin">
            <EmployeeTablePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
