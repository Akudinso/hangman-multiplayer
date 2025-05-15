// pages/index.tsx
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect } from "react";

export default function WordBitWelcome() {
  const router = useRouter();
  const address = useAddress();

  useEffect(() => {
    if (address) {
      router.push("/singleplayer/game-mode-selection");
    }
  }, [address, router]); // ✅ warning resolved
  

  useEffect(() => {
    document.title = "WordBit - Welcome";
  }, []);

  const handleGuestMode = () => {
    router.push("/singleplayer/game-mode-selection");
  };

  return (
    <div style={styles.wrapper}>
      {/* Background image */}
      <Image
        src="/bg13-3.png" // Replace this with the actual background path from designer
        alt="Background"
        layout="fill"
        objectFit="cover"
        style={{ zIndex: 0, opacity: 0.15 }}
      />

      {/* Content */}
      <div style={styles.content}>
        <div style={styles.logoBlock}>
          <Image
            src="/Wordbit-logo.png"
            alt="WordBit Logo"
            width={417}
            height={76}
            style={styles.logo}
          />
          <p style={styles.tagline}>WordBit; Think Fast. Spell Smart.</p>
        </div>

        <div style={styles.buttonRow}>
          <div style={styles.walletBtn}>
            <ConnectWallet
              theme="dark"
              btnTitle="Connect Wallet"
              modalTitle="Login to WordBit"
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#A259FF",
                color: "#fff",
                borderRadius: "12px",
                padding: "12px 20px",
                fontWeight: "bold",
                fontSize: "16px",
                border: "none",
                cursor: "pointer",
              }}
            />
          </div>
          <button onClick={handleGuestMode} style={styles.guestBtn}>
            Use Guest Mode
          </button>
        </div>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: "relative",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    backgroundColor: "#0F0F0F",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  logoBlock: {
    textAlign: "center",
    marginBottom: "60px",
  },
  logo: {
    height: "76px",
    marginBottom: "28px",
  },
  tagline: {
    color: "#FFFFFF",
    fontFamily: "Athletics, sans-serif",
    fontWeight: 500,
    fontSize: "20px",
    lineHeight: "140%",
  },
  buttonRow: {
    display: "flex",
    gap: "60px",
    justifyContent: "center",
    alignItems: "center",
  },
  walletBtn: {
    width: "181px",
    height: "56px",
  },
  guestBtn: {
    width: "188px",
    height: "56px",
    backgroundColor: "transparent",
    color: "#A259FF",
    border: "1px solid #A259FF",
    borderRadius: "12px",
    padding: "12px 20px",
    fontWeight: "bold",
    fontSize: "16px",
    cursor: "pointer",
  },
};
