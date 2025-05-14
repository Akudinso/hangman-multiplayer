// components/Sidebar.tsx
import React from "react";

type SidebarProps = {
  onLogout?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  return (
    <div
      style={{
        width: "250px",
        height: "100vh",
        backgroundColor: "#1C1C1C",
        padding: "29px 32px",
        borderTopRightRadius: "16px",
        borderBottomRightRadius: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top Navigation */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ width: "219px", height: "40px", backgroundColor: "#333", borderRadius: "8px" }} /> {/* Logo placeholder */}
        <button style={navButtonStyle()}>▶ Play</button>
        <button style={navButtonStyle()}>📦 Inventory</button>
        <button style={navButtonStyle()}>🎴 Source NFTs</button>
        <button style={navButtonStyle()}>🏆 Leaderboard</button>
        <button style={navButtonStyle()}>❓ How to Play</button>
      </div>

      {/* Logout Button */}
      <button
        onClick={onLogout}
        style={{
          width: "160px",
          height: "58px",
          borderRadius: "12px",
          border: "1px solid #AD2E1E",
          color: "#AD2E1E",
          background: "transparent",
          fontWeight: 600,
          alignSelf: "center",
          cursor: "pointer",
        }}
      >
        🔓 Logout
      </button>
    </div>
  );
};

const navButtonStyle = () => ({
  width: "190px",
  height: "52px",
  padding: "12px 4px",
  borderRadius: "6px",
  background: "transparent",
  color: "#fff",
  fontWeight: 500,
  fontSize: "16px",
  textAlign: "left" as const,
  border: "1px solid #444",
  cursor: "pointer",
});

export default Sidebar;
