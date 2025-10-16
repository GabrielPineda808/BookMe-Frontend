import React from "react";
import { useAuth } from "../auth/AuthContext";
import { Link } from "react-router-dom";

export default function NotFoundRoute() {
  const { user } = useAuth();

  return (
    <div style={{ padding: 40, textAlign: "center" }}>
      <h1>Page not found</h1>
      <p>The page you were looking for doesn't exist.</p>
      <p>
        {user ? (
          <Link to="/home">Go to Dashboard</Link>
        ) : (
          <Link to="/login">Go to Login</Link>
        )}
      </p>
    </div>
  );
}
