import { AuthProvider } from "./auth/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense } from "react";
import Login from "./pages/Login";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>} />
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
