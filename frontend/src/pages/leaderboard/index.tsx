import React from "react";
import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import Image from "next/image";

export default function LeaderboardComingSoon() {
  return (
    <div style={styles.page}>
      {/* Background Wrapper */}
      <div style={styles.backgroundWrapper}>
        <Image
          src="/bg13-3.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          style={styles.backgroundImage}
        />
      </div>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div style={styles.content}>
        <HeaderBar />

        <div style={styles.center}>
          <h1 style={styles.title}>🏆 Leaderboard</h1>
          <p style={styles.subtitle}>Coming Soon...</p>
          <div style={styles.loader}></div>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  page: {
    display: "flex",
    backgroundColor: "#0F0F0F",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    position: "relative",
  },
  backgroundWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: 0,
    pointerEvents: "none", // 👈 makes background non-blocking
  },
  backgroundImage: {
    opacity: 0.15,
  },
  content: {
    flex: 1,
    padding: "2rem",
    zIndex: 2, // 👈 must be higher than background
    color: "#fff",
    position: "relative",
  },
  center: {
    textAlign: "center",
    marginTop: "8rem",
  },
  title: {
    fontSize: "32px",
    fontWeight: 700,
    marginBottom: "1rem",
  },
  subtitle: {
    fontSize: "20px",
    color: "#A259FF",
    fontWeight: 500,
  },
  loader: {
    margin: "2rem auto 0",
    width: "40px",
    height: "40px",
    border: "4px solid #fff",
    borderTop: "4px solid #A259FF",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};
