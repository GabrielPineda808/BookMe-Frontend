import { useAuth } from "../auth/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <main
      style={{ padding: 24, maxWidth: 900, margin: "0 auto", color: "#fff" }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <h1 style={{ margin: 0 }}>
          Welcome{user?.firstName ? `, ${user.firstName}` : ""}!
        </h1>
        <div>
          <button
            onClick={logout}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff",
              padding: "6px 12px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </header>

      <section style={{ marginTop: 24 }}>
        <h2 style={{ marginBottom: 8, fontSize: 16 }}>
          Decoded user info (from JWT)
        </h2>
        <pre
          style={{
            background: "rgba(255,255,255,0.03)",
            padding: 16,
            borderRadius: 8,
            overflowX: "auto",
            color: "#e6eef8",
            fontSize: 13,
            lineHeight: 1.5,
          }}
        >
          {JSON.stringify(user, null, 2)}
        </pre>
      </section>
    </main>
  );
}
