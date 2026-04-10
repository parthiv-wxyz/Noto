import Navbar from "../components/navbar/Navbar";
import { useAuth } from "../hooks/useAuth";
import { useState } from "react";
import { supabase } from "../services/supabaseClient";

function Settings() {
  const { user } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) { setMsg({ text: "Please fill in both fields.", type: "error" }); return; }
    if (newPassword !== confirmPassword) { setMsg({ text: "Passwords do not match.", type: "error" }); return; }
    if (newPassword.length < 6) { setMsg({ text: "Password must be at least 6 characters.", type: "error" }); return; }
    setLoading(true);
    setMsg(null);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoading(false);
    if (error) setMsg({ text: error.message, type: "error" });
    else { setMsg({ text: "Password updated successfully.", type: "success" }); setNewPassword(""); setConfirmPassword(""); }
  };

  return (
    <>
      <Navbar />
      <div className="settings-root">
        <div className="settings-container">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-sub">Manage your profile and account preferences</p>

          {/* Profile card */}
          <section className="settings-section">
            <h2 className="settings-section-title">Profile</h2>
            <div className="settings-profile-row">
              <div className="settings-avatar">
                {user?.email?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <div className="settings-profile-email">{user?.email}</div>
                <div className="settings-profile-id">ID: {user?.id?.slice(0, 8)}…</div>
              </div>
            </div>
          </section>

          {/* Change password */}
          <section className="settings-section">
            <h2 className="settings-section-title">Change Password</h2>

            {msg && (
              <div className={`settings-msg settings-msg--${msg.type}`}>{msg.text}</div>
            )}

            <div className="settings-field">
              <label>New Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="settings-field">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordChange()}
              />
            </div>
            <button className="settings-btn" onClick={handlePasswordChange} disabled={loading}>
              {loading ? "Updating…" : "Update Password"}
            </button>
          </section>

          {/* Account info */}
          <section className="settings-section">
            <h2 className="settings-section-title">Account</h2>
            <div className="settings-info-row">
              <span className="settings-info-label">Email verified</span>
              <span className={`settings-badge ${user?.email_confirmed_at ? "settings-badge--green" : "settings-badge--yellow"}`}>
                {user?.email_confirmed_at ? "Verified" : "Unverified"}
              </span>
            </div>
            <div className="settings-info-row">
              <span className="settings-info-label">Member since</span>
              <span className="settings-info-value">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}
              </span>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');

        .settings-root {
          flex: 1;
          padding: 2.5rem 1.5rem;
          font-family: 'DM Sans', sans-serif;
          color: #eef2ff;
          background: #080f1f;
        }

        .settings-container {
          max-width: 560px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .settings-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.8rem;
          font-weight: 600;
          color: #f0f4ff;
          margin: 0;
        }

        .settings-sub {
          color: #4f5f80;
          font-size: 0.85rem;
          margin: -1.25rem 0 0;
        }

        .settings-section {
          background: #0e1628;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .settings-section-title {
          font-size: 0.78rem;
          font-weight: 500;
          color: #4f5f80;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin: 0 0 0.25rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 0.6rem;
        }

        .settings-profile-row {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .settings-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: #1e2d50;
          border: 1px solid rgba(232,162,50,0.3);
          color: #e8a232;
          font-size: 1.2rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .settings-profile-email {
          font-size: 0.92rem;
          color: #c8d3e8;
          font-weight: 400;
        }

        .settings-profile-id {
          font-size: 0.72rem;
          color: #4f5f80;
          margin-top: 2px;
          font-family: monospace;
        }

        .settings-msg {
          border-radius: 8px;
          padding: 0.6rem 0.85rem;
          font-size: 0.82rem;
        }

        .settings-msg--success {
          background: rgba(34,197,94,0.08);
          border: 1px solid rgba(34,197,94,0.2);
          color: #4ade80;
        }

        .settings-msg--error {
          background: rgba(220,60,60,0.08);
          border: 1px solid rgba(220,60,60,0.2);
          color: #e87272;
        }

        .settings-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .settings-field label {
          font-size: 0.75rem;
          color: #6b7a99;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .settings-field input {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9px;
          padding: 0.6rem 0.85rem;
          color: #eef2ff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.18s;
        }

        .settings-field input:focus {
          border-color: rgba(232,162,50,0.45);
        }

        .settings-field input::placeholder { color: #2e3d5c; }

        .settings-btn {
          align-self: flex-start;
          padding: 0.55rem 1.2rem;
          background: #e8a232;
          border: none;
          border-radius: 9px;
          color: #080f1f;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.18s;
        }

        .settings-btn:hover { opacity: 0.88; }
        .settings-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .settings-info-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.35rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }

        .settings-info-row:last-child { border-bottom: none; }

        .settings-info-label {
          font-size: 0.83rem;
          color: #6b7a99;
        }

        .settings-info-value {
          font-size: 0.83rem;
          color: #c8d3e8;
        }

        .settings-badge {
          font-size: 0.72rem;
          font-weight: 500;
          padding: 0.2rem 0.6rem;
          border-radius: 100px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .settings-badge--green {
          background: rgba(34,197,94,0.1);
          color: #4ade80;
          border: 1px solid rgba(34,197,94,0.2);
        }

        .settings-badge--yellow {
          background: rgba(232,162,50,0.1);
          color: #e8a232;
          border: 1px solid rgba(232,162,50,0.2);
        }
      `}</style>
    </>
  );
}

export default Settings;