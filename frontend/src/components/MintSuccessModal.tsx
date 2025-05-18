// components/MintSuccessModal.tsx
import React from "react";

interface MintSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  txHash: string;
}

const MintSuccessModal: React.FC<MintSuccessModalProps> = ({ isOpen, onClose, txHash }) => {
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
      <h2 style={{ fontSize: "32px", color: "#22C55E", marginBottom: "1rem" }}>🎉 Congratulations!!!</h2>
      <p style={{ fontSize: "28px", fontWeight: 600, marginBottom: "1.5rem" }}>NFT Minted Successfully</p>
      <p style={{ fontSize: "16px", marginBottom: "1rem" }}>Track it on Etherscan:</p>
      <a
        href={`https://sepolia.etherscan.io/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#A259FF",
          fontSize: "14px",
          wordBreak: "break-all",
          display: "inline-block",
          marginBottom: "2rem",
        }}
      >
        {txHash}
      </a>
      <div>
        <button
          onClick={onClose}
          style={{
            width: "200px",
            height: "48px",
            background: "#A259FF",
            borderRadius: "12px",
            color: "#fff",
            fontWeight: 600,
            fontSize: "16px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MintSuccessModal;
