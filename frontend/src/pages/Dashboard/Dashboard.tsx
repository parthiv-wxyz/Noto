import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import Navbar from "../../components/navbar/Navbar";
import { getDashboardStats } from "../../services/dashboardServices";

type Stats = Record<string, number>;

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div style={{
    background: "#0e1628",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
    padding: "1.4rem 1.6rem",
    minWidth: "150px",
    flex: "1 1 150px",
  }}>
    <div style={{
      fontSize: "2rem",
      fontWeight: 600,
      color: "#e8a232",
      fontFamily: "'Playfair Display', serif",
      lineHeight: 1,
    }}>
      {value.toLocaleString()}
    </div>
    <div style={{
      fontSize: "0.72rem",
      color: "#6b7a99",
      marginTop: "6px",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
    }}>
      {label}
    </div>
  </div>
);

const StatCardSkeleton = () => (
  <div style={{
    background: "#0e1628",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
    padding: "1.4rem 1.6rem",
    minWidth: "150px",
    flex: "1 1 150px",
  }}>
    <div style={{
      height: "2rem",
      width: "60px",
      background: "rgba(255,255,255,0.06)",
      borderRadius: "6px",
      marginBottom: "8px",
      animation: "shimmer 1.5s ease-in-out infinite",
    }} />
    <div style={{
      height: "0.65rem",
      width: "90px",
      background: "rgba(255,255,255,0.04)",
      borderRadius: "4px",
      animation: "shimmer 1.5s ease-in-out infinite 0.2s",
    }} />
  </div>
);

function Dashboard() {
  const { user, role } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const roleLabel =
    role === "super_admin" ? "Super Admin" :
    role === "admin" ? "Admin" :
    "Member";

  // Sections: personal stats first, then platform-wide for elevated roles
  const personalStats = stats ? [
    { label: "My Uploads", value: stats.uploadCount ?? 0 },
    { label: "My Downloads", value: stats.downloadCount ?? 0 },
  ] : [];

  const platformStats = stats && (role === "admin" || role === "super_admin") ? [
    { label: "Total Materials", value: stats.totalMaterials ?? 0 },
    { label: "Uploads Today", value: stats.uploadsToday ?? 0 },
    { label: "Deleted Materials", value: stats.deletedCount ?? 0 },
  ] : [];

  const adminOnlyStats = stats && role === "super_admin" ? [
    { label: "Total Users", value: stats.totalUsers ?? 0 },
    { label: "Audit Entries", value: stats.auditCount ?? 0 },
  ] : [];

  return (
    <>
      <Navbar />
      <div style={{
        padding: "2.5rem 1.5rem 3rem",
        maxWidth: "1000px",
        margin: "0 auto",
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <h1 style={{
            color: "#f0f4ff",
            fontFamily: "'Playfair Display', serif",
            fontSize: "1.75rem",
            margin: 0,
            fontWeight: 600,
          }}>
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
          </h1>
          <p style={{ color: "#4f5f80", fontSize: "0.83rem", marginTop: "6px", margin: "6px 0 0" }}>
            <span style={{
              display: "inline-block",
              background: "rgba(232,162,50,0.1)",
              border: "1px solid rgba(232,162,50,0.2)",
              color: "#e8a232",
              fontSize: "0.68rem",
              fontWeight: 500,
              padding: "0.15rem 0.55rem",
              borderRadius: "100px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginRight: "0.5rem",
            }}>
              {roleLabel}
            </span>
            {user?.email}
          </p>
        </div>

        {/* Personal stats */}
        <Section label="My Activity">
          {loading ? (
            <StatsRow>
              <StatCardSkeleton /><StatCardSkeleton />
            </StatsRow>
          ) : (
            <StatsRow>
              {personalStats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} />)}
            </StatsRow>
          )}
        </Section>

        {/* Platform stats — admin + super_admin */}
        {(role === "admin" || role === "super_admin") && (
          <Section label="Platform Overview">
            {loading ? (
              <StatsRow>
                <StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton />
              </StatsRow>
            ) : (
              <StatsRow>
                {platformStats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} />)}
              </StatsRow>
            )}
          </Section>
        )}

        {/* Super admin only */}
        {role === "super_admin" && (
          <Section label="Administration">
            {loading ? (
              <StatsRow>
                <StatCardSkeleton /><StatCardSkeleton />
              </StatsRow>
            ) : (
              <StatsRow>
                {adminOnlyStats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} />)}
              </StatsRow>
            )}
          </Section>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=DM+Sans:wght@300;400;500&display=swap');
        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}

// Small layout helpers defined inline to avoid extra files
const Section = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: "2rem" }}>
    <p style={{
      color: "#4f5f80",
      fontSize: "0.7rem",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      marginBottom: "0.85rem",
      margin: "0 0 0.85rem",
    }}>
      {label}
    </p>
    {children}
  </div>
);

const StatsRow = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
    {children}
  </div>
);

export default Dashboard;