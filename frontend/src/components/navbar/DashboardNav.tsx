import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabaseClient";
import "./Navbar.css";

function DashboardNav() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={() => navigate("/dashboard")}>
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

        <div className="navbar-actions">
          <div className="user-section">
            <button className="btn-logout" onClick={handleLogout}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default DashboardNav;