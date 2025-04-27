import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import dotenv from "dotenv";
dotenv.config();

// 🔑 SDK instance using your wallet's private key
export const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.PRIVATE_KEY!,
  "sepolia", // or your preferred chain
  { secretKey: process.env.THIRDWEB_SECRET_KEY }
);

// 🧱 Preload contracts (safely without top-level await)
let tokenContract: any;
let nftDrop: any;

export async function initThirdwebContracts() {
  tokenContract = await sdk.getContract(process.env.TOKEN_CONTRACT!, "token");
  nftDrop = await sdk.getContract(process.env.NFT_CONTRACT!, "nft-drop");
}

export { tokenContract, nftDrop };
