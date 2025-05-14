// src/pages/index.tsx
import Header from "@/components/Header";
import GameBoard from "@/components/gameBoard";
import Leaderboard from "@/components/leaderBoard";

export default function Home() {
  return (
    <>
      <Header />
      <GameBoard />
      <Leaderboard />
    </>
  );
}
