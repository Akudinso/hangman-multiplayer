// pages/singleplayer/game-mode-selection.tsx
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import HelpIcon from "@/components/HelpIcon";
import { useRouter } from "next/router";
import { useDisconnect } from "@thirdweb-dev/react";

export default function GameModeSelection() {
  const router = useRouter();
  const disconnect = useDisconnect();
  const [selectedMode, setSelectedMode] = useState<"single" | "multi">("single");

  const handleSelect = () => {
    if (selectedMode === "single") {
      router.push("/singleplayer/difficulty-selection");
    } else {
      router.push("/multiplayer/lobby"); // Update if you have multiplayer screen
    }
  };

  const buttonStyle = (active: boolean) => ({
    width: "310px",
    height: "61px",
    padding: "16px 64px",
    borderRadius: "28px",
    backgroundColor: active ? "#685343" : "transparent",
    border: "2px solid #7F5B57",
    color: "#fff",
    fontSize: "20px",
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.3s",
  });

  return (
    <div style={{ display: "flex", backgroundColor: "#0F0F0F", maxHeight: "100vh", position: "relative" }}>
      {/* 🌌 Background */}
      <div
        style={{
          position: "absolute",
          top: "-208px",
          left: "0",
          width: "1440px",
          height: "1440px",
          opacity: 0.15,
          zIndex: 0,
          backgroundImage: "url('/bg13-3.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Sidebar */}
      <Sidebar onLogout={disconnect} />

      {/* Main content */}
      <div style={{ flex: 1, padding: "2rem", zIndex: 1, color: "#fff", position: "relative" }}>
        <HeaderBar />

        {/* Title & Tagline */}
        <div style={{ marginTop: "7rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Choose your mode</h1>
          <p style={{ fontSize: "16px", color: "#aaa" }}>Think fast, spell smart</p>
        </div>

        {/* Mode buttons */}
        <div style={{ marginTop: "3rem", display: "flex", justifyContent: "center", gap: "20px" }}>
          <button
            onClick={() => setSelectedMode("single")}
            style={buttonStyle(selectedMode === "single")}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#685343")}
            onMouseLeave={(e) => {
              if (selectedMode !== "single") e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            🎮 Single Player
          </button>

          <button
            onClick={() => setSelectedMode("multi")}
            style={buttonStyle(selectedMode === "multi")}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#685343")}
            onMouseLeave={(e) => {
              if (selectedMode !== "multi") e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            🧑‍🤝‍🧑 Multiplayer
          </button>
        </div>

        {/* Select button */}
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button
            onClick={handleSelect}
            style={{
              width: "220px",
              height: "56px",
              padding: "12px 20px",
              borderRadius: "12px",
              backgroundColor: "#A259FF",
              color: "#fff",
              fontWeight: 600,
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Select
          </button>
        </div>

        <HelpIcon />
      </div>
    </div>
  );
}
