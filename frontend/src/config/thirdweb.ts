// src/config/thirdweb.ts
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { ethers } from "ethers";

let sdk: ThirdwebSDK | undefined = undefined;

if (typeof window !== "undefined" && (window as any).ethereum) {
  const provider = new ethers.providers.Web3Provider((window as any).ethereum);
  sdk = new ThirdwebSDK(provider);
}

export { sdk, ThirdwebSDK }; // ✅ fix: also export ThirdwebSDK
