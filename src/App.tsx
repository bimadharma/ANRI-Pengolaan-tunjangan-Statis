import React from "react";
import { Refine, Authenticated, useGetIdentity } from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { authProvider } from "./authProvider";
import Navbar from "./components/Navbar";
import AdminLayout from "./components/layout/AdminLayout";
import UserLayout from "./components/layout/UserLayout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DataPembayaran from "./pages/admin/DataPembayaran";
import DataTupas from "./pages/admin/DataTupas";
import Ketentuan from "./pages/admin/Ketentuan";
import LogPembayaran from "./pages/admin/LogPembayaran";
import PerhitunganTunjanganPAS from "./pages/admin/RiwayatTupas"; // Cek nama file ini
import RiwayatTupas from "./pages/admin/RiwayatTupas";
import SettingsMenu from "./pages/settings";
import NotificationsPage from "./pages/notifications";
import NotificationDetailPage from "./pages/notifications/Detail";
import DashboardPAS from "./pages/Users/UserDashboard";
import TupasUserPage from "./pages/Users/DataTupas";

// 1. Guard Khusus Admin
const AdminRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useGetIdentity<{ role: string }>();

  if (isLoading) return <div className="p-4">Checking Access...</div>;

  if (user?.role !== "admin") {
    return <Navigate to="/user" replace />;
  }
  return <>{children}</>;
};

// 2. Guard Khusus User
const UserRouteGuard = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useGetIdentity<{ role: string }>();

  if (isLoading) return <div className="p-4">Checking Access...</div>;

  if (user?.role !== "user") {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};

// 3. Layout Public
const PublicLayout = () => {
  return (
    <>
      <Navbar onSidebarClick={() => {}} isAdminPage={false} />
      <div className="container-fluid">
        <Outlet />
      </div>
    </>
  );
};

const NotificationLayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useGetIdentity<{ role: string }>();

  if (isLoading) return <div className="p-4">Loading...</div>;

  if (user?.role === "admin") {
    return <AdminLayout isAdmin={true}>{children}</AdminLayout>;
  }

  return <UserLayout isUser={true}>{children}</UserLayout>;
};

// 4. Redirect Login
const RoleBasedRedirect = () => {
  const { data: user, isLoading } = useGetIdentity<{ role: string }>();
  if (isLoading) return <div>Loading...</div>;
  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  if (user?.role === "user") return <Navigate to="/user" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Refine
        authProvider={authProvider}
        dataProvider={dataProvider("http://localhost:3001")}
        resources={[
          { name: "admin", list: "/admin" },
          { name: "user", list: "/user" },
        ]}
        options={{
          syncWithLocation: true,
          warnWhenUnsavedChanges: true,
        }}
      >
        <Routes>
          {/* --- PUBLIC ROUTES (Login & Redirect) --- */}
          <Route
            element={
              <Authenticated key="public" fallback={<PublicLayout />} loading={<div>Loading...</div>}>
                <RoleBasedRedirect />
              </Authenticated>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Route>
          {/* --- ADMIN ROUTES (DIPROTEKSI) --- */}
          <Route
            element={
              // 1. Cek apakah Login?
              <Authenticated key="admin" redirectOnFail="/login">
                <AdminRouteGuard>
                  <AdminLayout isAdmin={true}>
                    <Outlet />
                  </AdminLayout>
                </AdminRouteGuard>
              </Authenticated>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/DataPembayaran" element={<DataPembayaran />} />
            <Route path="/admin/DataTupas" element={<DataTupas />} />
            <Route path="/admin/Ketentuan" element={<Ketentuan />} />
            <Route path="/admin/LogPembayaran" element={<LogPembayaran />} />
            <Route path="/admin/PerhitunganTunjanganPAS" element={<PerhitunganTunjanganPAS />} />
            <Route path="/admin/RiwayatTupas" element={<RiwayatTupas />} />
            <Route path="/admin/settings" element={<SettingsMenu />} />
          </Route>
          {/* --- USER ROUTES (DIPROTEKSI) --- */}
          <Route
            element={
              <Authenticated key="user" redirectOnFail="/login">
                {/* 2. Cek apakah Role === USER? */}
                <UserRouteGuard>
                  <UserLayout isUser={true}>
                    <Outlet />
                  </UserLayout>
                </UserRouteGuard>
              </Authenticated>
            }
          >
            <Route path="/user/DataTupas" element={<TupasUserPage/>} />
            <Route path="/user" element={<DashboardPAS />} />
            {/* Tambahkan halaman user lain di sini */}
          </Route>

          {/* --- SHARED ROUTES (ADMIN & USER) --- */}
          <Route
            element={
              <Authenticated key="shared" redirectOnFail="/login">
                <NotificationLayoutWrapper>
                  <Outlet />
                </NotificationLayoutWrapper>
              </Authenticated>
            }
          >
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/notifications/:id" element={<NotificationDetailPage />} />
          </Route>

          {/* Fallback 404 */}
          <Route
            path="*"
            element={
              <div className="h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800">404</h1>
                  <p className="text-gray-600 mb-4">Halaman tidak ditemukan</p>
                  <a href="/" className="text-blue-600 hover:underline">
                    Kembali
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Refine>
    </BrowserRouter>
  );
}

export default App;
