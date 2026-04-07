import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import DashboardNav from "../../components/navbar/DashboardNav";
import { getDashboardStats } from "../../services/dashboardServices";

type Stats = Record<string, number>;

const StatCard = ({ label, value }: { label: string; value: number }) => (
  <div style={{
    background: "#0e1628",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "12px",
    padding: "1.25rem 1.5rem",
    minWidth: "140px",
  }}>
    <div style={{ fontSize: "1.8rem", fontWeight: 600, color: "#e8a232" }}>{value}</div>
    <div style={{ fontSize: "0.78rem", color: "#6b7a99", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
  </div>
);

type TileProps = {
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick: () => void;
};

const Tile = ({ icon, label, description, onClick }: TileProps) => (
  <div
    onClick={onClick}
    style={{
      background: "#0e1628",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: "14px",
      padding: "1.5rem",
      cursor: "pointer",
      transition: "border-color 0.18s, transform 0.15s",
      display: "flex",
      flexDirection: "column",
      gap: "0.75rem",
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(232,162,50,0.4)";
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)";
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
    }}
  >
    <div style={{ color: "#e8a232", width: 32, height: 32 }}>{icon}</div>
    <div>
      <div style={{ color: "#eef2ff", fontWeight: 500, fontSize: "0.95rem" }}>{label}</div>
      <div style={{ color: "#6b7a99", fontSize: "0.78rem", marginTop: "3px" }}>{description}</div>
    </div>
  </div>
);

function Dashboard() {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    getDashboardStats().then(setStats).catch(console.error);
  }, []);

  const userTiles = [
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
      label: "Browse Materials",
      description: "Search and download study materials",
      path: "/browse",
    },
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
      label: "Upload Material",
      description: "Share notes and resources with peers",
      path: "/upload",
    },
  ];

  const adminTiles = [
    ...userTiles,
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
      label: "Manage Materials",
      description: "Review, delete or restore uploads",
      path: "/browse",
    },
  ];

  const superAdminTiles = [
    ...adminTiles,
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
      label: "User Management",
      description: "Promote or demote user roles",
      path: "/admin/users",
    },
    {
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
      label: "Audit Logs",
      description: "View all system activity",
      path: "/admin/audit",
    },
  ];

  const tiles =
    role === "super_admin" ? superAdminTiles :
    role === "admin" ? adminTiles :
    userTiles;

  const userStats = stats ? [
    { label: "Materials Uploaded", value: stats.uploadCount ?? 0 },
    { label: "Downloads Made", value: stats.downloadCount ?? 0 },
  ] : [];

  const adminStats = stats ? [
    { label: "Total Materials", value: stats.totalMaterials ?? 0 },
    { label: "Uploads Today", value: stats.uploadsToday ?? 0 },
    { label: "Deleted Materials", value: stats.deletedCount ?? 0 },
  ] : [];

  const superAdminStats = stats ? [
    { label: "Total Materials", value: stats.totalMaterials ?? 0 },
    { label: "Uploads Today", value: stats.uploadsToday ?? 0 },
    { label: "Deleted Materials", value: stats.deletedCount ?? 0 },
    { label: "Total Users", value: stats.totalUsers ?? 0 },
    { label: "Audit Entries", value: stats.auditCount ?? 0 },
  ] : [];

  const statCards =
    role === "super_admin" ? superAdminStats :
    role === "admin" ? adminStats :
    userStats;

  return (
    <div style={{ minHeight: "100vh", background: "#080f1f", fontFamily: "'DM Sans', sans-serif" }}>
      <DashboardNav />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ color: "#eef2ff", fontFamily: "'Playfair Display', serif", fontSize: "1.6rem", margin: 0 }}>
            Welcome back{user?.email ? `, ${user.email.split("@")[0]}` : ""}
          </h1>
          <p style={{ color: "#6b7a99", fontSize: "0.85rem", marginTop: "6px" }}>
            {role === "super_admin" ? "Super Admin" : role === "admin" ? "Admin" : "Member"} · {user?.email}
          </p>
        </div>

        {/* Tiles */}
        <div style={{ marginBottom: "1rem" }}>
          <p style={{ color: "#4f5f80", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>
            Quick Actions
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "1rem",
          }}>
            {tiles.map((tile) => (
              <Tile
                key={tile.label}
                icon={tile.icon}
                label={tile.label}
                description={tile.description}
                onClick={() => navigate(tile.path)}
              />
            ))}
          </div>
        </div>
        <br />
        <h2 className="text-white">Stats</h2>
        {/* Stats */}
        {stats && (
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "2.5rem" }}>
            {statCards.map((s) => (
              <StatCard key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        )}

        
      </div>
    </div>
  );
}

export default Dashboard;