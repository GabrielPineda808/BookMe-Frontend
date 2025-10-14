import { AuthProvider } from "./auth/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import Login from "./pages/Login";
import PrivateRoute from "./route/PrivateRoute";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import AccountVerification from "./pages/AccountVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<AccountVerification />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
