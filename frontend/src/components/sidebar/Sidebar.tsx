import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { supabase } from "../../services/supabaseClient";
import { useState } from "react";
import "./Sidebar.css";

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
const DashboardIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="9" rx="1.5" /><rect x="14" y="3" width="7" height="5" rx="1.5" /><rect x="14" y="12" width="7" height="9" rx="1.5" /><rect x="3" y="16" width="7" height="5" rx="1.5" />
  </svg>
);
const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);
const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

type SidebarProps = {
  onCollapseChange?: (collapsed: boolean) => void;
};

function Sidebar({ onCollapseChange }: SidebarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleCollapse = () => {
    const next = !collapsed;
    setCollapsed(next);
    onCollapseChange?.(next);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const navTo = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}

      <button className="sidebar-mobile-toggle" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle sidebar">
        <span /><span /><span />
      </button>

      <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""} ${mobileOpen ? "sidebar--mobile-open" : ""}`}>

        {/* Brand bar with collapse button inside — never overflows sidebar */}
        {!collapsed ? (
          <div className="sidebar-brand">
            {/* Clickable brand area */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.65rem", flex: 1, cursor: "pointer" }} onClick={() => navTo("/")}>
              <div className="sidebar-brand-icon">
                <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                  <rect x="2" y="2" width="8" height="10" rx="1.5" fill="currentColor" opacity="0.9" />
                  <rect x="12" y="2" width="8" height="6" rx="1.5" fill="currentColor" opacity="0.5" />
                  <rect x="12" y="10" width="8" height="10" rx="1.5" fill="currentColor" opacity="0.7" />
                  <rect x="2" y="14" width="8" height="6" rx="1.5" fill="currentColor" opacity="0.4" />
                </svg>
              </div>
              <div className="sidebar-brand-text">
                <span className="sidebar-brand-name">NoteShare</span>
                <span className="sidebar-brand-sub">Academic Hub</span>
              </div>
            </div>
            {/* Collapse button — inside brand bar, fully within sidebar boundary */}
            <button
              className="sidebar-collapse-btn"
              onClick={handleCollapse}
              title="Collapse"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: "rotate(0deg)", transition: "transform 0.25s ease" }}>
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
          </div>
        ) : (
          /* Collapsed: just the expand button filling the header slot */
          <button
            className="sidebar-collapse-btn sidebar-collapse-btn--alone"
            onClick={handleCollapse}
            title="Expand"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transform: "rotate(180deg)", transition: "transform 0.25s ease" }}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <nav className="sidebar-nav">
          <button className={`sidebar-item ${isActive("/") ? "sidebar-item--active" : ""}`} onClick={() => navTo("/")} title="Home">
            <HomeIcon />{!collapsed && <span>Home</span>}
          </button>
          {user && (
            <button className={`sidebar-item ${isActive("/dashboard") ? "sidebar-item--active" : ""}`} onClick={() => navTo("/dashboard")} title="Dashboard">
              <DashboardIcon />{!collapsed && <span>Dashboard</span>}
            </button>
          )}
        </nav>

        <div className="sidebar-bottom">
          <button className={`sidebar-item ${isActive("/settings") ? "sidebar-item--active" : ""}`} onClick={() => navTo("/settings")} title="Settings">
            <SettingsIcon />{!collapsed && <span>Settings</span>}
          </button>

          {user ? (
            <>
              {!collapsed && (
                <div className="sidebar-user">
                  <div className="sidebar-avatar">{user.email?.[0]?.toUpperCase() ?? "U"}</div>
                  <div className="sidebar-user-info">
                    <span className="sidebar-user-email">{user.email}</span>
                  </div>
                </div>
              )}
              <button className="sidebar-item sidebar-item--logout" onClick={handleLogout} title="Logout">
                <LogoutIcon />{!collapsed && <span>Logout</span>}
              </button>
            </>
          ) : (
            !collapsed && (
              <button className="sidebar-signin-btn" onClick={() => navTo("/login")}>Sign In</button>
            )
          )}
        </div>
      </aside>
    </>
  );
}

export default Sidebar;