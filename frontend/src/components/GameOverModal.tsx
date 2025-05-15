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

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  correct,
  total,
  reward,
  onHome,
  onNext,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "620px",
        height: "460px",
        borderRadius: "28px",
        backgroundColor: "#151619",
        boxShadow: "4px 4px 40px 0px #A259FF26",
        backdropFilter: "blur(10px)",
        zIndex: 9999,
        padding: "2rem",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2
        style={{
          fontFamily: "Athletics, sans-serif",
          fontWeight: 500,
          fontSize: "32px",
          lineHeight: "120%",
          color: "#FFA736",
          marginBottom: "1.5rem",
        }}
      >
        Game Over
      </h2>

      <p
        style={{
          fontFamily: "Athletics, sans-serif",
          fontWeight: 700,
          fontSize: "32px",
          lineHeight: "120%",
          color: "#FFFFFF",
          marginBottom: "1rem",
        }}
      >
        Correct Guesses: {correct} out of {total} word
      </p>

      <p
        style={{
          fontFamily: "Athletics, sans-serif",
          fontWeight: 500,
          fontSize: "24px",
          lineHeight: "120%",
          color: "#FFFFFF",
          marginBottom: "2.5rem",
        }}
      >
        Token reward: {reward}
      </p>

      <div style={{ display: "flex", gap: "30px" }}>
        <button
          onClick={onHome}
          style={{
            width: "159px",
            height: "56px",
            padding: "12px 20px",
            borderRadius: "12px",
            border: "1px solid #A259FF",
            backgroundColor: "transparent",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Return Home
        </button>

        <button
          onClick={onNext}
          style={{
            width: "120px",
            height: "56px",
            padding: "12px 20px",
            borderRadius: "12px",
            backgroundColor: "#A259FF",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
