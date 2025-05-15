// pages/api/mint-nft.ts
import { NextApiRequest, NextApiResponse } from "next";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import dotenv from "dotenv";

dotenv.config();

const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.PRIVATE_KEY!,
  "sepolia",
  { secretKey: process.env.THIRDWEB_SECRET_KEY }
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Wallet address required" });
  }

  try {
    const nftDrop = await sdk.getContract(process.env.NFT_CONTRACT!, "nft-drop");

    const tx = await nftDrop.erc721.claimTo(address, 1);
    console.log(`🎁 NFT sent to ${address}`, tx);

    return res.status(200).json({ success: true, tx });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Mint error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
  }
  
}
