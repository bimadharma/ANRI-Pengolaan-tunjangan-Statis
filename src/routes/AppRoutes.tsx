import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route
        path="/user"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
