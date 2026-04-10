import { useState } from "react";
import { supabase } from "../services/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true);
    setError("");
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (authError) { setError(authError.message); return; }
    navigate("/");
  };

  return (
    <div className="auth-root">
      <div className="auth-card">
        <div className="auth-brand">
          <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
            <rect x="2" y="2" width="8" height="10" rx="1.5" fill="#e8a232" opacity="0.9" />
            <rect x="12" y="2" width="8" height="6" rx="1.5" fill="#e8a232" opacity="0.5" />
            <rect x="12" y="10" width="8" height="10" rx="1.5" fill="#e8a232" opacity="0.7" />
            <rect x="2" y="14" width="8" height="6" rx="1.5" fill="#e8a232" opacity="0.4" />
          </svg>
          <span>NoteShare</span>
        </div>
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-sub">Sign in to your account</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-field">
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="auth-field">
          <label>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        </div>

        <button className="auth-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');
        .auth-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #080f1f;
          font-family: 'DM Sans', sans-serif;
          padding: 2rem 1rem;
        }
        .auth-card {
          width: 100%;
          max-width: 380px;
          background: #0e1628;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 2.25rem 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .auth-brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          color: #f0f4ff;
          margin-bottom: 0.25rem;
        }
        .auth-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          color: #f0f4ff;
          margin: 0;
          font-weight: 600;
        }
        .auth-sub {
          color: #4f5f80;
          font-size: 0.85rem;
          margin: -0.5rem 0 0;
        }
        .auth-error {
          background: rgba(220,60,60,0.1);
          border: 1px solid rgba(220,60,60,0.25);
          border-radius: 8px;
          padding: 0.6rem 0.85rem;
          color: #e87272;
          font-size: 0.82rem;
        }
        .auth-field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .auth-field label {
          font-size: 0.78rem;
          color: #6b7a99;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .auth-field input {
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
        .auth-field input:focus {
          border-color: rgba(232,162,50,0.45);
        }
        .auth-field input::placeholder { color: #2e3d5c; }
        .auth-btn {
          margin-top: 0.25rem;
          padding: 0.65rem 1rem;
          background: #e8a232;
          border: none;
          border-radius: 10px;
          color: #080f1f;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.18s;
        }
        .auth-btn:hover { opacity: 0.88; }
        .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .auth-footer {
          text-align: center;
          font-size: 0.82rem;
          color: #4f5f80;
        }
        .auth-footer a { color: #e8a232; text-decoration: none; }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}

export default Login;