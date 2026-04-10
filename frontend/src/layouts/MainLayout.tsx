import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import type { ReactNode } from "react";

function MainLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080f1f" }}>
      <Sidebar onCollapseChange={setCollapsed} />
      <div
        style={{
          marginLeft: collapsed ? "60px" : "220px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          transition: "margin-left 0.25s cubic-bezier(0.4,0,0.2,1)",
          minWidth: 0,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default MainLayout;