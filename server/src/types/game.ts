export type Player = {
  id: string;
  role: "player1" | "player2";
};

export type Difficulty = "easy" | "medium" | "hard";

export type GameRoom = {
  players: { id: string; role: "player1" | "player2" }[];
  word: string;
  hint: string;
  guessedLetters: string[];
  currentTurn: string;
  maxTries: number;
  failedTries: Record<string, number>;
  correctGuesses: Record<string, number>; // ✅ <-- Add this
  gameOver: boolean;
  difficulty: Difficulty; // 👈 ADD THIS

};

