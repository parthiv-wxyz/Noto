import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import "./Navbar.css";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setMenuOpen(false);
    navigate("/login");
  };

  const handleNav = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo / Brand */}
        <div className="navbar-brand" onClick={() => handleNav("/")}>
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="2" y="2" width="8" height="10" rx="1.5" fill="currentColor" opacity="0.9" />
              <rect x="12" y="2" width="8" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
              <rect x="12" y="10" width="8" height="10" rx="1.5" fill="currentColor" opacity="0.7" />
              <rect x="2" y="14" width="8" height="6" rx="1.5" fill="currentColor" opacity="0.4" />
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-name">NoteShare</span>
            <span className="brand-tagline">Academic Hub</span>
          </div>
        </div>

        {/* Desktop: Nav Links */}
        <div className="navbar-links">
          <a className="nav-link" onClick={() => handleNav("/browse")}>Browse</a>
          {user && (
            <a className="nav-link" onClick={() => handleNav("/upload")}>Upload</a>
          )}
        </div>

        {/* Desktop: Auth Button */}
        <div className="navbar-actions">
          {user ? (
            <div className="user-section">
              <div className="user-avatar" title={user.email}>
                {user.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <button className="btn-logout" onClick={handleLogout}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Logout
              </button>
            </div>
          ) : (
            <button className="btn-login" onClick={() => handleNav("/login")}>
              Sign In
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile: Hamburger */}
        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${menuOpen ? "visible" : ""}`}>
        <a className="drawer-link" onClick={() => handleNav("/browse")}>Browse</a>
        {user && (
          <a className="drawer-link" onClick={() => handleNav("/upload")}>Upload</a>
        )}
        <div className="drawer-divider" />
        {user ? (
          <div className="drawer-user">
            <div className="drawer-email">{user.email}</div>
            <button className="btn-logout drawer-btn" onClick={handleLogout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        ) : (
          <button className="btn-login drawer-btn" onClick={() => handleNav("/login")}>
            Sign In
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;