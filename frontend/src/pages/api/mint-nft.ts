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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  const { address } = req.body;

  if (!address || typeof address !== "string") {
    return res.status(400).json({ error: "Wallet address is required and must be a string." });
  }

  try {
    const nftDrop = await sdk.getContract(process.env.NEXT_PUBLIC_NFT_CONTRACT!, "nft-drop");

    const tx = await nftDrop.erc721.claimTo(address, 1);
    console.log(`🎁 NFT minted and sent to ${address}:`, tx);

    return res.status(200).json({
      success: true,
      message: `NFT successfully minted to ${address}`,
      transaction: tx,
    });
  } catch (error: any) {
    console.error("Minting failed:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal Server Error during NFT mint",
    });
  }
}
