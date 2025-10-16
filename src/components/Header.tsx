import { Link, NavLink, useLocation, useMatch } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

interface HeaderProps {
  minimal?: boolean;
}

export default function Header({ minimal = false }: HeaderProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const onLoginPage = Boolean(useMatch("/login"));
  const onSignupPage = Boolean(useMatch("/signup"));

  if (minimal) {
    return (
      <header
        style={{ background: "#071022", color: "#fff", padding: "12px 0" }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
              }}
            >
              B
            </div>
            <span style={{ marginLeft: 10, fontWeight: 700 }}>BookMe</span>
          </Link>

          <div>
            <Link to="#" style={{ color: "#a9bfd1", textDecoration: "none" }}>
              Help
            </Link>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      style={{
        background: "#071022",
        color: "#fff",
        padding: "12px 0",
        boxShadow: "0 1px 0 rgba(255,255,255,0.02)",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                background: "linear-gradient(135deg,#7c3aed,#06b6d4)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
              }}
            >
              B
            </div>
            <span style={{ marginLeft: 10, fontWeight: 800, fontSize: 16 }}>
              BookMe
            </span>
          </Link>

          <nav
            aria-label="Main navigation"
            style={{ display: "flex", gap: 12 }}
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
              style={{ color: "#cfe6ff", textDecoration: "none" }}
            >
              Home
            </NavLink>
            <NavLink
              to="#"
              className={({ isActive }) =>
                isActive ? "active-link" : "nav-link"
              }
              style={{ color: "#9fb6cc", textDecoration: "none" }}
            >
              Help
            </NavLink>
            {user && (
              <NavLink
                to="#"
                style={{ color: "#9fb6cc", textDecoration: "none" }}
              >
                My Account
              </NavLink>
            )}
          </nav>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Hide Login on Signup page and vice versa */}
          {!user ? (
            <>
              {!onSignupPage && (
                <Link
                  to="/signup"
                  className="btn btn-dark"
                  style={{
                    padding: "8px 12px",
                    color: "#fff",
                    borderRadius: 6,
                    textDecoration: "none",
                  }}
                >
                  Sign Up
                </Link>
              )}
              {!onLoginPage && (
                <Link
                  to="/login"
                  className="btn btn-dark"
                  style={{
                    padding: "8px 12px",
                    color: "#fff",
                    textDecoration: "none",
                    marginLeft: 8,
                  }}
                >
                  Login
                </Link>
              )}
            </>
          ) : (
            <>
              <span style={{ color: "#cfe6ff", marginRight: 8 }}>
                {user.firstName ?? user.email}
              </span>
              <button
                onClick={logout}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.06)",
                  color: "#cfe6ff",
                  padding: "6px 10px",
                  borderRadius: 6,
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
