// components/HeaderBar.tsx
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useEffect, useRef, useState } from "react";
import { sdk } from "@/config/thirdweb";

const HeaderBar = () => {
  const address = useAddress();
  const [balance, setBalance] = useState("0");

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch token balance
  const fetchBalance = async () => {
    if (!address || !sdk) return;
    try {
      const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT!;
      const token = await sdk.getContract(tokenAddress, "token");
      const result = await token.erc20.balanceOf(address);
      setBalance(result.displayValue);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [address]);

  // Load and play/pause music
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio("/background-music.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.4;
    }

    if (isPlaying) {
      audioRef.current.play().catch((err) => console.error("Audio play failed:", err));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Toggle music
  const toggleSound = () => setIsPlaying((prev) => !prev);

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        marginBottom: "2rem",
      }}
    >
      {/* 🔊 Speaker Icon Toggle */}
      <div
        onClick={toggleSound}
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "10000px",
          backgroundColor: "#FFFFFF40",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        title={isPlaying ? "Mute Music" : "Play Music"}
      >
        {isPlaying ? "🔊" : "🔇"}
      </div>

      {/* Wallet and Token Display */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <ConnectWallet
          theme="dark"
          btnTitle="Connect Wallet"
          modalTitle="Login to WordBit"
          style={{
            padding: "8px 16px",
            borderRadius: "86px",
            border: "1px solid #4D6947",
            backgroundColor: "#1F1F1F",
            color: "#4D6947",
            fontWeight: "500",
            fontSize: "14px",
          }}
        />
        <div style={{ color: "#ffffff", fontWeight: "bold" }}>🪙 {balance} WB</div>
      </div>
    </div>
  );
};

export default HeaderBar;
