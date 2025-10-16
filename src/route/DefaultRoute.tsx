import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function DefaultRoute() {
  const { user } = useAuth();

  return user ? (
    <Navigate to="/home" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}
