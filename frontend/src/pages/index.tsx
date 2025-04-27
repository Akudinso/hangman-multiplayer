import GameBoard from "@/components/gameBoard"; // ✅ Import the only game UI
import Leaderboard from "@/components/leaderBoard";
import { ConnectWallet } from "@thirdweb-dev/react";

export default function Home() {
  return (
    <div>
      <nav style={{ padding: "1rem", display: "flex", justifyContent: "flex-end" }}>
        <ConnectWallet />
      </nav>

      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "2rem" }}>🎮 Web3 Hangman</h1>

        <GameBoard />
        <Leaderboard />
      </main>
    </div>
  );
}
