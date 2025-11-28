import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roleRequired: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roleRequired }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!user.role) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== roleRequired) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
