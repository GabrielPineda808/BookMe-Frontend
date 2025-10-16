import { AuthProvider } from "./auth/AuthContext";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense } from "react";
import Login from "./pages/Login";
import PrivateRoute from "./route/PrivateRoute";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import AccountVerification from "./pages/AccountVerification";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AuthLayout from "./components/AuthLayout";
import MainLayout from "./components/MainLayout";
import NotFoundRoute from "./route/NotFoundRoute";
import DefaultRoute from "./route/DefaultRoute";

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<DefaultRoute />} />

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify" element={<AccountVerification />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/auth/*" element={<NotFoundRoute />} />
          </Route>

          <Route element={<MainLayout />}>
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFoundRoute />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

export default App;
