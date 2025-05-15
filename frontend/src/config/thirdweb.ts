// src/config/thirdweb.ts
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

let sdk: ThirdwebSDK | undefined = undefined;

declare global {
    interface Window {
      ethereum?: any; // Or use a specific MetaMask type
    }
  }
  
  if (typeof window !== "undefined" && window.ethereum)
   {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  sdk = new ThirdwebSDK(provider);
}

export { sdk, ThirdwebSDK }; // ✅ fix: also export ThirdwebSDK
