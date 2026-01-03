import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import { Routes, Route, Navigate } from "react-router-dom";
import { authProvider, dataProvider } from "./providers";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import User from "./pages/User";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <Refine
      routerProvider={routerProvider}
      authProvider={authProvider}
      dataProvider={dataProvider}
      resources={[
        {
          name: "users",
          list: "/users",
        },
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
      }}
    >
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <User />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Refine>
  );
}
