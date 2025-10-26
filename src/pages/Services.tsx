import React, { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/Api";

export default function Services() {
  const { user, logout } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return; // wait until user is available

    async function load() {
      setLoading(true);
      try {
        const res = await api.get("/service");
        setServices(res.data ?? []);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
      load();
      return () => {};
    }
  }, [user?.id]);

  return (
    <div>
      {loading && <div>Loading bookings…</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {!loading && services.length === 0 && <div>No bookings found</div>}
      {services.map((booking: any, idx: number) => (
        <div key={booking.id ?? idx}>
          <h3>{booking.title ?? `Booking ${idx + 1}`}</h3>
          <p>{JSON.stringify(booking)}</p>
        </div>
      ))}
    </div>
  );
}
