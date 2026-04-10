import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#080f1f",
      fontFamily: "'DM Sans', sans-serif",
      textAlign: "center",
      padding: "2rem",
      gap: "1.25rem",
    }}>
      <div style={{ fontSize: "4rem", lineHeight: 1 }}>404</div>

      <div style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.5rem",
        color: "#f0f4ff",
        fontWeight: 600,
      }}>
        Page not found
      </div>

      <p style={{ color: "#4f5f80", fontSize: "0.88rem", maxWidth: "320px", margin: 0 }}>
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "0.55rem 1.1rem",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "9px",
            color: "#6b7a99",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.875rem",
            cursor: "pointer",
          }}
        >
          Go back
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "0.55rem 1.3rem",
            background: "#e8a232",
            border: "none",
            borderRadius: "9px",
            color: "#080f1f",
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.875rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          Home
        </button>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');
        div { box-sizing: border-box; }
        div[style*="4rem"] {
          font-family: 'Playfair Display', serif;
          color: #e8a232;
          font-weight: 600;
          opacity: 0.35;
        }
      `}</style>
    </div>
  );
}

export default NotFound;