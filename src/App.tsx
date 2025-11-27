import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import NavBar from "./components/Navbar";
import ProtectedRoute from "./routes/AppRoutes";

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <NavBar />

      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* LOGIN UNIVERSAL */}
          <Route path="/login" element={<Login />} />

          {/* USER DASHBOARD */}
          <Route
            path="/user"
            element={
              <ProtectedRoute roleRequired="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* ADMIN DASHBOARD */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
