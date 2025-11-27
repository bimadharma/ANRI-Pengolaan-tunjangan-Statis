import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LoginUser from "./pages/LoginUser";
import LoginAdmin from "./pages/LoginAdmin";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./routes/ProtectedRoute";

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="container mx-auto p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login/user" element={<LoginUser />} />
          <Route path="/login/admin" element={<LoginAdmin />} />
          <Route
            path="/user"
            element={
              <ProtectedRoute roleRequired="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
