// components/HeaderBar.tsx
import { ConnectWallet } from "@thirdweb-dev/react";

const HeaderBar = () => {
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
      {/* 🔊 Speaker Icon */}
      <div
        style={{
          width: "60px",
          height: "60px",
          borderRadius: "10000px",
          backgroundColor: "#FFFFFF40",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        🔊
      </div>

      {/* Connect Wallet & Balance */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {/* ✅ Thirdweb's built-in connect wallet button */}
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

        {/* Token Balance placeholder */}
        <div style={{ color: "#FFD700", fontWeight: "bold" }}>💰 0.0 WB</div>
      </div>
    </div>
  );
};

export default HeaderBar;
