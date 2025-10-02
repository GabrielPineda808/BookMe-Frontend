import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/Api";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post("/auth/login", { username, password });
      const token = res.data?.token;
      if (!token) throw new Error("No token returned");
      login(token); // persists token and sets user
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input></input>
      </form>
    </div>
  );
}
