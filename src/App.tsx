import { Refine, Authenticated, useGetIdentity } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  useNotificationProvider,
  ErrorComponent, 
} from "@refinedev/antd";
import routerProvider, {
  CatchAllNavigate,
  UnsavedChangesNotifier,
  DocumentTitleHandler,
} from "@refinedev/react-router";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { App as AntdApp, ConfigProvider, Spin } from "antd";
import {
  DashboardFilled,
  FileTextOutlined,
  SettingOutlined,
  BookOutlined,
  WalletOutlined,
  HistoryOutlined,
  BarsOutlined,
} from "@ant-design/icons";

import { authProvider, dataProvider, accessControlProvider } from "./providers";
import { ThemedLayout } from "./components/Layout/index";
import Login from "./pages/Login";


import { DashboardAdmin } from "./pages/DashboardAdmin/Admin";
import { DashboardUser } from "./pages/DashboardUser/User";
import Home from "./pages/home";
import { KetentuanList } from "./pages/DashboardAdmin/Ketentuan/list";
import { TupasList } from "./pages/DashboardAdmin/DataTupas/list";
import { PembayaranList } from "./pages/DashboardAdmin/DataPembayaran/list";
import { LogPerubahanList } from "./pages/DashboardAdmin/LogPerubahan/list";
import { RiwayatTupasList } from "./pages/DashboardAdmin/RiwayatTupas/list";
import { UserProfile } from "./pages/DashboardAdmin/Profile/list";

import { AppTitle } from "./components/AppTitle";


const Placeholder = ({ title }: { title: string }) => (
  <div style={{ padding: 24, background: "#fff" }}>
    <h2>{title}</h2>
    <p>Halaman ini belum diimplementasikan.</p>
  </div>
);


const DashboardWrapper = () => {
  const { data: identity, isLoading } = useGetIdentity();

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  }

  
  if (identity?.role === "user") {
    return <DashboardUser />;
  }

  
  return <DashboardAdmin />;
};



const RoleProtected = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const { data: identity, isLoading } = useGetIdentity();

  if (isLoading) {
    return <div style={{ display: "flex", justifyContent: "center", marginTop: 50 }}><Spin /></div>;
  }

  
  if (identity?.role && allowedRoles.includes(identity.role)) {
    return <Outlet />;
  }

  
  
  return <ErrorComponent />;
};

export default function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#00509d",
        },
      }}
    >
      <AntdApp>
        <RefineKbarProvider>
          <Refine
            dataProvider={dataProvider}
            notificationProvider={useNotificationProvider}
            routerProvider={routerProvider}
            authProvider={authProvider}
            accessControlProvider={accessControlProvider}
            resources={[
              {
                name: "dashboard",
                list: "/dashboard",
                meta: { label: "Dashboard", icon: <DashboardFilled />, roles: ["admin", "user"] },
              },
              {
                name: "ketentuan",
                list: "/ketentuan",
                meta: { label: "Ketentuan", icon: <BookOutlined />, roles: ["admin"] },
              },
              {
                name: "data_tupas",
                list: "/data-tupas",
                meta: { label: "Data Tupas", icon: <FileTextOutlined />, roles: ["admin"] },
              },
              {
                name: "data_pembayaran",
                list: "/data-pembayaran",
                meta: { label: "Data Pembayaran", icon: <WalletOutlined />, roles: ["admin"] },
              },
              {
                name: "log_perubahan",
                list: "/log-perubahan",
                meta: { label: "Log Perubahan", icon: <BarsOutlined />, roles: ["admin"] },
              },
              {
                name: "riwayat_pembayaran",
                list: "/riwayat-pembayaran",
                meta: { label: "Riwayat Pembayaran", icon: <HistoryOutlined />, roles: ["admin"] },
              },
              {
                name: "settings",
                list: "/settings",
                meta: { label: "Settings", icon: <SettingOutlined />, roles: ["admin"] },
              },
            ]}
          >
            <Routes>
              {/* --- PUBLIC ROUTES --- */}
              <Route path="/" element={
                  <Authenticated key="root" fallback={<Home />}>
                    <Navigate to="/dashboard" replace />
                  </Authenticated>
              } />
              
              {/* diblokir jika sudah login */}
              <Route path="/home" element={
                  <Authenticated key="home" fallback={<Home />}>
                    <Navigate to="/dashboard" replace />
                  </Authenticated>
              } />

              <Route path="/login" element={
                  <Authenticated key="login" fallback={<Login />}>
                    <Navigate to="/dashboard" replace />
                  </Authenticated>
              } />

              {/* --- AUTHENTICATED ROUTES --- */}
              <Route
                element={
                  <Authenticated key="auth-layout" fallback={<CatchAllNavigate to="/login" />}>
                    <ThemedLayout Title={AppTitle}>
                      <Outlet />
                    </ThemedLayout>
                  </Authenticated>
                }
              >
                {/* Bisa Diakses Semua Role */}
                <Route path="/dashboard" element={<DashboardWrapper />} />

                {/* ADMIN ONLY ROUTES */}
                <Route element={<RoleProtected allowedRoles={["admin"]} />}>
                    <Route path="/ketentuan" element={<KetentuanList />} />
                    <Route path="/data-tupas" element={<TupasList />} />
                    <Route path="/data-pembayaran" element={<PembayaranList />} />
                    <Route path="/log-perubahan" element={<LogPerubahanList />} />
                    <Route path="/riwayat-pembayaran" element={<RiwayatTupasList />} />
                    <Route path="/settings" element={<UserProfile />} />
                </Route>
              </Route>

              {/* --- ERROR HANDLING --- */}
              <Route
                element={
                  <Authenticated key="catch-all" fallback={<CatchAllNavigate to="/login" />}>
                    <ThemedLayout Title={AppTitle}>
                       <Outlet />
                    </ThemedLayout>
                  </Authenticated>
                }
              >
                <Route path="*" element={<ErrorComponent />} />
              </Route>

            </Routes>
            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </RefineKbarProvider>
      </AntdApp>
    </ConfigProvider>
  );
}