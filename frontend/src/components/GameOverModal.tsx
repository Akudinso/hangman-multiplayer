// components/GameOverModal.tsx
import React from "react";

interface GameOverModalProps {
  isOpen: boolean;
  correct: number;
  total: number;
  reward: number;
  onHome: () => void;
  onNext: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, correct, total, reward, onHome, onNext }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "calc(50% - 230px)",
        left: "calc(50% - 310px)",
        width: "620px",
        height: "460px",
        borderRadius: "28px",
        backgroundColor: "#151619",
        boxShadow: "4px 4px 40px 0px #A259FF26",
        color: "#fff",
        zIndex: 9999,
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h2 style={{ fontSize: "32px", color: "#FFA736", marginBottom: "1rem" }}>Game Over</h2>
      <p style={{ fontSize: "32px", fontWeight: 700 }}>Correct Guesses: {correct} out of {total} word</p>
      <p style={{ fontSize: "24px", marginTop: "1rem" }}>Token reward: {reward}</p>

      <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "3rem" }}>
        <button
          onClick={onHome}
          style={{
            width: "159px",
            height: "56px",
            borderRadius: "12px",
            border: "1px solid #A259FF",
            background: "transparent",
            color: "#fff",
            fontSize: "16px",
          }}
        >
          Return Home
        </button>
        <button
          onClick={onNext}
          style={{
            width: "120px",
            height: "56px",
            borderRadius: "12px",
            background: "#A259FF",
            color: "#fff",
            fontSize: "16px",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
