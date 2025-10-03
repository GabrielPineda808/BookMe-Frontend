import React, { type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) return children;

  // send user to login and remember where they wanted to go
  return <Navigate to="/login" state={{ from: location }} replace />;
}
