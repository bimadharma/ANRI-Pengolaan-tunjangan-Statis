import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./providers/AuthProvider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Navbar onSidebarClick={() => {}} isAdminPage={false} />
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
