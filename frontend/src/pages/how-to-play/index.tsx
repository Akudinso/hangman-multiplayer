import Sidebar from "@/components/Sidebar";
import HeaderBar from "@/components/HeaderBar";
import HelpIcon from "@/components/HelpIcon";

export default function HowToPlay() {
  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", background: "#0F0F0F", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, padding: "2rem", color: "#fff", overflowY: "auto" }}>
        <HeaderBar />
        <h1 style={{ fontSize: "28px", marginBottom: "1rem" }}>How to Play</h1>

        <section style={{ marginBottom: "2rem" }}>
          <h3>🎯 Objective</h3>
          <p>Guess the hidden word before time runs out. Each correct letter earns progress; the goal is to complete the word in 6 tries.</p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3>💰 WordBit Rewards</h3>
          <ul>
            <li>Easy: 3 WB per win</li>
            <li>Medium: 6 WB per win</li>
            <li>Hard: 9 WB per win</li>
          </ul>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3>🎖️ NFT Badge</h3>
          <p>Complete 10 levels in a difficulty tier to mint a collectible WordBit NFT!</p>
        </section>

        <section style={{ marginBottom: "2rem" }}>
          <h3>⌨️ Controls</h3>
          <p>Click letters to guess, or use keyboard. Use <strong>Reveal</strong> to get a hint or <strong>Skip</strong> to move to another word.</p>
        </section>

        <HelpIcon />
      </div>
    </div>
  );
}
