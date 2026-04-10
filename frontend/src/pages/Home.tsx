import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { getMaterials } from "../services/materialService";

function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [materialCount, setMaterialCount] = useState<number | null>(null);

  useEffect(() => {
    getMaterials({}).then((data) => setMaterialCount(data.length)).catch(() => {});
  }, []);

  return (
    <div className="home-root">
      {/* Ambient background */}
      <div className="home-bg">
        <div className="home-bg-orb home-bg-orb--1" />
        <div className="home-bg-orb home-bg-orb--2" />
        <div className="home-bg-grid" />
      </div>

      {/* Hero */}
      <main className="home-hero">
        <div className="home-badge">
          <span className="home-badge-dot" />
          Academic Resource Platform
        </div>

        <h1 className="home-title">
          Find every note,<br />
          <span className="home-title-accent">ace every exam.</span>
        </h1>

        <p className="home-subtitle">
          Browse and share study materials, question papers, and notes from students and faculty — all in one place.
        </p>

        {materialCount !== null && (
          <div className="home-stat">
            <span className="home-stat-number">{materialCount.toLocaleString()}</span>
            <span className="home-stat-label">materials available</span>
          </div>
        )}

        <div className="home-ctas">
          <button className="home-cta-primary" onClick={() => navigate("/browse")}>
            Browse Materials
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {user ? (
            <button className="home-cta-secondary" onClick={() => navigate("/upload")}>
              Upload Material
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </button>
          ) : (
            <button className="home-cta-secondary" onClick={() => navigate("/login")}>
              Sign In to Upload
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" />
              </svg>
            </button>
          )}
        </div>

        {/* Feature chips */}
        <div className="home-features">
          {[
            { icon: "📚", label: "Notes & Materials" },
            { icon: "📝", label: "Question Papers" },
            { icon: "🔍", label: "Filter by Subject" },
            { icon: "⬇️", label: "Instant Downloads" },
          ].map((f) => (
            <div key={f.label} className="home-feature-chip">
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .home-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          font-family: 'DM Sans', sans-serif;
          background: #080f1f;
        }

        .home-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .home-bg-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
        }

        .home-bg-orb--1 {
          width: 500px;
          height: 500px;
          background: #e8a232;
          top: -100px;
          right: -80px;
          animation: orbFloat 12s ease-in-out infinite alternate;
        }

        .home-bg-orb--2 {
          width: 400px;
          height: 400px;
          background: #2563eb;
          bottom: -80px;
          left: -60px;
          animation: orbFloat 10s ease-in-out infinite alternate-reverse;
        }

        @keyframes orbFloat {
          0% { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 20px) scale(1.08); }
        }

        .home-bg-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .home-hero {
          position: relative;
          z-index: 1;
          max-width: 640px;
          padding: 3rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.25rem;
          animation: heroFadeIn 0.7s ease both;
        }

        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .home-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(232, 162, 50, 0.1);
          border: 1px solid rgba(232, 162, 50, 0.25);
          border-radius: 100px;
          padding: 0.3rem 0.9rem;
          font-size: 0.72rem;
          color: #e8a232;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-weight: 500;
        }

        .home-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #e8a232;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        .home-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          font-weight: 700;
          color: #f0f4ff;
          line-height: 1.18;
          margin: 0;
          letter-spacing: -0.01em;
        }

        .home-title-accent {
          color: #e8a232;
        }

        .home-subtitle {
          font-size: 1rem;
          color: #6b7a99;
          line-height: 1.7;
          max-width: 480px;
          margin: 0;
          font-weight: 300;
        }

        .home-stat {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 0.6rem 1.2rem;
        }

        .home-stat-number {
          font-size: 1.5rem;
          font-weight: 600;
          color: #e8a232;
          font-family: 'Playfair Display', serif;
        }

        .home-stat-label {
          font-size: 0.78rem;
          color: #4f5f80;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .home-ctas {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .home-cta-primary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.4rem;
          background: #e8a232;
          border: none;
          border-radius: 10px;
          color: #080f1f;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: opacity 0.18s, transform 0.15s;
        }

        .home-cta-primary:hover {
          opacity: 0.88;
          transform: translateY(-2px);
        }

        .home-cta-secondary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.7rem 1.4rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          color: #c8d3e8;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 400;
          cursor: pointer;
          transition: background 0.18s, border-color 0.18s, transform 0.15s;
        }

        .home-cta-secondary:hover {
          background: rgba(255,255,255,0.09);
          border-color: rgba(255,255,255,0.18);
          transform: translateY(-2px);
        }

        .home-features {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          justify-content: center;
          margin-top: 0.5rem;
        }

        .home-feature-chip {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 8px;
          padding: 0.35rem 0.75rem;
          font-size: 0.78rem;
          color: #4f5f80;
        }

        @media (max-width: 768px) {
          .home-hero { padding: 5rem 1.5rem 2rem; }
        }
      `}</style>
    </div>
  );
}

export default Home;