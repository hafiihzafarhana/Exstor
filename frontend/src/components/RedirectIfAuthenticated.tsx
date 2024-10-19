import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RedirectIfAuthenticated: React.FC<{
  redirectTo: string;
  children: React.ReactNode;
}> = ({ children, redirectTo }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? (
    <Navigate to={redirectTo} replace />
  ) : (
    <>{children}</>
  );
};

export default RedirectIfAuthenticated;
