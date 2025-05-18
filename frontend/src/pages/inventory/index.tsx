import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import HelpIcon from "@/components/HelpIcon";
import { useEffect } from "react";

export default function InventoryComingSoon() {
  useEffect(() => {
    document.title = "WordBit - Inventory";
  }, []);

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", backgroundColor: "#0F0F0F", overflow: "hidden" }}>
      <Sidebar />

      <div style={{ flex: 1, position: "relative", display: "flex", flexDirection: "column" }}>
        <HeaderBar />

        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* Glowing Text Animation */}
          <h1 style={glowTextStyle}>🧳 Inventory Coming Soon...</h1>
          <p style={{ color: "#aaa", marginTop: "1rem", fontSize: "16px" }}>
            Your unlocked items and NFTs will appear here.
          </p>
        </div>

        <div style={{ position: "absolute", bottom: 60, right: 60 }}>
          <HelpIcon />
        </div>
      </div>
    </div>
  );
}

const glowTextStyle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: "bold",
  fontFamily: "Athletics, sans-serif",
  color: "#A259FF",
  textShadow: "0 0 10px #A259FF66, 0 0 20px #A259FF44",
  animation: "glow 1.8s ease-in-out infinite alternate",
};


