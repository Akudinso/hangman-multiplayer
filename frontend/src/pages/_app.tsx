import type { AppProps } from "next/app";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import { DarkModeProvider } from "@/context/DarkModeContext";
import "@/styles/globals.css"; // optional: if you have global styles
import { BalanceProvider } from "@/context/BalanceContext";

export default function App({ Component, pageProps, router }: AppProps) {
  const isSingleplayer = router.pathname.startsWith("/singleplayer");

  return (
    <ThirdwebProvider
      activeChain={Sepolia}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
    >
      <DarkModeProvider>
        <BalanceProvider>
        {/* Example: Wrap singleplayer routes in a custom layout */}
        <div style={{ background: isSingleplayer ? "#0F0F0F" : "white" }}>
          <Component {...pageProps} />
        </div>
        </BalanceProvider>
      </DarkModeProvider>
    </ThirdwebProvider>
  );
}
