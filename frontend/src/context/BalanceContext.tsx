import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { sdk } from "@/config/thirdweb";

interface BalanceContextType {
  balance: string;
  refreshBalance: () => void;
}

const BalanceContext = createContext<BalanceContextType>({
  balance: "0",
  refreshBalance: () => {},
});

export const useBalance = () => useContext(BalanceContext);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState("0");
  const address = useAddress();

  const fetchBalance = useCallback(async () => {
    if (!address || !sdk) return;

    try {
      const tokenAddress = process.env.NEXT_PUBLIC_TOKEN_CONTRACT!;
      const token = await sdk.getContract(tokenAddress, "token");
      const result = await token.erc20.balanceOf(address);
      setBalance(result.displayValue);
    } catch (err) {
      console.error("Balance fetch failed:", err);
    }
  }, [address]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return (
    <BalanceContext.Provider value={{ balance, refreshBalance: fetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};
