import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import UserDashboard from "../pages/UserDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import ProtectedRoute from "../components/ProtectedRoute";
import { useAuth } from "../hooks/useAuth";

import AdminLayout from "../components/layout/AdminLayout";

// Admin pages
import DataPembayaran from "../pages/admin/DataPembayaran";
import DataTupas from "../pages/admin/DataTupas";
import Ketentuan from "../pages/admin/Ketentuan";
import LogPembayaran from "../pages/admin/LogPembayaran";
import PerhitunganTunjanganPAS from "../pages/admin/RiwayatTupas";
import RiwayatTupas from "../pages/admin/RiwayatTupas";
import SettingsMenu from "../pages/settings";

// Notifications
import NotificationsPage from "../pages/notifications";
import NotificationDetailPage from "../pages/notifications/Detail";

export default function AppRoutes() {
  const { user } = useAuth();

  // Wrapper Layout (Agar tidak berulang)
  const PublicPage = ({ children }: { children: React.ReactNode }) => (
    <AdminLayout isAdmin={false}>{children}</AdminLayout>
  );

  const UserPage = ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute role="user">
      <AdminLayout isAdmin={false}>{children}</AdminLayout>
    </ProtectedRoute>
  );

  const AdminPage = ({ children }: { children: React.ReactNode }) => (
    <ProtectedRoute role="admin">
      <AdminLayout isAdmin={true}>{children}</AdminLayout>
    </ProtectedRoute>
  );

  return (
    <Routes>

      {/* PUBLIC */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === "admin" ? "/admin" : "/user"} />
          ) : (
            <PublicPage>
              <Home />
            </PublicPage>
          )
        }
      />

      <Route
        path="/login"
        element={
          user ? (
            <Navigate to={user.role === "admin" ? "/admin" : "/user"} />
          ) : (
            <PublicPage>
              <Login />
            </PublicPage>
          )
        }
      />

      {/* USER */}
      <Route
        path="/user"
        element={
          <UserPage>
            <UserDashboard />
          </UserPage>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <AdminPage>
            <AdminDashboard />
          </AdminPage>
        }
      />

      <Route
        path="/admin/DataPembayaran"
        element={
          <AdminPage>
            <DataPembayaran />
          </AdminPage>
        }
      />

      <Route
        path="/admin/DataTupas"
        element={
          <AdminPage>
            <DataTupas />
          </AdminPage>
        }
      />

      <Route
        path="/admin/Ketentuan"
        element={
          <AdminPage>
            <Ketentuan />
          </AdminPage>
        }
      />

      <Route
        path="/admin/LogPembayaran"
        element={
          <AdminPage>
            <LogPembayaran />
          </AdminPage>
        }
      />

      <Route
        path="/admin/PerhitunganTunjanganPAS"
        element={
          <AdminPage>
            <PerhitunganTunjanganPAS />
          </AdminPage>
        }
      />

      <Route
        path="/admin/RiwayatTupas"
        element={
          <AdminPage>
            <RiwayatTupas />
          </AdminPage>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <AdminPage>
            <SettingsMenu />
          </AdminPage>
        }
      />

      {/* NOTIFICATIONS */}
      <Route
        path="/notifications"
        element={
          <AdminPage>
            <NotificationsPage />
          </AdminPage>
        }
      />

      <Route
        path="/notifications/:id"
        element={
          <AdminPage>
            <NotificationDetailPage />
          </AdminPage>
        }
      />
    </Routes>
  );
}
