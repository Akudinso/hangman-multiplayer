// components/Sidebar.tsx
import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";

type SidebarProps = {
  onLogout?: () => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const router = useRouter();

  const navigate = (path: string) => router.push(path);

  const buttonList = [
    { label: "▶ Play", path: "/singleplayer/difficulty-selection" },
    { label: "📦 Inventory", path: "/inventory" },
    { label: "🎴 Source NFTs", path: "/source-nfts" },
    { label: "🏆 Leaderboard", path: "/leaderboard" },
    { label: "❓ How to Play", path: "/how-to-play" },
  ];

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
      {/* Logo and Navigation */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* ✅ WordBit Logo */}
        <div style={{ textAlign: "center" }}>
          <Image
            src="/Wordbit-logo.png"
            alt="WordBit Logo"
            width={180}
            height={40}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
          {buttonList.map((btn, index) => (
            <button
              key={index}
              onClick={() => navigate(btn.path)}
              style={navButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(90deg, #DFD4C0 0%, #C2B9AA 50%, #908A7E 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
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

const navButtonStyle: React.CSSProperties = {
  width: "190px",
  height: "52px",
  padding: "12px 4px",
  borderRadius: "6px",
  background: "transparent",
  color: "#fff",
  fontWeight: 500,
  fontSize: "16px",
  textAlign: "left",
  border: "none",
  cursor: "pointer",
  transition: "background 0.3s ease",
};

export default Sidebar;
