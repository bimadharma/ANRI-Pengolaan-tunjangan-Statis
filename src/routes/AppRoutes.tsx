import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";

import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";

// Admin pages (semua ini sudah ada di import)
import DataPembayaran from "../pages/admin/DataPembayaran";
import DataTupas from "../pages/admin/DataTupas";
import Ketentuan from "../pages/admin/Ketentuan";
import LogPembayaran from "../pages/admin/LogPembayaran";
import PerhitunganTunjanganPAS from "../pages/admin/PerhitunganTunjanganPAS";
import RiwayatTupas from "../pages/admin/RiwayatTupas";

// Notifications
import NotificationsPage from "../pages/notifications";
import NotificationDetailPage from "../pages/notifications/Detail";

export default function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Home Page */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === "admin" ? "/admin" : "/user"} />
          ) : (
            <Home />
          )
        }
      />

      {/* Login Page */}
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={user.role === "admin" ? "/admin" : "/user"} />
          ) : (
            <Login />
          )
        }
      />

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

      {/* === ADMIN PAGES SESUAI IMPORT === */}
      <Route
        path="/admin/DataPembayaran"
        element={
          <ProtectedRoute role="admin">
            <DataPembayaran />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/DataTupas"
        element={
          <ProtectedRoute role="admin">
            <DataTupas />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/Ketentuan"
        element={
          <ProtectedRoute role="admin">
            <Ketentuan />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/LogPembayaran"
        element={
          <ProtectedRoute role="admin">
            <LogPembayaran />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/PerhitunganTunjanganPAS"
        element={
          <ProtectedRoute role="admin">
            <PerhitunganTunjanganPAS />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/RiwayatTupas"
        element={
          <ProtectedRoute role="admin">
            <RiwayatTupas />
          </ProtectedRoute>
        }
      />

      {/* Notifications */}
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/notifications/:id" element={<NotificationDetailPage />} />
    </Routes>
  );
}
