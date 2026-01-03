import { useEffect } from "react";
import { Authenticated, usePermissions } from "@refinedev/core";
import { Navigate } from "react-router-dom";

interface Props {
  role: "admin" | "user";
  children: React.ReactNode;
}

export const ProtectedRoute = ({ role, children }: Props) => {
  const { data: permission, isLoading } = usePermissions({});

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Jika role tidak sesuai, redirect ke dashboard yang sesuai
  if (permission && permission !== role) {
    const redirectTo = permission === "admin" ? "/admin" : "/user";
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <Authenticated key="protected" fallback={<Navigate to="/login" replace />}>
      {children}
    </Authenticated>
  );
};
